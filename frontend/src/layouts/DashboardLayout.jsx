import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar, useTheme } from '@mui/material'; 
import Sidebar from '../components/admin/Sidebar';
import Topbar from '../components/admin/Topbar';

const drawerWidth = 280;

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      
      {/* 1. Top Navigation Bar */}
      <Topbar drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} />

      {/* 2. Sidebar (Drawer) */}
      <Sidebar  
        drawerWidth={drawerWidth} 
        mobileOpen={mobileOpen} 
        handleDrawerToggle={handleDrawerToggle} 
      />

      {/* 3. Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {/* Spacer to push content below fixed AppBar */}
        <Toolbar /> 
        
        {/* Renders the child route (DashboardHome, CreateBlog, etc.) */}
        <Outlet /> 
      </Box>
    </Box>
  );
};

export default DashboardLayout;