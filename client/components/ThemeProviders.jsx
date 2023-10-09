"use client";

import { ThemeProvider } from "next-themes";

const ThemeProviders = ({ children }) => {
  return <ThemeProvider attribute="class"> {children} </ThemeProvider>;
};

export default ThemeProviders;
