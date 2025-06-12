import { createTheme } from '@mui/material/styles';
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Custom primary color
      light: '#4791db',
      dark: '#115293',
      contrastText: '#fff',
    },
    background: {
      default: '#f0f2f5',
      paper: '#4791db',
    },
    text: {
      primary: '#222',
      secondary: '#555',
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
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1976d2',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 60,
          backgroundColor: '#1976d2'
        },
      },
    },
  },
});



export const themes = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: {
    light: {
      palette: {
        mode: 'light',
        background: {
          default: '#F9F9FE',
          paper: '#1976d2',//'#EEEEF9',
        },
        primary: {
          main: '#1976d2',
          light: '#63a4ff',
          dark: '#004ba0',
          contrastText: '#fff',
        },
        secondary: {
          main: '#9c27b0',
          light: '#d05ce3',
          dark: '#6a0080',
          contrastText: '#fff',
        },
        text: {
          primary: '#1A2027',
          secondary: '#3E5060',
        },
      },
    },
    dark: {
      palette: {
        mode: 'dark',
        background: {
          default: '#2A4364',
          paper: '#112E4D',
        },
        primary: {
          main: '#90caf9',
          light: '#e3f2fd',
          dark: '#42a5f5',
          contrastText: 'rgba(0, 0, 0, 0.87)',
        },
        secondary: {
          main: '#ce93d8',
          light: '#f3e5f5',
          dark: '#ab47bc',
          contrastText: 'rgba(0, 0, 0, 0.87)',
        },
        text: {
          primary: '#fff',
          secondary: 'rgba(255, 255, 255, 0.7)',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
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
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        className: 'appBar'
      },
      styleOverrides: {
        colorPrimary: 'red !important',
        root: {
          backgroundColor: '#000',
          color: '#1A2027',
        },
      },
    },
  },
});