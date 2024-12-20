import { createTheme } from '@mui/material/styles';

export const getDesignTokens = mode => {
  const brownMain = '#8B4513'; // Warm brown

  return {
    palette: {
      mode,
      primary: {
        main: brownMain,
      },
      secondary: {
        main: mode === 'light' ? '#f5f2e9' : '#333',
      },
      ...(mode === 'light'
        ? {
            background: {
              default: '#f5f2e9',
              paper: '#ffffff',
            },
            text: {
              primary: '#333',
            },
          }
        : {
            background: {
              default: '#2c2c2c',
              paper: '#3c3c3c',
            },
            text: {
              primary: '#eee',
            },
          }),
    },
    typography: {
      fontFamily: 'Poppins, sans-serif',
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
        },
      },
    },
  };
};

export const createAppTheme = mode => createTheme(getDesignTokens(mode));
