"use client";

import Image from "next/image";

export const FullLogo = () => {
  return (
    <div className="w-24">
      {/* Light theme logo - visible by default */}
      <Image
        src="/full-logo-dark.svg"
        alt="Arcie Art"
        width={100}
        height={100}
        className="w-24 block dark:hidden"
        priority
      />
      {/* Dark theme logo - visible only in dark mode */}
      <Image
        src="/full-logo-light.svg"
        alt="Arcie Art"
        width={100}
        height={100}
        className="w-24 hidden dark:block"
        priority
      />
    </div>
  );
};
