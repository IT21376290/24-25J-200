import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import { Rubik } from "next/font/google"; 
// Use your custom Footer component

const rubik = Rubik({
  subsets: ["latin"], // Ensures subset optimization
  weight: ["400", "600", "700"],
  variable: "--font-rubik", // Variable for global font use
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={rubik.variable}>
      <body suppressHydrationWarning className="bg-white text-gray-900">
        {/* <Header /> */}
        <main className="min-h-screen">{children}</main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
