import React from 'react';
import {
    Box, Drawer, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Toolbar, Divider, Typography, Avatar, Chip,
    IconButton, useTheme, alpha
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ drawerWidth, mobileOpen, handleDrawerToggle }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth();
    const theme = useTheme();

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'My Blogs', icon: <ArticleIcon />, path: '/dashboard/my-blogs' }, 
        { text: 'Create New', icon: <AddCircleIcon />, path: '/dashboard/create' },
        { text: 'Profile', icon: <PersonIcon />, path: '/dashboard/profile' },
    ];

    const handleNavigation = (path) => {
        navigate(path);
        if (mobileOpen) handleDrawerToggle();
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
            {/* Header */}
            <Toolbar sx={{ justifyContent: 'center', py: 2 }}>
                <Typography variant="h6" fontWeight={800} color="primary.main" letterSpacing={1}>
                    DevBlog Admin
                </Typography>
            </Toolbar>
            <Divider />

            {/* User Mini Profile */}
            <Box sx={{ p: 3, textAlign: 'center', position: 'relative' }}>
                <Box
                    sx={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: 70,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        borderRadius: '0 0 50% 50% / 0 0 20% 20%',
                        zIndex: 0,
                    }}
                />
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Avatar
                        src={user?.avatar}
                        sx={{
                            width: 76, height: 76, mx: 'auto', mb: 1.5,
                            border: `4px solid ${theme.palette.background.paper}`,
                            boxShadow: theme.shadows[3],
                        }}
                    />
                    <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                        {user?.username}
                    </Typography>
                    <Chip
                        label="Author" size="small"
                        sx={{
                            mt: 1, fontSize: '0.7rem', height: 22,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: 'primary.main', fontWeight: 700,
                        }}
                    />
                </Box>
            </Box>
            <Divider />

            {/* Navigation */}
            <List sx={{ px: 2, mt: 2, flex: 1 }}>
                {menuItems.map((item) => (
                    <ListItem disablePadding key={item.text} sx={{ mb: 1 }}>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => handleNavigation(item.path)}
                            sx={{
                                borderRadius: 3,
                                '&.Mui-selected': {
                                    bgcolor: 'primary.main',
                                    color: 'primary.contrastText',
                                    '&:hover': { bgcolor: 'primary.dark' },
                                    '& .MuiListItemIcon-root': { color: 'inherit' },
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: location.pathname === item.path ? 'inherit' : 'text.secondary', minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText 
                                primary={item.text} 
                                primaryTypographyProps={{ fontWeight: 600 }} 
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            {/* Logout & Footer */}
            <Box sx={{ p: 2 }}>
                <ListItemButton
                    onClick={handleLogout}
                    sx={{
                        color: 'error.main',
                        borderRadius: 3,
                        '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.1) },
                    }}
                >
                    <ListItemIcon sx={{ color: 'error.main', minWidth: 40 }}>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 700 }} />
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <Box component="nav" sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}>
            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', lg: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Desktop Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', lg: 'block' },
                    '& .MuiDrawer-paper': { 
                        boxSizing: 'border-box', 
                        width: drawerWidth, 
                        borderRight: `1px solid ${theme.palette.divider}`,
                        bgcolor: 'background.paper'
                    },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
};

export default Sidebar;