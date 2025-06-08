import { useTheme } from "next-themes";
import Image from "next/image";

export const FullLogo = () => {
  const { resolvedTheme: isLight } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <Image
        src={isLight ? "/full-logo-light.svg" : "/full-logo-dark.svg"}
        alt="Arcie Art"
        width={100}
        height={100}
        className="w-24"
      />
    </div>
  );
};
