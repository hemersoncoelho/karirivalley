"use client";

import { useContext } from "react";
import { NbThemeContext } from "@/components/providers/NbThemeProvider";

export function useNbTheme() {
  return useContext(NbThemeContext);
}
