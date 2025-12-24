import { createTheme, alpha } from '@mui/material/styles';

// =============================================================================
// 🎨 STEP 1: DEFINE COLOR TOKENS (Light & Dark)
// =============================================================================

// Common Brand Colors (Brand Identity)
const brandBase = {
  primary: '#ff9422ff',
  secondary: '#787873f8',
  
};

// Derive shades from brandBase
const getBrandShades = (base) => {
  const { primary, secondary } = base;
  return {
    primary: {
      light: alpha(primary, 0.6),
      main: primary,
      dark: alpha(primary, 0.8),
      contrastText: '#ffffff',
    },
    secondary: {
      light: alpha(secondary, 0.6),
      main: secondary,
      dark: alpha(secondary, 0.8),
      contrastText: '#ffffff',
    },
  };
};

const getDesignTokens = (mode) => {
  const brandShades = getBrandShades(brandBase);
  return {
    palette: {
      mode,
      primary: brandShades.primary,
      secondary: {
        main: mode === 'light' ? brandShades.secondary.dark : brandShades.secondary.light,
        light: mode === 'light' ? alpha(brandShades.secondary.main, 0.1) : alpha(brandShades.secondary.main, 0.3),
        dark: mode === 'light' ? alpha(brandShades.secondary.main, 0.9) : alpha(brandShades.secondary.main, 0.7),
        contrastText: mode === 'light' ? '#ffffff' : '#000000',
      },
      background: {
        default: mode === 'light' ? '#f5f7fa' : '#0f0f0f',
        paper: mode === 'light' ? '#ffffff' : '#1a1a1a',
      },
      text: {
        primary: mode === 'light' ? '#1a1a1a' : '#e3e3e3',
        secondary: mode === 'light' ? '#4f4f4f' : '#a3a3a3',
        disabled: mode === 'light' ? '#9e9e9e' : '#5c5c5c',
      },
      status: {
        error: mode === 'light' ? '#d32f2f' : '#ef5350',
        warning: mode === 'light' ? '#ed6c02' : '#ffa726',
        success: mode === 'light' ? '#2e7d32' : '#66bb6a',
        info: mode === 'light' ? '#0288d1' : '#29b6f6',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
      borderRadius: 12,
    },
  };
};

// =============================================================================
// ⚙️ STEP 2: COMPONENT OVERRIDES (Themed Components)
// =============================================================================
const getComponentOverrides = (theme) => {
  const isDarkMode = theme.palette.mode === 'dark';

  return {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: isDarkMode
              ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`
              : `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
          },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        rounded: { borderRadius: 16 },
        elevation0: {
          boxShadow: 'none',
          border: `1px solid ${alpha(theme.palette.text.disabled, 0.2)}`,
        },
        elevation1: {
          boxShadow: isDarkMode
            ? '0 4px 20px rgba(0,0,0,0.5)'
            : `0 4px 20px ${alpha(theme.palette.text.primary, 0.05)}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600 },
        filledPrimary: {
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          color: theme.palette.primary.main,
          '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.2) },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.text.disabled, 0.3),
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: alpha(theme.palette.primary.main, isDarkMode ? 0.1 : 0.03),
          color: theme.palette.primary.main,
          fontWeight: 700,
        },
        root: {
          borderBottom: `1px solid ${alpha(theme.palette.text.disabled, 0.1)}`,
        },
      },
    },
  };
};

// =============================================================================
// 🚀 EXPORT FUNCTION TO GENERATE THEME
// =============================================================================
export const getTheme = (mode = 'light') => {
  const themeConfig = getDesignTokens(mode);
  let theme = createTheme(themeConfig);

  theme = createTheme(theme, {
    components: getComponentOverrides(theme),
  });

  return theme;
};
