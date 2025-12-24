import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Box, Typography, Avatar, Button, Grid,
  Divider, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Stack, Alert, Chip, Skeleton, 
  useTheme, alpha, Card, CardContent, InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ArticleIcon from '@mui/icons-material/Article';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import CakeIcon from '@mui/icons-material/Cake';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedIcon from '@mui/icons-material/Verified';

import { useAuth } from '../../context/AuthContext';
import { blogsApi } from '../../api/blogApi';
import { authApi } from '../../api/authApi'; 

// --- Helper: Format Date for Input (YYYY-MM-DD) ---
const formatDateForInput = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toISOString().split('T')[0];
};

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
        bgcolor: (theme) => alpha(theme.palette[color].main, 0.04),
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-2px)' }
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
  const [stats, setStats] = useState({ posts: 0, views: 0, likes: 0 });

  // Form State
  const [editData, setEditData] = useState({
    username: '',
    email: '',
    bio: '',       // Short Headline
    about: '',     // Long Description
    location: '',
    website: '',
    experience: '',
    dob: ''
  });
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState('');

  // --- Effects ---
  useEffect(() => {
    if (user) {
      console.log(user);
      setEditData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        about: user.about || '',
        location: user.location || '',
        website: user.website || '',
        experience: user.experience || '',
        dob: user.dob ? formatDateForInput(user.dob) : ''
      });
      setPreview(user.avatar);

      
      // Fetch Stats
      blogsApi.getByAuthor(user.username)
        .then(posts => {
            const safePosts = posts || [];
            setStats({
                posts: safePosts.length,
                views: safePosts.reduce((acc, curr) => acc + (curr.views || 0), 0),
                likes: safePosts.reduce((acc, curr) => acc + (curr.likes?.length || 0), 0)
            });
            
        })
        .catch(console.error);
    }
  }, [user]);

  // --- Handlers ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      // Append all fields
      Object.keys(editData).forEach(key => {
        // Don't append email (read-only)
        if (key !== 'email') {
            formData.append(key, editData[key]);
        }
      });
      
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      await authApi.updateProfile(formData);
      window.location.reload(); 
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  if (!user) return <Box p={4}><Skeleton variant="rectangular" height={400} /></Box>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      
      {/* --- 1. HEADER SECTION --- */}
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
        {/* Cover Image */}
        <Box 
            sx={{ 
                height: 200, 
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                position: 'relative'
            }}
        />

        <Box sx={{ px: { xs: 2, md: 4 }, pb: 4 }}>
          <Grid container spacing={2} alignItems="flex-end" sx={{ mt: -8 }}>
            
            {/* Avatar */}
            <Grid size={{ xs: 12 }}   sm="auto">
              <Box sx={{ position: 'relative', display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                <Avatar 
                  src={user.avatar} 
                  alt={user.username}
                  sx={{ 
                    width: 140, 
                    height: 140, 
                    border: `5px solid ${theme.palette.background.paper}`, 
                    boxShadow: theme.shadows[3],
                    bgcolor: 'background.paper'
                  }} 
                />
              </Box>
            </Grid>

            {/* Basic Details */}
            <Grid size={{ xs: 12 }} >
               <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, mt: { xs: 1, sm: 0 } }}>
                 <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'center', sm: 'flex-end' }}>
                    <Typography variant="h4" fontWeight="800">
                        {user.username}
                    </Typography>
                    {/* Role Chip */}
                    <Chip 
                        label={user.role || "Author"} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{ fontWeight: 700, borderRadius: 1, mb: 0.5, border: '1px solid' }} 
                    />
                 </Stack>
                 
                 {/* Short Headline (Bio) */}
                 <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                    {user.bio || "No headline added yet."}
                 </Typography>

                 {/* Quick Links */}
                 <Stack 
                    direction="row" 
                    spacing={2} 
                    justifyContent={{ xs: 'center', sm: 'flex-start' }}
                    sx={{ mt: 2, color: 'text.secondary', typography: 'body2', flexWrap: 'wrap', gap: 1 }}
                >
                    {user.location && (
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <LocationOnIcon fontSize="small" color="action" /> {user.location}
                        </Box>
                    )}
                    {user.website && (
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <LanguageIcon fontSize="small" color="action" /> 
                            <a href={user.website} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                                Website
                            </a>
                        </Box>
                    )}
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <CalendarTodayIcon fontSize="small" color="action" /> Joined {new Date(user.createdAt).toLocaleDateString()}
                    </Box>
                 </Stack>
               </Box>
            </Grid>

            {/* Edit Button */}
            <Grid size={{ xs: 12 }} sm="auto">
                <Box display="flex" justifyContent={{ xs: 'center', sm: 'flex-end' }}>
                    <Button 
                        variant="contained" 
                        startIcon={<EditIcon />} 
                        onClick={() => setOpen(true)}
                        sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none', px: 3 }}
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
          
          {/* LEFT COLUMN: Personal Details & Stats */}
          <Grid size={{ xs: 12 ,md:4}} >
             <Stack spacing={3}>
                
                {/* Personal Details Card */}
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight="700" mb={2}>Personal Details</Typography>
                        <Stack spacing={2}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <EmailIcon color="action" />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Email</Typography>
                                    <Typography variant="body2" fontWeight={500}>{user.email}</Typography>
                                </Box>
                            </Box>
                            <Divider />
                            <Box display="flex" alignItems="center" gap={2}>
                                <WorkOutlineIcon color="action" />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Experience</Typography>
                                    <Typography variant="body2" fontWeight={500}>{user.experience || "Not Specified"}</Typography>
                                </Box>
                            </Box>
                            <Divider />
                            <Box display="flex" alignItems="center" gap={2}>
                                <CakeIcon color="action" />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Birthday</Typography>
                                    <Typography variant="body2" fontWeight={500}>
                                        {user.dob ? new Date(user.dob).toLocaleDateString() : "Not Specified"}
                                    </Typography>
                                </Box>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>

                {/* Impact Stats */}
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight="700" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <VerifiedIcon color="primary" fontSize="small" /> Impact
                        </Typography>
                        <Stack spacing={2}>
                            <Box display="flex" justifyContent="space-between">
                                <Typography color="text.secondary">Total Articles</Typography>
                                <Typography fontWeight={700}>{stats.posts}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography color="text.secondary">Total Views</Typography>
                                <Typography fontWeight={700}>{stats.views}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography color="text.secondary">Total Likes</Typography>
                                <Typography fontWeight={700}>{stats.likes}</Typography>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>

             </Stack>
          </Grid>

          {/* RIGHT COLUMN: About & Stats Boxes */}
          <Grid size={{ xs: 12,md:8 }} >
                
                {/* Stats Row */}
                <Box mb={4}>
                    <Typography variant="h6" fontWeight="700" mb={2}>Performance Overview</Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                         <StatBox label="Articles" value={stats.posts} icon={<ArticleIcon />} color="primary" />
                         <StatBox label="Views" value={stats.views.toLocaleString()} icon={<VisibilityIcon />} color="success" />
                         <StatBox label="Likes" value={stats.likes} icon={<FavoriteIcon />} color="warning" />
                    </Stack>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* About Me Section */}
                <Box>
                    <Typography variant="h6" fontWeight="700" mb={2}>About Me</Typography>
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 3, 
                            bgcolor: 'background.default', 
                            border: '1px solid', 
                            borderColor: 'divider', 
                            borderRadius: 3,
                            minHeight: 200
                        }}
                    >
                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                            {user.about || "This user hasn't written a bio yet. Click 'Edit Profile' to add your story."}
                        </Typography>
                    </Paper>
                </Box>

          </Grid>

      </Grid>

      {/* --- EDIT PROFILE DIALOG --- */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        fullWidth 
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Edit Public Profile</DialogTitle>
        <Divider />
        <DialogContent>
            
            <Grid container spacing={4} sx={{ mt: 0 }}>
                {/* Left: Avatar & Basic */}
                <Grid size={{ xs: 12 ,md:4}}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Box position="relative">
                            <Avatar 
                                src={preview} 
                                sx={{ width: 120, height: 120, border: '1px solid #ddd', mb: 2 }} 
                            />
                            <IconButton 
                                component="label"
                                sx={{ 
                                    position: 'absolute', bottom: 10, right: 0, 
                                    bgcolor: 'primary.main', color: 'white',
                                    '&:hover': { bgcolor: 'primary.dark' }
                                }}
                            >
                                <PhotoCamera fontSize="small" />
                                <input hidden accept="image/*" type="file" onChange={handleFileChange} />
                            </IconButton>
                        </Box>
                        <Typography variant="caption" color="text.secondary">Allowed *.jpeg, *.jpg, *.png</Typography>
                    </Box>

                    <Stack spacing={2} mt={3}>
                        <TextField
                            label="Username"
                            name="username"
                            fullWidth
                            size="small"
                            value={editData.username}
                            onChange={handleChange}
                            InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon fontSize="small"/></InputAdornment> }}
                        />
                         <TextField
                            label="Email"
                            fullWidth
                            size="small"
                            value={editData.email}
                            disabled
                            InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon fontSize="small"/></InputAdornment> }}
                        />
                         <TextField
                            label="Date of Birth"
                            name="dob"
                            type="date"
                            fullWidth
                            size="small"
                            value={editData.dob}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Stack>
                </Grid>

                {/* Right: Details */}
                <Grid size={{ xs: 12,md:8  }}>
                    <Typography variant="subtitle2" fontWeight={700} color="primary" gutterBottom>Profile Details</Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Headline (Bio)"
                                name="bio"
                                fullWidth
                                placeholder="e.g. Full Stack Developer at Tech Co."
                                value={editData.bio}
                                onChange={handleChange}
                                helperText="A short description that appears below your name"
                            />
                        </Grid>
                        <Grid size={{ xs: 12 ,sm:6}}>
                            <TextField
                                label="Location"
                                name="location"
                                fullWidth
                                placeholder="e.g. New York, USA"
                                value={editData.location}
                                onChange={handleChange}
                                InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnIcon fontSize="small"/></InputAdornment> }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 ,sm:6}}>
                            <TextField
                                label="Website"
                                name="website"
                                fullWidth
                                placeholder="https://..."
                                value={editData.website}
                                onChange={handleChange}
                                InputProps={{ startAdornment: <InputAdornment position="start"><LanguageIcon fontSize="small"/></InputAdornment> }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Experience / Job Title"
                                name="experience"
                                fullWidth
                                placeholder="e.g. Senior Software Engineer (5 Years)"
                                value={editData.experience}
                                onChange={handleChange}
                                InputProps={{ startAdornment: <InputAdornment position="start"><WorkOutlineIcon fontSize="small"/></InputAdornment> }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="About Me"
                                name="about"
                                fullWidth
                                multiline
                                rows={4}
                                placeholder="Tell your story..."
                                value={editData.about}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: 'background.default' }}>
            <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
            <Button 
                onClick={handleSubmit} 
                variant="contained" 
                disabled={loading}
                sx={{ px: 4, borderRadius: 2 }}
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
//   Container, Paper, Box, Typography, Avatar, Button, Grid,
//   Divider, Dialog, DialogTitle, DialogContent, DialogActions,
//   TextField, IconButton, Stack, Alert, Chip, Skeleton, 
//   useTheme, alpha, Card, CardContent
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import PhotoCamera from '@mui/icons-material/PhotoCamera';
// import ArticleIcon from '@mui/icons-material/Article';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import EmailIcon from '@mui/icons-material/Email';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// import { useAuth } from '../../context/AuthContext';
// import { blogsApi } from '../../api/blogApi';
// import { authApi } from '../../api/authApi'; 

// const StatBox = ({ label, value, icon, color }) => (
//     <Box 
//       sx={{ 
//         p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, 
//         textAlign: 'center', flex: 1,
//         bgcolor: (theme) => alpha(theme.palette[color].main, 0.05)
//       }}
//     >
//         <Box sx={{ color: `${color}.main`, mb: 1, display: 'flex', justifyContent: 'center' }}>{icon}</Box>
//         <Typography variant="h5" fontWeight="800">{value}</Typography>
//         <Typography variant="caption" textTransform="uppercase" fontWeight={600} color="text.secondary">{label}</Typography>
//     </Box>
// );

// const ProfilePage = () => {
//   const { user } = useAuth();
//   const theme = useTheme();
  
//   const [open, setOpen] = useState(false);
//   const [stats, setStats] = useState({ posts: 0, views: 0, likes: 0 });
//   const [editData, setEditData] = useState({ username: '', bio: '' });
//   const [avatarFile, setAvatarFile] = useState(null);
//   const [preview, setPreview] = useState('');

//   useEffect(() => {
//     if (user) {
//         setEditData({ username: user.username, bio: user.bio || '' });
//         setPreview(user.avatar);
//         // Fetch stats
//         blogsApi.getByAuthor(user.username).then(posts => {
//             setStats({
//                 posts: posts.length,
//                 views: posts.reduce((a, b) => a + (b.views || 0), 0),
//                 likes: posts.reduce((a, b) => a + (b.likes?.length || 0), 0)
//             });
//         }).catch(console.error);
//     }
//   }, [user]);

//   const handleSubmit = async () => {
//     const formData = new FormData();
//     formData.append('username', editData.username);
//     formData.append('bio', editData.bio);
//     if(avatarFile) formData.append('avatar', avatarFile);
//     await authApi.updateProfile(formData);
//     window.location.reload();
//   };

//   if (!user) return <Skeleton height={400} />;

//   return (
//     <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
//       <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', border: 1, borderColor: 'divider', mb: 4 }}>
//         <Box sx={{ height: 180, background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)` }} />
//         <Box sx={{ px: 4, pb: 4 }}>
//           <Grid container spacing={2} alignItems="flex-end" sx={{ mt: -8 }}>
//             <Grid size={{ xs: 12, sm: 'auto' }}>
//               <Avatar src={user.avatar} sx={{ width: 140, height: 140, border: `5px solid ${theme.palette.background.paper}` }} />
//             </Grid>
//             <Grid size={{ xs: 12, sm: true }}>
//                <Box sx={{ mt: 1 }}>
//                  <Typography variant="h4" fontWeight="800">{user.username}</Typography>
//                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>{user.bio || "No bio yet."}</Typography>
//                  <Stack direction="row" spacing={3} mt={2} color="text.secondary">
//                     <Box display="flex" gap={1} alignItems="center"><EmailIcon fontSize="small"/> {user.email}</Box>
//                     <Box display="flex" gap={1} alignItems="center"><CalendarTodayIcon fontSize="small"/> Joined {new Date(user.createdAt).toLocaleDateString()}</Box>
//                  </Stack>
//                </Box>
//             </Grid>
//             <Grid size={{ xs: 12, sm: 'auto' }}>
//                 <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setOpen(true)}>Edit Profile</Button>
//             </Grid>
//           </Grid>
//         </Box>
//       </Paper>

//       <Grid container spacing={4}>
//           <Grid size={{ xs: 12, md: 8 }}>
//                 <Typography variant="h6" fontWeight="700" mb={2}>Overview</Typography>
//                 <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
//                     <StatBox label="Articles" value={stats.posts} icon={<ArticleIcon />} color="primary" />
//                     <StatBox label="Views" value={stats.views} icon={<VisibilityIcon />} color="success" />
//                     <StatBox label="Likes" value={stats.likes} icon={<FavoriteIcon />} color="warning" />
//                 </Stack>
//           </Grid>
//           <Grid size={{ xs: 12, md: 4 }}>
//               <Card variant="outlined" sx={{ borderRadius: 3 }}>
//                   <CardContent>
//                       <Typography variant="h6" fontWeight="700" mb={2}>About</Typography>
//                       <Typography variant="body2" color="text.secondary">{user.bio || "Write something about yourself..."}</Typography>
//                   </CardContent>
//               </Card>
//           </Grid>
//       </Grid>

//       <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
//         <DialogTitle>Edit Profile</DialogTitle>
//         <DialogContent>
//             <Box display="flex" flexDirection="column" alignItems="center" my={2}>
//                 <Avatar src={preview} sx={{ width: 100, height: 100, mb: 2 }} />
//                 <Button component="label" startIcon={<PhotoCamera />}>
//                     Change Photo <input hidden accept="image/*" type="file" onChange={(e) => {
//                         const file = e.target.files[0];
//                         if(file) { setAvatarFile(file); setPreview(URL.createObjectURL(file)); }
//                     }} />
//                 </Button>
//             </Box>
//             <TextField fullWidth margin="normal" label="Username" value={editData.username} onChange={(e) => setEditData({...editData, username: e.target.value})} />
//             <TextField fullWidth margin="normal" label="Bio" multiline rows={3} value={editData.bio} onChange={(e) => setEditData({...editData, bio: e.target.value})} />
//         </DialogContent>
//         <DialogActions sx={{ p: 2 }}>
//             <Button onClick={() => setOpen(false)}>Cancel</Button>
//             <Button variant="contained" onClick={handleSubmit}>Save Changes</Button>
//         </DialogActions>
//       </Dialog>

//     </Container>
//   );
// };

// export default ProfilePage;