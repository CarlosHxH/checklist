// /src/theme/theme.ts
import { createTheme } from '@mui/material/styles'

// Create a simplified theme without the problematic functions
export const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: '#F9F9FE',
          paper: '#1565c0'//'#EEEEF9',
        },
        primary: {
          main: '#1976d2',//'#1976d2',
          light: '#000',
          dark: '#060e1b',
          contrastText: '#000',
        },
        secondary: {
          main: '#9c27b0',
          light: '#ba68c8',
          dark: '#7b1fa2',
        },
        text: {
          primary: '#333',
          secondary: '#444',
        },
        AppBar: {
          defaultBg: '#fff',
          darkBg: '#fff',
          darkColor: '#fff',
        }
      },
    },
    dark: {
      palette: {
        background: {
          default: '#2A4364',
          paper: '#112E4D',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});


export const customTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});