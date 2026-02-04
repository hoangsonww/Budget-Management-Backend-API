import { createTheme } from '@mui/material/styles';

export const getDesignTokens = mode => {
  const isDark = mode === 'dark';
  const brand = {
    primary: '#1f7a63',
    primaryDark: '#0e3f32',
    secondary: '#f2b35a',
    ink: '#1b1b1b',
    inkSoft: '#3c3c3c',
    paper: '#ffffff',
    paperDark: '#141c19',
    backdrop: '#f5f1e9',
    backdropDark: '#0e1512',
    mist: '#e6ded0',
    mistDark: '#22302b',
  };

  return {
    palette: {
      mode,
      primary: {
        main: brand.primary,
        dark: brand.primaryDark,
        contrastText: '#f7f6f2',
      },
      secondary: {
        main: brand.secondary,
        contrastText: brand.ink,
      },
      success: {
        main: '#2b9b77',
      },
      warning: {
        main: '#f0a24d',
      },
      error: {
        main: '#d84a4a',
      },
      info: {
        main: '#4a90c7',
      },
      background: {
        default: isDark ? brand.backdropDark : brand.backdrop,
        paper: isDark ? brand.paperDark : brand.paper,
      },
      text: {
        primary: isDark ? '#f5f1e7' : brand.ink,
        secondary: isDark ? '#b3c1bc' : '#5e5e5e',
      },
      divider: isDark ? brand.mistDark : brand.mist,
    },
    shape: {
      borderRadius: 18,
    },
    typography: {
      fontFamily: 'Sora, "Space Grotesk", sans-serif',
      h1: {
        fontFamily: 'Fraunces, serif',
        fontWeight: 700,
        fontSize: '3rem',
        letterSpacing: '-0.02em',
      },
      h2: {
        fontFamily: 'Fraunces, serif',
        fontWeight: 600,
        fontSize: '2.3rem',
      },
      h3: {
        fontWeight: 700,
      },
      h4: {
        fontWeight: 700,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
      subtitle1: {
        fontWeight: 500,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'background-color 0.3s ease, color 0.3s ease',
            backgroundImage: isDark
              ? 'radial-gradient(circle at top, rgba(28, 62, 51, 0.4), transparent 55%), linear-gradient(135deg, #0e1512 0%, #0f1916 60%, #101d19 100%)'
              : 'radial-gradient(circle at top, rgba(249, 214, 159, 0.4), transparent 55%), linear-gradient(135deg, #fdf8ef 0%, #f6f1e9 50%, #efe8dc 100%)',
          },
          a: {
            textDecoration: 'none',
            color: 'inherit',
          },
          code: {
            fontFamily: '"JetBrains Mono", monospace',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: isDark
              ? 'linear-gradient(135deg, rgba(20, 34, 29, 0.98), rgba(16, 26, 23, 0.92))'
              : 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(244, 238, 226, 0.94))',
            color: isDark ? '#f5f1e7' : brand.ink,
            borderBottom: `1px solid ${isDark ? brand.mistDark : brand.mist}`,
            boxShadow: isDark ? '0 12px 30px rgba(0,0,0,0.4)' : '0 10px 30px rgba(34, 46, 41, 0.12)',
            backdropFilter: 'blur(14px)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: `1px solid ${isDark ? brand.mistDark : brand.mist}`,
            boxShadow: isDark ? '0 18px 40px rgba(0,0,0,0.4)' : '0 18px 40px rgba(21, 32, 28, 0.12)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            border: `1px solid ${isDark ? brand.mistDark : brand.mist}`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            padding: '10px 20px',
            boxShadow: 'none',
          },
          containedPrimary: {
            background: 'linear-gradient(135deg, #1f7a63, #2aa88a)',
            color: '#f7f6f2',
          },
          outlinedPrimary: {
            borderColor: isDark ? '#3e6a5c' : '#b8d6cb',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontSize: '0.72rem',
            color: isDark ? '#d5e6df' : '#5a645f',
            backgroundColor: isDark ? 'rgba(24, 40, 35, 0.9)' : '#f2ede4',
          },
          body: {
            fontSize: '0.95rem',
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:nth-of-type(even)': {
              backgroundColor: isDark ? 'rgba(24, 33, 30, 0.65)' : 'rgba(246, 241, 233, 0.8)',
            },
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            border: `1px solid ${isDark ? brand.mistDark : brand.mist}`,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            backgroundColor: isDark ? 'rgba(20, 32, 28, 0.6)' : '#fff',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            borderRadius: 999,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: isDark ? '#24332d' : '#1f2a26',
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: isDark ? brand.mistDark : brand.mist,
          },
        },
      },
    },
  };
};

export const createAppTheme = mode => createTheme(getDesignTokens(mode));
