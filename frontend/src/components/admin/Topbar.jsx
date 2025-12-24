import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Avatar, Box, Chip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../context/AuthContext';

const Topbar = ({ drawerWidth, handleDrawerToggle }) => {
  const { user } = useAuth();

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
        <IconButton
          color="inherit"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' }, p: 1 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            letterSpacing: 0.5,
            color: 'primary.main',
          }}
        >
          Dashboard
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 1.5,
            py: 0.75,
            borderRadius: 3,
            bgcolor: 'grey.50',
            transition: 'background-color 0.2s ease',
            '&:hover': { bgcolor: 'grey.100' },
          }}
        >
          <Avatar
            src={user?.avatar}
            alt={user?.username}
            sx={{
              width: 36,
              height: 36,
              border: '2px solid',
              borderColor: 'primary.light',
            }}
          />
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{
              display: { xs: 'none', sm: 'block' },
              color: 'text.secondary',
            }}
          >
            {user?.username}
          </Typography>
          <Chip label="Author" size="small" sx={{ fontSize: '0.7rem', height: 20 }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;