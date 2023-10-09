"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Image
      onClick={() =>
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
      }
      className="cursor-pointer sm:flex hidden"
      src={resolvedTheme === "dark" ? "/assets/icons/light_mode.svg" : "/assets/icons/dark_mode.svg"}
      alt="light mode"
      width={40}
      height={40}
    />
  );
};

export default ThemeSwitch;

