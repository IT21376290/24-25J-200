import Image from "next/image";
import sideImage from "../../../public/images/sun-rise.png";

export default function SignUpLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full flex max-lg:items-center max-lg:justify-center h-screen">
      <div className="w-full lg:w-1/2 h-screen">
        <Image src={sideImage} alt="sun rise image" className="min-h-screen w-full h-screen" />
      </div>

      <div className="flex-grow max-lg:absolute max-lg:w-full max-h-screen overflow-y-auto">{children}</div>
    </div>
  );
}
