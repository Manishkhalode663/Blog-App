import React from 'react';
import {
    Box, Drawer, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Toolbar, Divider, Typography, Avatar, Chip, Tooltip,
    IconButton
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CloseIcon from '@mui/icons-material/Close';

const Sidebar = ({ drawerWidth, mobileOpen, handleDrawerToggle }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth();

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
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                // Use theme background instead of hardcoded gradient
                bgcolor: 'background.paper', 
            }}
        >
            {/* Header */}
            <Toolbar sx={{ justifyContent: 'center', py: 2 }}>
                <Typography variant="h6" fontWeight={800} color="primary.main" letterSpacing={1}>
                    DevBlog Admin
                </Typography>
            </Toolbar>
            <Divider sx={{ borderColor: 'divider' }} />

            {/* User Mini Profile */}
            <Box sx={{ p: 3, textAlign: 'center', position: 'relative' }}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 64,
                        // Use theme primary main/light for gradient
                        background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                        borderRadius: '0 0 50% 50% / 0 0 20% 20%',
                        zIndex: 0,
                    }}
                />
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Avatar
                        src={user?.avatar}
                        alt={user?.username}
                        sx={{
                            width: 76,
                            height: 76,
                            mx: 'auto',
                            mb: 1.5,
                            bgcolor: 'primary.dark',
                            fontSize: 30,
                            fontWeight: 700,
                            border: '4px solid',
                            borderColor: 'background.paper',
                            boxShadow: (theme) => theme.shadows[3],
                        }}
                    />
                    <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                        {user?.username}
                    </Typography>
                    <Chip
                        label="Author"
                        size="small"
                        sx={{
                            mt: 1,
                            fontSize: '0.7rem',
                            height: 22,
                            bgcolor: 'primary.50', // Ensure this exists in theme or use alpha('primary.main', 0.1)
                            color: 'primary.main',
                            fontWeight: 700,
                            borderRadius: 1,
                            // Fallback if primary.50 isn't defined
                            background: (theme) => theme.palette.action.selected, 
                        }}
                    />
                </Box>
            </Box>
            <Divider sx={{ borderColor: 'divider' }} />

            {/* Navigation */}
            <List sx={{ px: 1.5, flex: 1 }}>
                {menuItems.map((item) => (
                    <ListItem disablePadding key={item.text}>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => handleNavigation(item.path)}
                            sx={{
                                borderRadius:  3, // Matches theme shape
                                px: 2,
                                py: 1.5,
                                mb: 1,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                    transform: 'translateX(6px)',
                                },
                                '&.Mui-selected': {
                                    bgcolor: 'primary.main', // Solid primary color for selected state often looks cleaner
                                    color: 'primary.contrastText',
                                    fontWeight: 700,
                                    boxShadow: (theme) => theme.shadows[4],
                                    '&:hover': {
                                        bgcolor: 'primary.dark',
                                    },
                                    '& .MuiListItemIcon-root': {
                                        color: 'primary.contrastText', // Icon turns white
                                    },
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    color: location.pathname === item.path ? 'primary.contrastText' : 'text.secondary',
                                    minWidth: 40,
                                    transition: 'color 0.3s',
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{ fontWeight: 600, fontSize: '0.95rem' }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Box sx={{ mt: 'auto', mb: 2 }}>
                <List sx={{ px: 1.5 }}>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={handleLogout}
                            sx={{
                                color: 'error.main',
                                borderRadius: 3,
                                px: 2,
                                py: 1.5,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    bgcolor: 'error.50', // Or alpha('error.main', 0.1)
                                    transform: 'translateX(6px)',
                                    // Fallback
                                    background: (theme) => theme.palette.action.hover, 
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: 'error.main', minWidth: 40 }}>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Logout"
                                primaryTypographyProps={{ fontWeight: 700 }}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
                
                {/* Footer User Info */}
                <Box
                    sx={{
                        mx: 1.5,
                        mb: 2,
                        p: 2,
                        borderRadius: 3,
                        bgcolor: 'background.default',
                        border: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar
                            src={user?.avatar}
                            alt={user?.username}
                            sx={{ width: 40, height: 40, fontSize: 18, fontWeight: 700 }}
                        />
                        <Box flex={1}>
                            <Typography variant="body2" fontWeight={700} noWrap color="text.primary">
                                {user?.username}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap display="block">
                                {user?.email}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );

    return (
        <>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                    position: 'absolute',
                    top: 16,
                    right: 32,
                    zIndex: 1300,
                    display: { lg: 'none' },
                    bgcolor: 'background.paper',
                    boxShadow: (theme) => theme.shadows[2],
                    '&:hover': {
                        bgcolor: 'background.default',
                    },
                }}
            >
                {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>

            <Box component="nav" sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}>
                {/* Mobile Drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', lg: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            backgroundImage: 'none',
                            bgcolor: 'background.paper',
                        },
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
                            borderRight: 'none',
                            boxShadow: (theme) => theme.shadows[4], // Use theme shadow
                            backgroundImage: 'none',
                            bgcolor: 'background.paper',
                        },
                    }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>
        </>
    );
};

export default Sidebar;
// import React from 'react';
// import {
//     Box, Drawer, List, ListItem, ListItemButton,
//     ListItemIcon, ListItemText, Toolbar, Divider, Typography, Avatar, Chip, Tooltip,
//     IconButton
// } from '@mui/material';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import ArticleIcon from '@mui/icons-material/Article';
// import AddCircleIcon from '@mui/icons-material/AddCircle';
// import PersonIcon from '@mui/icons-material/Person';
// import LogoutIcon from '@mui/icons-material/Logout';
// import MenuIcon from '@mui/icons-material/Menu';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import CloseIcon from '@mui/icons-material/Close';

// const Sidebar = ({ drawerWidth, mobileOpen, handleDrawerToggle }) => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { logout, user } = useAuth();

//     const menuItems = [
//         { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
//         { text: 'My Blogs', icon: <ArticleIcon />, path: '/dashboard/my-blogs' },
//         { text: 'My Drafts', icon: <ArticleIcon />, path: '/dashboard/my-drafts' },
//         { text: 'Create New', icon: <AddCircleIcon />, path: '/dashboard/create' },
//         { text: 'Profile', icon: <PersonIcon />, path: '/dashboard/profile' },
//     ];

//     const handleNavigation = (path) => {
//         navigate(path);
//         if (mobileOpen) handleDrawerToggle();
//     };

//     const handleLogout = async () => {
//         await logout();
//         navigate('/login');
//     };

//     const drawerContent = (
//         <Box
//             sx={{
//                 height: '100%',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
//             }}
//         >
//             {/* Header */}
//             <Toolbar sx={{ justifyContent: 'center', py: 2 }}>
//                 <Typography variant="h6" fontWeight={800} color="primary" letterSpacing={1}>
//                     DevBlog Admin
//                 </Typography>
//             </Toolbar>
//             <Divider sx={{ borderColor: 'rgba(0,0,0,0.08)' }} />

//             {/* User Mini Profile */}
//             <Box sx={{ p: 3, textAlign: 'center', position: 'relative' }}>
//                 <Box
//                     sx={{
//                         position: 'absolute',
//                         top: 0,
//                         left: 0,
//                         right: 0,
//                         height: 64,
//                         background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
//                         borderRadius: '0 0 50% 50% / 0 0 20% 20%',
//                         zIndex: 0,
//                     }}
//                 />
//                 <Box sx={{ position: 'relative', zIndex: 1 }}>
//                     <Avatar
//                         src={user?.avatar}
//                         alt={user?.username}
//                         sx={{
//                             width: 76,
//                             height: 76,
//                             mx: 'auto',
//                             mb: 1.5,
//                             bgcolor: 'primary.main',
//                             fontSize: 30,
//                             fontWeight: 700,
//                             border: '4px solid #fff',
//                             boxShadow: '0 6px 16px rgba(0,0,0,0.18)',
//                         }}
//                     />
//                     <Typography variant="subtitle1" fontWeight={700} color="text.primary">
//                         {user?.username}
//                     </Typography>
//                     <Chip
//                         label="Author"
//                         size="small"
//                         sx={{
//                             mt: 1,
//                             fontSize: '0.7rem',
//                             height: 22,
//                             bgcolor: 'rgba(25, 118, 210, 0.12)',
//                             color: 'primary.main',
//                             fontWeight: 700,
//                             borderRadius: 1,
//                         }}
//                     />
//                 </Box>
//             </Box>
//             <Divider sx={{ borderColor: 'rgba(0,0,0,0.08)' }} />

//             {/* Navigation */}
//             <List sx={{ px: 1.5, flex: 1 }}>
//                 {menuItems.map((item) => (
//                     //   <Tooltip key={item.text} title={item.text} placement="right" arrow>
//                     <ListItem disablePadding>
//                         <ListItemButton
//                             selected={location.pathname === item.path}
//                             onClick={() => handleNavigation(item.path)}
//                             sx={{
//                                 borderRadius: 4,
//                                 px: 2,
//                                 py: 1.5,
//                                 mb: 1,
//                                 transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//                                 '&:hover': {
//                                     bgcolor: 'rgba(25, 118, 210, 0.08)',
//                                     transform: 'translateX(6px)',
//                                 },
//                                 '&.Mui-selected': {
//                                     bgcolor: 'primary.50',
//                                     color: 'primary.main',
//                                     fontWeight: 700,
//                                     boxShadow: '0 8px 24px -6px rgba(25,118,210,0.3)',
//                                     '&:hover': {
//                                         bgcolor: 'primary.100',
//                                     },
//                                 },
//                                 '& .MuiListItemIcon-root': {
//                                     transition: 'transform 0.3s ease',
//                                 },
//                                 '&:hover .MuiListItemIcon-root': {
//                                     transform: 'scale(1.25)',
//                                 },
//                             }}
//                         >
//                             <ListItemIcon
//                                 sx={{
//                                     color: location.pathname === item.path ? 'primary.main' : 'inherit',
//                                     minWidth: 40,
//                                 }}
//                             >
//                                 {item.icon}
//                             </ListItemIcon>
//                             <ListItemText
//                                 primary={item.text}
//                                 primaryTypographyProps={{ fontWeight: 600, fontSize: '0.95rem' }}
//                             />
//                         </ListItemButton>
//                     </ListItem>

//                 ))}

//             </List> 

           
//             <Box sx={{ mt: 'auto', mb: 2 }}>
//                 <List sx={{ px: 1.5 }}>
//                     <ListItem disablePadding>
//                         <ListItemButton
//                             onClick={handleLogout}
//                             sx={{
//                                 color: 'error.main',
//                                 borderRadius: 4,
//                                 px: 2,
//                                 py: 1.5,
//                                 transition: 'all 0.3s ease',
//                                 '&:hover': {
//                                     bgcolor: 'rgba(244, 67, 54, 0.08)',
//                                     transform: 'translateX(6px)',
//                                 },
//                             }}
//                         >
//                             <ListItemIcon sx={{ color: 'error.main', minWidth: 40 }}>
//                                 <LogoutIcon />
//                             </ListItemIcon>
//                             <ListItemText
//                                 primary="Logout"
//                                 primaryTypographyProps={{ fontWeight: 700 }}
//                             />
//                         </ListItemButton>
//                     </ListItem>
//                 </List>
//                 <Box
//                     sx={{
//                         mx: 1.5,
//                         mb: 2,
//                         p: 2,
//                         borderRadius: 3,
//                         bgcolor: 'rgba(25, 118, 210, 0.04)',
//                         border: '1px solid rgba(25, 118, 210, 0.12)',
//                     }}
//                 >
//                     <Box display="flex" alignItems="center" gap={1.5}>
//                         <Avatar
//                             src={user?.avatar}
//                             alt={user?.username}
//                             sx={{ width: 40, height: 40, fontSize: 18, fontWeight: 700 }}
//                         />
//                         <Box flex={1}>
//                             <Typography variant="body2" fontWeight={700} noWrap>
//                                 {user?.username}
//                             </Typography>
//                             <Typography variant="caption" color="text.secondary">
//                                 {user?.email}
//                             </Typography>
//                         </Box>
//                     </Box>
//                 </Box>
//             </Box>

//         </Box>
//     );

//     return (
//         <>
//             {/* Toggle button for small screens - absolutely positioned top-left */}
//             <IconButton
//                 color="inherit"
//                 aria-label="open drawer"
//                 edge="start"
//                 onClick={handleDrawerToggle}
//                 sx={{
//                     position: 'absolute',
//                     top: 16,
//                     right: 32,
//                     zIndex: 1300,
//                     display: { sm: 'none' },
//                     bgcolor: 'rgba(255,255,255,0.9)',
//                     boxShadow: '0 4px 12px rgba(0,0,0,0.1)',

//                     '&:hover': {
//                         bgcolor: mobileOpen ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.6)',
//                     },
//                 }}
//             >
//                 {mobileOpen ? <CloseIcon /> : <MenuIcon />}

//             </IconButton>

//             <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
//                 <Drawer
//                     variant="temporary"
//                     open={mobileOpen}
//                     onClose={handleDrawerToggle}
//                     ModalProps={{ keepMounted: true }}
//                     sx={{
//                         display: { xs: 'block', sm: 'none' },
//                         '& .MuiDrawer-paper': {
//                             boxSizing: 'border-box',
//                             width: drawerWidth,
//                             backgroundImage: 'none',
//                         },
//                     }}
//                 >
//                     {drawerContent}
//                 </Drawer>

//                 <Drawer
//                     variant="permanent"
//                     sx={{
//                         display: { xs: 'none', sm: 'block' },
//                         '& .MuiDrawer-paper': {
//                             boxSizing: 'border-box',
//                             width: drawerWidth,
//                             borderRight: 'none',
//                             boxShadow: '8px 0 24px rgba(0,0,0,0.08)',
//                             backgroundImage: 'none',
//                         },
//                     }}
//                     open
//                 >
//                     {drawerContent}
//                 </Drawer>
//             </Box>
//         </>
//     );
// };

// export default Sidebar;