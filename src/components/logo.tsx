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
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/logo.png"
        alt="Logo"
        width={width}
        height={height}
        priority
      />

      {showText && (
        <span className="hidden sm:block text-lg md:text-2xl font-bold text-blue-600">
          EchoMind
        </span>
      )}
    </Link>
  );
}
