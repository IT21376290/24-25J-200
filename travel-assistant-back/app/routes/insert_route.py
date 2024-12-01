

from flask import current_app as app, jsonify, request
import pandas as pd
import numpy as np
import joblib
from sklearn.neighbors import NearestNeighbors
import os



def load_data(file_path):
    df = pd.read_csv(file_path)
    df['Categories'] = df['Categories'].apply(lambda x: x.split(','))  
    return df



current_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(current_dir, "../../tourist_places_sri_lanka.csv")

dataset = load_data(file_path)


def preprocess_data(df):
    df['normalized_cost'] = df['Cost'] / df['Cost'].max() 
    return df

dataset = preprocess_data(dataset)

sub_places_coordinates = {
    "Nine Arches Bridge": {"latitude": 6.881, "longitude": 81.046},
    "Little Adam's Peak": {"latitude": 6.872, "longitude": 81.049},
    "Mirissa Beach": {"latitude": 5.949, "longitude": 80.455},
    "Temple of the Tooth": {"latitude": 7.294, "longitude": 80.641},
    "Yala National Park": {"latitude": 6.399, "longitude": 81.521},
    "Polonnaruwa Ruins": {"latitude": 7.940, "longitude": 81.000},
    "Udawalawe National Park": {"latitude": 6.433, "longitude": 80.884},
    "Gregory Lake": {"latitude": 6.973, "longitude": 80.773},
    "Ruwanwelisaya Stupa": {"latitude": 8.350, "longitude": 80.403},
    "Ambewela Farm": {"latitude": 6.904, "longitude": 80.819},
    "Sigiriya Museum": {"latitude": 7.9519, "longitude": 80.7566},
    "Pidurangala Rock": {"latitude": 7.9068, "longitude": 80.7452},
    "Galle Fort": {"latitude": 6.0326, "longitude": 80.2165},
    "Jaya Sri Maha Bodhi": {"latitude": 8.3464, "longitude": 80.3888},
    "Adam's Peak": {"latitude": 6.809, "longitude": 80.499},
    "Arugam Bay": {"latitude": 6.839, "longitude": 81.836},
    "Haggala Garden": {"latitude": 6.914, "longitude": 80.785},
    "Dambulla Cave Temple": {"latitude": 7.856, "longitude": 80.650},
    "Horton Plains": {"latitude": 6.802, "longitude": 80.799},
    "Kataluwa Purvarama Maha Viharaya":{"latitude": 6.0426, "longitude":80.2681},
    "Thuparamaya":{"latitude":8.3505, "longitude":80.4023},
    "Jetavanaramaya Stupa":{"latitude":8.3563, "longitude":80.4100},
    "Mihintale":{"latitude":8.3501, "longitude":80.5049},
    "Wilpattu National Park":{"latitude":8.5297, "longitude":80.0144},
    "Kala Wewa Sanctuary":{"latitude":8.0124,"longitude":80.4691},
    "Hikkaduwa Beach": {"latitude": 6.1400, "longitude": 80.1000},
    "Unawatuna Beach": {"latitude": 6.0122, "longitude": 80.2478},
    "Tangalle Beach": {"latitude": 6.0243, "longitude": 80.7918},
    "Arugam Bay": {"latitude": 6.8390, "longitude": 81.8361},
    "Nilaveli Beach": {"latitude": 8.7193, "longitude": 81.2450},
    "Pasikudah Beach": {"latitude": 7.9325, "longitude": 81.5610},
    "Trincomalee Beach": {"latitude": 8.5886, "longitude": 81.2176},
    "Kalpitiya Beach": {"latitude": 8.1717, "longitude": 79.7384},
    "Benthota Beach": {"latitude": 6.4229, "longitude": 79.9955},
    "Weligama Beach": {"latitude": 5.9727, "longitude": 80.4297},
    "Jungle Beach": {"latitude": 6.0080, "longitude": 80.2524},
    "Pigeon Island Beach": {"latitude": 8.7175, "longitude": 81.2444},
    "Koggala Beach": {"latitude": 5.9945, "longitude": 80.3186},
    "Beruwala Beach": {"latitude": 6.4793, "longitude": 79.9797},
    "Induruwa Beach": {"latitude": 6.3918, "longitude": 79.9954},
    "Talpe Beach": {"latitude": 5.9967, "longitude": 80.3242},
    "Polhena Beach": {"latitude": 5.9497, "longitude": 80.5557}
     

}



def train_and_save_model(df):
    knn = NearestNeighbors(n_neighbors=5, metric='euclidean')
    knn.fit(df[['distance', 'normalized_cost']])
    joblib.dump(knn, 'knn_model.pkl')
    print("Model saved as knn_model.pkl")

base_dir = os.getenv('BASE_DIR', os.path.dirname(os.path.abspath(__file__)))

# Construct the path
model_path = os.path.join(base_dir, '../../knn_model.pkl')

if os.path.exists(model_path):
    knn_model = joblib.load(model_path)
    print("Model loaded from knn_model.pkl")
else:

    dataset['distance'] = dataset.apply(
        lambda row: np.sqrt(
            (row['Latitude'] - dataset['Latitude'].mean()) ** 2 + 
            (row['Longitude'] - dataset['Longitude'].mean()) ** 2
        ),
        axis=1
    )
    train_and_save_model(dataset)
    knn_model = joblib.load('knn_model.pkl')

@app.route("/recommend", methods=["POST"])
def recommend_trip():

    data = request.json
    user_location = data['location'] 
    days = data['days']
    budget = data['budget']  
    categories = data.get('categories', [])  


    dataset['distance'] = dataset.apply(
        lambda row: np.sqrt(
            (row['Latitude'] - user_location[0]) ** 2 +
            (row['Longitude'] - user_location[1]) ** 2
        ),
        axis=1
    )


    dataset['relevance'] = (
        dataset['normalized_cost'] * (budget / 10000) +
        dataset['distance'] * (days / 10)
    )


    filtered_data = dataset[
        (dataset['Cost'] <= budget) &
        (
            (not categories) or 
            (dataset['Categories'].apply(
                lambda x: any(cat.strip().lower() in map(str.lower, x) for cat in categories)
            ))
        )
    ]
    print("Filtered data:", filtered_data)


    if filtered_data.empty:
        return jsonify([]), 200 


    knn = NearestNeighbors(n_neighbors=min(5, len(filtered_data)), metric='euclidean')
    knn.fit(filtered_data[['distance', 'normalized_cost']])
    _, indices = knn.kneighbors(filtered_data[['distance', 'normalized_cost']])
    recommendations = filtered_data.iloc[indices[0]].to_dict(orient='records')


    enriched_response = []
    for rec in recommendations:
        sub_places_details = []
        for sub_place in rec.get('Sub Places', "").split(", "):
            sub_place_data = sub_places_coordinates.get(sub_place, {})
            if sub_place_data:
             
                sub_place_data['distance_to_user'] = np.sqrt(
                    (sub_place_data['latitude'] - user_location[0]) ** 2 +
                    (sub_place_data['longitude'] - user_location[1]) ** 2
                )
                sub_place_data['name'] = sub_place
                sub_places_details.append(sub_place_data)

      
        sub_places_details.sort(key=lambda x: x['distance_to_user'])

  
        enriched_response.append({
            "trip_name": rec["Place Name"],
            "cost": rec["Cost"],
            "categories": rec["Categories"],
            "sub_places": [
                {
                    "name": sp["name"],
                    "latitude": sp["latitude"],
                    "longitude": sp["longitude"]
                }
                for sp in sub_places_details
            ]
        })

    return jsonify(enriched_response)

