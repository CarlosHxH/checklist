'use client';
import React from "react";
import { ThemeProvider } from "@mui/material";
import { themes } from "./theme";
// Create a client component wrapper to handle the theme
const ThemeWrapper = ({ children }:{ children: React.ReactNode }) => {
  const colorPalette = [
    themes.palette.primary.dark,
    themes.palette.primary.main,
    themes.palette.primary.light,
  ];
    return (
      <ThemeProvider theme={colorPalette}>
        {children}
      </ThemeProvider>
    );
  };
export default ThemeWrapper;