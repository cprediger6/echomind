import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  width?: number;
  height?: number;
  showText?: boolean;
};

export default function Logo({
  width = 120,
  height = 40,
  showText = true,
}: LogoProps) {
  return (
    <Link href="/" className="flex items-center justify-center h-20">
      <Image
        src="/logo.png"
        alt="Logo"
        width={width}
        height={height}
        priority
      />
    </Link>
  );
}
