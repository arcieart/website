"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

export const FullLogo = () => {
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="w-24" />;

  const isLight = resolvedTheme === "light";

  return (
    <Image
      src={isLight ? "/full-logo-dark.svg" : "/full-logo-light.svg"}
      alt="Arcie Art"
      width={100}
      height={100}
      className="w-24"
      priority
    />
  );
};
