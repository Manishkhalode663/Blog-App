import * as React from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Menu, 
  Container, 
  Avatar, 
  Button, 
  Tooltip, 
  MenuItem 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';

// 1. Import useNavigate
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const pages = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Blogs', path: '/blogs' },
];

const settings = [
  { name: 'Profile', path: '/profile' },
  { name: 'Account', path: '/account' },
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Logout', path: '/logout' }
];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [elevated, setElevated] = React.useState(false);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate(); // 2. Initialize Hook

  // --- Scroll Effect ---
  React.useEffect(() => {
    const handleScroll = () => {
      setElevated(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Mobile Menu Handlers ---
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = (path) => {
    setAnchorElNav(null);
    if (path) {
      navigate(path); // Use navigate instead of window.location
    }
  };

  // --- User Menu Handlers ---
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = async (setting) => {
    setAnchorElUser(null);
    
    if (setting?.path === '/logout') {
      await logout();
      navigate('/login'); // Redirect to login after logout
    } else if (setting?.path) {
      navigate(setting.path);
    }
  };

  return (
    <AppBar 
      position="sticky" 
      color="inherit" 
      elevation={elevated ? 4 : 0} 
      sx={{ transition: 'box-shadow 0.3s ease-in-out', bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)' }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          
          {/* --- MOBILE: Menu Icon --- */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="open navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(anchorElNav)}
              onClose={() => handleCloseNavMenu(null)}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={() => handleCloseNavMenu(page.path)}>
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* --- LOGO --- */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'flex' }, // Show on all screens
              flexGrow: { xs: 1, md: 0 },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            DevBlog
          </Typography>

          {/* --- DESKTOP: Page Links --- */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4, gap: 1 }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => handleCloseNavMenu(page.path)}
                sx={{ 
                  my: 2, 
                  color: 'text.primary', 
                  display: 'block',
                  fontWeight: 500,
                  '&:hover': { color: 'primary.main', bgcolor: 'rgba(25, 118, 210, 0.08)' }
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* --- RIGHT SIDE: Search & User/Auth --- */}
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
            
            <IconButton color="inherit" sx={{ mr: 1 }}>
              <SearchIcon />
            </IconButton>

            {user ? (
              // --- LOGGED IN STATE ---
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar 
                      alt={user.username} 
                      src={user.avatar || "/static/images/avatar/2.jpg"} 
                      sx={{ width: 35, height: 35, border: '2px solid #e0e0e0' }}
                    />
                  </IconButton>
                </Tooltip>
                
                <Menu
                  sx={{ mt: '45px', minWidth: 720 }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  keepMounted
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={Boolean(anchorElUser)}
                  onClose={() => handleCloseUserMenu(null)}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" noWrap>
                      {user.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {user.email}
                    </Typography>
                  </Box>
                  <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '4px 0' }} />
                  
                  {settings.map((setting) => (
                    <MenuItem key={setting.name} onClick={() => handleCloseUserMenu(setting)}>
                      <Typography textAlign="center">{setting.name}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              // --- GUEST STATE ---
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                    variant="text" 
                    component={Link} 
                    to="/login"
                    sx={{ color: 'text.primary' }}
                >
                    Login
                </Button>
                <Button 
                    variant="contained" 
                    component={Link} 
                    to="/signup"
                    sx={{ 
                        boxShadow: 'none',
                        '&:hover': { boxShadow: '0 2px 4px rgba(0,0,0,0.2)' } 
                    }}
                >
                    Sign Up
                </Button>
              </Box>
            )}

          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;