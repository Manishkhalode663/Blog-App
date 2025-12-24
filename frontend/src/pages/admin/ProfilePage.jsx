import React, { useState, useEffect, useMemo } from 'react';
import {
  Container, Paper, Box, Typography, Avatar, Button, Grid,
  Divider, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Stack, Alert, Chip, Skeleton, 
  useTheme, alpha, Tooltip, Card, CardContent
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ArticleIcon from '@mui/icons-material/Article';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EmailIcon from '@mui/icons-material/Email';
import VerifiedIcon from '@mui/icons-material/Verified';
import LinkIcon from '@mui/icons-material/Link';

import { useAuth } from '../../context/AuthContext';
import { blogsApi } from '../../api/blogApi'; // To fetch stats
import { authApi } from '../../api/authApi'; 

// --- Sub-Component: Stat Box ---
const StatBox = ({ label, value, icon, color }) => (
    <Box 
      sx={{ 
        p: 2, 
        border: '1px solid', 
        borderColor: 'divider', 
        borderRadius: 2, 
        textAlign: 'center',
        flex: 1,
        bgcolor: (theme) => alpha(theme.palette[color].main, 0.04)
      }}
    >
        <Box sx={{ color: `${color}.main`, mb: 1, display: 'flex', justifyContent: 'center' }}>
            {icon}
        </Box>
        <Typography variant="h5" fontWeight="800" color="text.primary">
            {value}
        </Typography>
        <Typography variant="caption" color="text.secondary" fontWeight="600" textTransform="uppercase">
            {label}
        </Typography>
    </Box>
);

const ProfilePage = () => {
  const { user } = useAuth();
  const theme = useTheme();

  // --- State ---
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Real stats data
  const [stats, setStats] = useState({ posts: 0, views: 0, likes: 0 });

  // Form State
  const [editData, setEditData] = useState({
    username: '',
    email: '',
    bio: '',
    website: '', // Added website field
    location: '' // Added location field
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState('');

  // --- Effects ---

  // 1. Initialize User Data
  useEffect(() => {
    if (user) {
      setEditData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        website: user.website || '',
        location: user.location || ''
      });
      setPreview(user.avatar);
    }
  }, [user]);

  // 2. Fetch User Stats (Real Data)
  useEffect(() => {
    const fetchStats = async () => {
        if(!user?.username) return;
        setStatsLoading(true);
        try {
            const posts = await blogsApi.getByAuthor(user.username);
            const totalPosts = posts.length;
            const totalViews = posts.reduce((acc, curr) => acc + (curr.views || 0), 0);
            const totalLikes = posts.reduce((acc, curr) => acc + (curr.likes?.length || 0), 0);
            
            setStats({ posts: totalPosts, views: totalViews, likes: totalLikes });
        } catch (err) {
            console.error("Error fetching stats", err);
        } finally {
            setStatsLoading(false);
        }
    };
    fetchStats();
  }, [user]);

  // --- Handlers ---

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError('');
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('username', editData.username);
      formData.append('bio', editData.bio); 
      formData.append('website', editData.website);
      formData.append('location', editData.location);

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      await authApi.updateProfile(formData);
      window.location.reload(); 
      handleClose();
    } catch (err) {
      setError('Failed to update profile. ' + (err.response?.data?.message || ''));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Box p={4}><Skeleton variant="rectangular" height={300} /></Box>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      
      {/* --- 1. HEADER CARD --- */}
      <Paper 
        elevation={0} 
        sx={{ 
            borderRadius: 3, 
            overflow: 'hidden', 
            border: '1px solid', 
            borderColor: 'divider',
            mb: 4 
        }}
      >
        {/* Banner / Cover Image */}
        <Box 
            sx={{ 
                height: 200, 
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                position: 'relative'
            }}
        />

        <Box sx={{ px: 4, pb: 4 }}>
          <Grid container spacing={2} alignItems="flex-end" sx={{ mt: -8 }}>
            
            {/* Avatar */}
            <Grid item xs={12} sm="auto">
              <Box sx={{ position: 'relative', display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                <Avatar 
                  src={user.avatar} 
                  alt={user.username}
                  sx={{ 
                    width: 140, 
                    height: 140, 
                    border: '5px solid white', 
                    boxShadow: theme.shadows[3],
                    bgcolor: 'background.paper'
                  }} 
                />
              </Box>
            </Grid>

            {/* User Details */}
            <Grid item xs={12} sm>
               <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, mb: 1, mt: { xs: 2, sm: 0 } }}>
                 <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'center', sm: 'flex-end' }}>
                    <Typography variant="h4" fontWeight="800">
                        {user.username}
                    </Typography>
                    {user.emailVerified && (
                         <Tooltip title="Verified Author">
                            <VerifiedIcon color="primary" sx={{ mb: 0.5 }} />
                         </Tooltip>
                    )}
                    <Chip 
                        label={user.role || "Author"} 
                        size="small" 
                        color="secondary" 
                        sx={{ fontWeight: 700, borderRadius: 1, mb: 0.5 }} 
                    />
                 </Stack>
                 <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                    {user.bio ? user.bio.substring(0, 100) + (user.bio.length > 100 ? '...' : '') : "Digital creator & blog enthusiast."}
                 </Typography>
                 
                 {/* Meta Data Row */}
                 <Stack 
                    direction="row" 
                    spacing={3} 
                    justifyContent={{ xs: 'center', sm: 'flex-start' }}
                    sx={{ mt: 2, color: 'text.secondary', typography: 'body2' }}
                >
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <CalendarTodayIcon fontSize="small" /> Joined {new Date(user.createdAt).toLocaleDateString()}
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <EmailIcon fontSize="small" /> {user.email}
                    </Box>
                 </Stack>
               </Box>
            </Grid>

            {/* Edit Button */}
            <Grid item xs={12} sm="auto">
                <Box display="flex" justifyContent={{ xs: 'center', sm: 'flex-end' }}>
                    <Button 
                        variant="outlined" 
                        startIcon={<EditIcon />} 
                        onClick={handleOpen}
                        sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none' }}
                    >
                        Edit Profile
                    </Button>
                </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* --- 2. MAIN CONTENT GRID --- */}
      <Grid container spacing={4}>
          
          {/* Left Column: Stats & Links */}
          <Grid item xs={12} md={4}>
             <Stack spacing={3}>
                
                {/* Stats Card */}
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight="700" mb={2}>Impact</Typography>
                        {statsLoading ? (
                            <Stack spacing={2}><Skeleton height={40}/><Skeleton height={40}/></Stack>
                        ) : (
                            <Stack spacing={2}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box display="flex" alignItems="center" gap={1} color="text.secondary">
                                        <ArticleIcon fontSize="small" /> <Typography variant="body2">Articles</Typography>
                                    </Box>
                                    <Typography variant="subtitle1" fontWeight="700">{stats.posts}</Typography>
                                </Box>
                                <Divider />
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box display="flex" alignItems="center" gap={1} color="text.secondary">
                                        <VisibilityIcon fontSize="small" /> <Typography variant="body2">Total Views</Typography>
                                    </Box>
                                    <Typography variant="subtitle1" fontWeight="700">{stats.views.toLocaleString()}</Typography>
                                </Box>
                                <Divider />
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box display="flex" alignItems="center" gap={1} color="text.secondary">
                                        <FavoriteIcon fontSize="small" /> <Typography variant="body2">Appreciations</Typography>
                                    </Box>
                                    <Typography variant="subtitle1" fontWeight="700">{stats.likes}</Typography>
                                </Box>
                            </Stack>
                        )}
                    </CardContent>
                </Card>

                {/* About Card */}
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight="700" mb={2}>About Me</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            {user.bio || "No bio added yet. Click 'Edit Profile' to tell the world about yourself!"}
                        </Typography>
                        {user.website && (
                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LinkIcon color="primary" fontSize="small" />
                                <Typography variant="body2" component="a" href={user.website} target="_blank" color="primary" sx={{ textDecoration: 'none', fontWeight: 600 }}>
                                    {user.website.replace(/^https?:\/\//, '')}
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>

             </Stack>
          </Grid>

          {/* Right Column: Highlighted Stats / Activity */}
          <Grid item xs={12} md={8}>
                <Box mb={3}>
                    <Typography variant="h6" fontWeight="700" mb={2}>Performance Overview</Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                         <StatBox 
                            label="Total Articles" 
                            value={stats.posts} 
                            icon={<ArticleIcon />} 
                            color="primary" 
                         />
                         <StatBox 
                            label="Total Reads" 
                            value={stats.views >= 1000 ? (stats.views/1000).toFixed(1) + 'k' : stats.views} 
                            icon={<VisibilityIcon />} 
                            color="success" 
                         />
                         <StatBox 
                            label="Engagement" 
                            value={stats.likes} 
                            icon={<FavoriteIcon />} 
                            color="warning" 
                         />
                    </Stack>
                </Box>

                <Divider sx={{ my: 4 }} />
                
                {/* Empty State for recent activity (Mock) */}
                <Box textAlign="center" py={4} bgcolor={alpha(theme.palette.primary.main, 0.03)} borderRadius={3} border="1px dashed" borderColor="divider">
                    <Typography variant="h6" color="text.secondary" fontWeight="600">No Recent Activity</Typography>
                    <Typography variant="body2" color="text.secondary">You haven't performed any public actions recently.</Typography>
                </Box>
          </Grid>

      </Grid>


      {/* --- EDIT PROFILE DIALOG --- */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Edit Profile</DialogTitle>
        <Divider />
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            
            {/* Avatar Upload */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Box position="relative">
                    <Avatar 
                        src={preview} 
                        sx={{ width: 100, height: 100, border: '1px solid #ddd' }} 
                    />
                    <IconButton 
                        component="label"
                        sx={{ 
                            position: 'absolute', bottom: -5, right: -5, 
                            bgcolor: 'primary.main', color: 'white',
                            '&:hover': { bgcolor: 'primary.dark' }
                        }}
                    >
                         <PhotoCamera fontSize="small" />
                         <input hidden accept="image/*" type="file" onChange={handleFileChange} />
                    </IconButton>
                </Box>
                <Typography variant="caption" color="text.secondary" mt={1}>Allowed *.jpeg, *.jpg, *.png, *.max 5MB</Typography>
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Username"
                        name="username"
                        fullWidth
                        value={editData.username}
                        onChange={handleChange}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Email Address"
                        name="email"
                        fullWidth
                        disabled
                        value={editData.email}
                        helperText="Email cannot be changed."
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Website / Portfolio"
                        name="website"
                        fullWidth
                        placeholder="https://yourwebsite.com"
                        value={editData.website}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: <LinkIcon color="disabled" sx={{ mr: 1 }} />
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Bio"
                        name="bio"
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Tell us a little about yourself..."
                        value={editData.bio}
                        onChange={handleChange}
                    />
                </Grid>
            </Grid>

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleClose} sx={{ fontWeight: 600 }}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={loading}
            sx={{ px: 4, fontWeight: 700, borderRadius: 2 }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default ProfilePage;
// import React, { useState, useEffect } from 'react';
// import {
//   Container,
//   Paper,
//   Box,
//   Typography,
//   Avatar,
//   Button,
//   Grid,
//   Divider,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   IconButton,
//   Stack,
//   Alert
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import PhotoCamera from '@mui/icons-material/PhotoCamera';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { authApi } from '../../api/authApi'; // Import the API helper

// const ProfilePage = () => {
//   const { user } = useAuth(); // We might need a 'setUser' or re-fetch logic here
//   const navigate = useNavigate();

//   // Modal State
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Form State
//   const [editData, setEditData] = useState({
//     username: '',
//     email: '',
//     bio: '', // Assuming you might add a bio field later
//   });
//   const [avatarFile, setAvatarFile] = useState(null);
//   const [preview, setPreview] = useState('');

//   // Initialize form when user data loads
//   useEffect(() => {
//     if (user) {
//       setEditData({
//         username: user.username || '',
//         email: user.email || '',
//         bio: user.bio || '',
//       });
//       setPreview(user.avatar);
//     }
//   }, [user]);

//   // Handle Edit Click
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => {
//     setOpen(false);
//     setError('');
//   };

//   // Handle Input Change
//   const handleChange = (e) => {
//     setEditData({ ...editData, [e.target.name]: e.target.value });
//   };

//   // Handle File Change (Avatar)
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setAvatarFile(file);
//       setPreview(URL.createObjectURL(file)); // Show preview instantly
//     }
//   };

//   // Submit Profile Updates
//   const handleSubmit = async () => {
//     setLoading(true);
//     setError('');
    
//     try {
//       // Create FormData to send text + file
//       const formData = new FormData();
//       formData.append('username', editData.username);
//       // formData.append('bio', editData.bio); 
//       if (avatarFile) {
//         formData.append('avatar', avatarFile);
//       }

//       // Call API
//       await authApi.updateProfile(formData);
      
//       // Update Context (You might need to expose setUser in AuthContext or just reload)
//       window.location.reload(); // Simple way to refresh data for now
      
//       handleClose();
//     } catch (err) {
//       setError('Failed to update profile.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!user) return <Typography>Loading Profile...</Typography>;

//   return (
//     <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
//       <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        
//         {/* Header Background (Optional) */}
//         <Box sx={{ height: 140, bgcolor: '#1976d2' }} />

//         <Box sx={{ px: 4, pb: 4 }}>
//           <Grid container spacing={2} alignItems="flex-end" sx={{ mt: -6 }}>
            
//             {/* Avatar Section */}
//             <Grid size={{ xs: 12, sm: 'auto' }}>
//               <Box sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
//                 <Avatar 
//                   src={user.avatar} 
//                   alt={user.username}
//                   sx={{ 
//                     width: 120, 
//                     height: 120, 
//                     border: '4px solid white', 
//                     boxShadow: 2 
//                   }} 
//                 />
//               </Box>
//             </Grid>

//             {/* User Info Section */}
//             <Grid size={{ xs: 12, sm: true }}>
//                <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, mb: 1 }}>
//                  <Typography variant="h4" fontWeight="bold">
//                     {user.username}
//                  </Typography>
//                  <Typography variant="body1" color="text.secondary">
//                     {user.email}
//                  </Typography>
//                </Box>
//             </Grid>

//             {/* Action Buttons */}
//             <Grid size={{ xs: 12, sm: 'auto' }}>
//               <Stack direction="row" spacing={2} justifyContent={{ xs: 'center', sm: 'flex-end' }}>
//                 <Button 
//                   variant="outlined" 
//                   startIcon={<EditIcon />} 
//                   onClick={handleOpen}
//                 >
//                   Edit Profile
//                 </Button>
//                 <Button 
//                   variant="contained" 
//                   startIcon={<AddCircleOutlineIcon />}
//                   onClick={() => navigate('/create')}
//                 >
//                   Write Blog
//                 </Button>
//               </Stack>
//             </Grid>
//           </Grid>

//           <Divider sx={{ my: 4 }} />

//           {/* Additional Info / Stats Section */}
//           <Box>
//             <Typography variant="h6" gutterBottom>
//               About
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               {user.bio || "This user hasn't written a bio yet."}
//             </Typography>
            
//             <Box sx={{ mt: 3, bgcolor: '#f5f5f5', p: 2, borderRadius: 2 }}>
//                 <Typography variant="subtitle2" fontWeight="bold">
//                     Member Since:
//                 </Typography>
//                 <Typography variant="body2">
//                     {new Date(user.createdAt).toLocaleDateString()}
//                 </Typography>
//             </Box>
//           </Box>
//         </Box>
//       </Paper>

//       {/* --- Edit Profile Dialog (Modal) --- */}
//       <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
//         <DialogTitle>Edit Profile</DialogTitle>
//         <DialogContent>
//           <Box component="form" sx={{ mt: 1 }}>
            
//             {/* Avatar Upload Area */}
//             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
//                 <Avatar 
//                     src={preview} 
//                     sx={{ width: 80, height: 80, mb: 1 }} 
//                 />
//                 <Button variant="text" component="label" startIcon={<PhotoCamera />}>
//                     Change Photo
//                     <input hidden accept="image/*" type="file" onChange={handleFileChange} />
//                 </Button>
//             </Box>

//             <TextField
//               margin="normal"
//               label="Username"
//               name="username"
//               fullWidth
//               value={editData.username}
//               onChange={handleChange}
//             />
            
//             <TextField
//               margin="normal"
//               label="Email"
//               name="email"
//               fullWidth
//               disabled // Usually we don't let users change email easily
//               value={editData.email}
//             />
            
//             <TextField
//               margin="normal"
//               label="Bio"
//               name="bio"
//               fullWidth
//               multiline
//               rows={3}
//               placeholder="Tell us about yourself..."
//               value={editData.bio}
//               onChange={handleChange}
//             />

//             {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

//           </Box>
//         </DialogContent>
//         <DialogActions sx={{ p: 3 }}>
//           <Button onClick={handleClose}>Cancel</Button>
//           <Button onClick={handleSubmit} variant="contained" disabled={loading}>
//             {loading ? 'Saving...' : 'Save Changes'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//     </Container>
//   );
// };

// export default ProfilePage;
