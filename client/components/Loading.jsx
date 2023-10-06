"use client"

import { useEffect } from "react";
import Image from "next/image";
import { useSearchParams, usePathname } from "next/navigation";

const Loading = () => {
 
  return (
    <div className="w-full flex-center">
      <Image
        src="/assets/icons/loader.svg"
        width={50}
        height={50}
        alt="loader"
        className="object-contain"
      />
    </div>
  );
};

export default Loading;
