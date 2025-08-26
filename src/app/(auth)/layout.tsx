import Image from "next/image";
import PigeonImage from "../../../public/pigeon.webp";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full flex">
      <div className="w-1/2">
        <Image
          src={PigeonImage}
          alt="pigeon"
          width={500}
          height={500}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="w-1/2 flex items-center justify-center">{children}</div>
    </div>
  );
}
