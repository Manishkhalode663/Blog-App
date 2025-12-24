import { createTheme, alpha } from '@mui/material/styles';

// =============================================================================
// 🎨 STEP 1: DEFINE YOUR COLOR PALETTE HERE
// Change these hex codes to swap the entire theme instantly.
// =============================================================================
const brandColors = {
  // Primary Brand Colors – classic blue theme
  primary: {
    main: '#1976d2',      // Standard blue – buttons, headers, active states
    light: '#42a5f5',     // Light blue – backgrounds, hover
    dark: '#1565c0',      // Dark blue – deep accents
    contrastText: '#ffffff', // White text on blue
  },

  // Secondary Brand Colors – grey/blue accents
  secondary: {
    main: '#424242',      // Neutral grey – highlights, FABs
    light: '#e3f2fd',     // Very light blue – soft accents
    dark: '#1565c0',      // Same dark blue for consistency
    contrastText: '#ffffff',
  },

  // Background Colors
  background: {
    default: '#fafafa',   // Clean off-white page background
    paper: '#ffffff',     // Cards, Sidebar, Modals
  },

  // Text Colors
  text: {
    primary: '#212121',   // Near-black – main content
    secondary: '#757575', // Grey – muted text/labels
    disabled: '#bdbdbd',  // Light grey – disabled
  },

  // Status Colors (Semantic)
  status: {
    error: '#d32f2f',     // Red
    warning: '#ffa726',   // Amber
    success: '#388e3c',   // Green
    info: '#1976d2',      // Blue (same as primary)
  }
};
// =============================================================================
// ⚙️ STEP 2: THEME LOGIC (Do not need to edit often)
// This auto-generates the MUI look based on the colors above.
// =============================================================================

  export const theme = createTheme({
    palette: {
      mode: 'light',
      primary: brandColors.primary,
      secondary: brandColors.secondary,
      background: brandColors.background,
      text: brandColors.text,
      success: {
        main: brandColors.status.success,
        light: brandColors.secondary.light, // Fallback to brand secondary light
        dark: '#2e7d32',
        contrastText: brandColors.secondary.contrastText,
      },
      error: {
        main: brandColors.status.error,
        light: '#fee2e2',
        dark: '#b91c1c',
      },
      warning: {
        main: brandColors.status.warning,
        light: '#fef3c7',
        dark: '#b45309',
      },
      info: {
        main: brandColors.status.info,
        light: '#f3e8f4',
        dark: brandColors.primary.main,
      },
      // Automated Action Colors based on Primary Brand Color
      action: {
        hover: alpha(brandColors.primary.main, 0.04),
        selected: alpha(brandColors.primary.main, 0.08),
        disabled: alpha(brandColors.text.primary, 0.3),
        disabledBackground: alpha(brandColors.text.primary, 0.12),
        focus: alpha(brandColors.primary.main, 0.12),
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
      subtitle2: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
      borderRadius: 12, // Global Border Radius
    },
    shadows: [
      'none',
      `0 2px 4px ${alpha(brandColors.text.primary, 0.05)}`, // 1
      `0 4px 8px ${alpha(brandColors.text.primary, 0.05)}`, // 2
      `0 8px 16px ${alpha(brandColors.text.primary, 0.05)}`, // 3
      `0 12px 24px ${alpha(brandColors.primary.main, 0.15)}`, // 4 (Brand Glow)
      // ... Fill rest with defaults if needed, or customize
      ...Array(20).fill('none') // Placeholder for 5-24 to prevent crash if accessed, normally you'd map these
    ],
    components: {
      // 1. Buttons
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: 'none',
            '&:hover': { boxShadow: `0 4px 12px ${alpha(brandColors.primary.main, 0.2)}` },
          },
          containedPrimary: {
            // Auto-Gradient based on Primary Main and Dark
            background: `linear-gradient(135deg, ${brandColors.primary.main} 0%, ${brandColors.primary.dark} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${brandColors.primary.dark} 0%, ${brandColors.primary.main} 100%)`,
            },
          },
          outlinedPrimary: {
            borderColor: alpha(brandColors.primary.main, 0.5),
            '&:hover': {
              borderColor: brandColors.primary.main,
              backgroundColor: alpha(brandColors.primary.main, 0.04),
            },
          },
        },
      },
      // 2. Cards & Paper
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
          rounded: { borderRadius: 16 },
          elevation0: {
            boxShadow: 'none',
            border: `1px solid ${alpha(brandColors.text.disabled, 0.2)}`,
          },
          elevation1: {
            boxShadow: `0 4px 20px ${alpha(brandColors.text.primary, 0.05)}`,
          },
        },
      },
      // 3. Chips (Tags)
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 8, fontWeight: 600 },
          // Filled variant automatically uses Brand Alpha
          filledPrimary: {
            backgroundColor: alpha(brandColors.primary.main, 0.1),
            color: brandColors.primary.main,
            '&:hover': { backgroundColor: alpha(brandColors.primary.main, 0.2) },
          },
          outlinedPrimary: {
            borderColor: alpha(brandColors.primary.main, 0.3),
            color: brandColors.primary.main,
          },
        },
      },
      // 4. Inputs
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: brandColors.primary.light,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: 2,
              borderColor: brandColors.primary.main,
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: alpha(brandColors.text.disabled, 0.3),
            },
          },
        },
      },
      // 5. Tables
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor: alpha(brandColors.primary.main, 0.03),
            color: brandColors.primary.main,
            fontWeight: 700,
            borderBottom: `2px solid ${alpha(brandColors.primary.main, 0.08)}`,
          },
          root: {
            borderBottom: `1px solid ${alpha(brandColors.text.disabled, 0.1)}`,
          },
        },
      },
      // 6. Tooltips
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: brandColors.primary.dark,
            borderRadius: 6,
            fontSize: '0.75rem',
          },
          arrow: { color: brandColors.primary.dark },
        },
      },
      // 7. Dialogs
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
            boxShadow: `0 24px 48px ${alpha(brandColors.text.primary, 0.1)}`,
          },
        },
      },
      // 8. Menus (Dropdowns)
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
            boxShadow: `0 10px 30px ${alpha(brandColors.text.primary, 0.1)}`,
          }
        }
      }
    },
  });