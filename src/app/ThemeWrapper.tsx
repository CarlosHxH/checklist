'use client';
import React from "react";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
// Create a client component wrapper to handle the theme

const ThemeWrapper = ({ children }:{ children: React.ReactNode }) => {
    return (
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    );
  };
export default ThemeWrapper;