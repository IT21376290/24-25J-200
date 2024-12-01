from datetime import timedelta
import secrets
import os 

class Config:
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:@localhost:3306/travel_assistant_backend'

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True

    secret_key = secrets.token_hex(32)
    JWT_SECRET_KEY = secret_key
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    STATIC_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'app', 'static')
    UPLOAD_FOLDER = os.path.join(STATIC_FOLDER, 'uploads')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}


    @staticmethod
    def init_upload_folder():
        if not os.path.exists(Config.UPLOAD_FOLDER):
            os.makedirs(Config.UPLOAD_FOLDER)

    @staticmethod
    def allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS


Config.init_upload_folder()
