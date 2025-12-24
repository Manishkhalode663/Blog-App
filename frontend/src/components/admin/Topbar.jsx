import React from 'react';
import { 
  AppBar, Toolbar, IconButton, Typography, Avatar, Box, Chip, useTheme, Tooltip 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAuth } from '../../context/AuthContext';
import { useColorMode } from '../../context/ColorModeContext'; // Ensure this path is correct

const Topbar = ({ drawerWidth, handleDrawerToggle }) => {
  const { user } = useAuth();
  const theme = useTheme();
  const { toggleColorMode } = useColorMode();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { lg: `calc(100% - ${drawerWidth}px)` },
        ml: { lg: `${drawerWidth}px` },
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.3s ease',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
        
        {/* Mobile Menu Toggle */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { lg: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Page Title */}
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 800,
            letterSpacing: -0.5,
            color: 'text.primary',
          }}
        >
          Dashboard
        </Typography>

        {/* Right Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            
            {/* Theme Toggle */}
            <Tooltip title="Toggle Theme">
              <IconButton onClick={toggleColorMode} color="inherit">
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>

            {/* User Profile Chip */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 1.5,
                py: 0.75,
                borderRadius: 4,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'grey.100',
                transition: 'background-color 0.2s ease',
                '&:hover': { bgcolor: theme.palette.action.hover },
              }}
            >
              <Avatar
                src={user?.avatar}
                alt={user?.username}
                sx={{
                  width: 32,
                  height: 32,
                  border: `2px solid ${theme.palette.primary.main}`,
                }}
              />
              <Typography
                variant="body2"
                fontWeight={700}
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  color: 'text.primary',
                }}
              >
                {user?.username}
              </Typography>
              <Chip 
                label="Author" 
                size="small" 
                color="primary" 
                sx={{ 
                  fontSize: '0.65rem', 
                  height: 20, 
                  fontWeight: 700 
                }} 
              />
            </Box>
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Topbar;