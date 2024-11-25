import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div suppressHydrationWarning className="bg-white text-gray-900">
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </div>
  );
}
