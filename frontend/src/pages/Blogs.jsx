import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Chip, 
  Avatar, 
  Stack, 
  Button, 
  Skeleton,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  useTheme
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { blogsApi } from '../api/blogApi';
import { useNavigate } from 'react-router-dom';

const BlogSkeleton = () => (
  <Grid size={{xs:12, md:6, lg:4}}>
    <Card sx={{ height: '100%', borderRadius: 3 }}>
      <Skeleton variant="rectangular" height={200} />
      <CardContent sx={{ p: 3 }}>
        <Skeleton variant="text" width="80%" height={30} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="90%" sx={{ mb: 2 }} />
      </CardContent>
    </Card>
  </Grid>
);

const CATEGORIES = ['Technology', 'Design', 'Lifestyle', 'Coding', 'Business', 'Travel'];

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  
  const navigate = useNavigate();
  const theme = useTheme();

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await blogsApi.getAll({ search, category, limit: 100 });
      const results = data.results || data.data || [];
      setBlogs(results);
    } catch (error) {
      console.error("Failed to load blogs:", error);
    } finally {
      setInitialLoading(false);
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    const timer = setTimeout(() => fetchBlogs(), 500);
    return () => clearTimeout(timer);
  }, [fetchBlogs]);

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="lg">
        
        {/* HEADER */}
        <Box mb={6} textAlign="center">
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom sx={{ color: 'text.primary' }}>
            Latest Insights
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
            Search, filter, and find exactly what you're looking for.
          </Typography>
        </Box>

        {/* FILTERS CARD */}
        <Card sx={{ p: 3, mb: 6, borderRadius: 3, bgcolor: 'background.paper', boxShadow: theme.shadows[2] }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            
            <TextField
              fullWidth
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
              }}
              sx={{ bgcolor: 'background.default', borderRadius: 1 }}
            />

            <FormControl sx={{ minWidth: 200, bgcolor: 'background.default', borderRadius: 1 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value=""><em>All</em></MenuItem>
                {CATEGORIES.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
              </Select>
            </FormControl>

            {(search || category) && (
              <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleClearFilters}>
                Reset
              </Button>
            )}
          </Stack>
        </Card>

        {/* GRID */}
        <Grid container spacing={4}>
          {initialLoading ? (
            Array.from(new Array(6)).map((_, i) => <BlogSkeleton key={i} />)
          ) : blogs.length > 0 ? (
            blogs.map((post) => (
              <Grid size={{xs:12, md:6, lg:4}}  key={post._id || post.id}>
                <Card sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    bgcolor: 'background.paper',
                    borderRadius: 3,
                    transition: '0.3s',
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: theme.shadows[6] }
                  }}
                >
                  <CardMedia component="img" height="200" image={post.image || 'https://picsum.photos/800/600'} />
                  
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Chip label={post.category || 'General'} size="small" color="primary" sx={{ mb: 2 }} />
                    <Typography gutterBottom variant="h5" fontWeight="bold" color="text.primary">
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ 
                       display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                    }}>
                      {post.excerpt}
                    </Typography>
                    
                    <Stack direction="row" alignItems="center" spacing={1} mt={3}>
                      <Avatar src={post.authorAvatar} sx={{ width: 32, height: 32 }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.primary">{post.author}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown Date'}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>

                  <Box sx={{ p: 3, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
                      <AccessTimeIcon fontSize="small" />
                      <Typography variant="caption">{post.readTime || '5 min'}</Typography>
                    </Stack>
                    <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate(`/blogs/${post._id}`)}>
                      Read More
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))
          ) : (
             <Grid size={{xs:12}}>
              <Typography variant="h6" textAlign="center" color="text.secondary">
                No blogs found. Try clearing filters.
              </Typography>
            </Grid>
          )}
        </Grid>

      </Container>
    </Box>
  );
}

export default Blogs;

// import React, { useState, useEffect, useCallback } from 'react';
// import { 
//   Box, 
//   Container, 
//   Typography, 
//   Grid, 
//   Card, 
//   CardContent, 
//   CardMedia, 
//   Chip, 
//   Avatar, 
//   Stack, 
//   Button, 
//   Skeleton,
//   TextField,
//   InputAdornment,
//   MenuItem,
//   FormControl,
//   Select,
//   InputLabel
// } from '@mui/material';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// import SearchIcon from '@mui/icons-material/Search';
// import RefreshIcon from '@mui/icons-material/Refresh';
// import { blogsApi } from '../api/blogApi';
// import { useNavigate } from 'react-router-dom';

// // --- Skeleton Component (Same as before) ---
// const BlogSkeleton = () => (
//   <Grid size={{xs:12, md:6, lg:4}}>
//     <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
//       <Skeleton variant="rectangular" height={200} />
//       <CardContent sx={{ p: 3 }}>
//         <Skeleton variant="text" width="30%" height={24} sx={{ mb: 2 }} />
//         <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
//         <Skeleton variant="text" width="90%" />
//         <Stack direction="row" alignItems="center" spacing={1} mt={2}>
//           <Skeleton variant="circular" width={32} height={32} />
//           <Box sx={{ flexGrow: 1 }}>
//             <Skeleton variant="text" width="40%" height={20} />
//           </Box>
//         </Stack>
//       </CardContent>
//     </Card>
//   </Grid>
// );

// // --- Categories List (आप इसे Backend से भी फेच कर सकते हैं) ---
// const CATEGORIES = ['Technology', 'Design', 'Lifestyle', 'Coding', 'Business', 'Travel'];

// const Blogs = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(true);
  
//   // --- New Filters State ---
//   const [search, setSearch] = useState('');
//   const [category, setCategory] = useState('');
  
//   const navigate = useNavigate();

//   // Function to fetch data with Filters
//   const fetchBlogs = useCallback(async () => {
//     setLoading(true);
//     try {
//       const params = {
//         limit: 100, // अभी के लिए ज्यादा लोड कर रहे हैं (Pagination बाद में जोड़ सकते हैं)
//         search: search,   // सर्च टेक्स्ट भेजें
//         category: category // सेलेक्टेड कैटेगरी भेजें
//       };

//       const data = await blogsApi.getAll(params);
      
//       // Data handle structure check
//       const results = data.results || data.data || (Array.isArray(data) ? data : []);
//       setBlogs(results);

//     } catch (error) {
//       console.error("Failed to load blogs:", error);
//     } finally {
//       setInitialLoading(false);
//       setLoading(false);
//     }
//   }, [search, category]); // जब search या category बदले, फंक्शन अपडेट हो

//   // Initial Load & Filter Change
//   useEffect(() => {
//     // Debounce Logic: यूजर के टाइप करने के 500ms बाद ही API कॉल होगी
//     const timer = setTimeout(() => {
//       fetchBlogs();
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [fetchBlogs]);

//   // Handle Clear Filters
//   const handleClearFilters = () => {
//     setSearch('');
//     setCategory('');
//   };

//   return (
//     <Box sx={{ bgcolor: '#f9f9f9', minHeight: '100vh', py: 8 }}>
//       <Container maxWidth="lg">
        
//         {/* Page Header */}
//         <Box mb={6} textAlign="center">
//           <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom sx={{ color: '#2c3e50' }}>
//             Explore Our Blogs
//           </Typography>
//           <Typography variant="h6" color="text.secondary">
//             Search, filter, and find exactly what you're looking for.
//           </Typography>
//         </Box>

//         {/* --- SEARCH & FILTER BAR --- */}
//         <Card sx={{ p: 3, mb: 6, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
//           <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            
//             {/* 1. Search Field */}
//             <TextField
//               fullWidth
//               variant="outlined"
//               placeholder="Search by title, content, or tags..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon color="action" />
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{ bgcolor: 'white' }}
//             />

//             {/* 2. Category Dropdown */}
//             <FormControl sx={{ minWidth: 200, bgcolor: 'white' }} fullWidth={false}>
//               <InputLabel>Category</InputLabel>
//               <Select
//                 value={category}
//                 label="Category"
//                 onChange={(e) => setCategory(e.target.value)}
//               >
//                 <MenuItem value=""><em>All Categories</em></MenuItem>
//                 {CATEGORIES.map((cat) => (
//                   <MenuItem key={cat} value={cat}>{cat}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             {/* 3. Reset Button */}
//             {(search || category) && (
//               <Button 
//                 variant="outlined" 
//                 color="secondary" 
//                 startIcon={<RefreshIcon />}
//                 onClick={handleClearFilters}
//                 sx={{ height: 56, px: 3, minWidth: 120 }}
//               >
//                 Reset
//               </Button>
//             )}
//           </Stack>
//         </Card>

//         {/* --- BLOGS GRID --- */}
//         <Grid container spacing={4}>
//           {initialLoading || loading ? (
//             Array.from(new Array(6)).map((_, index) => <BlogSkeleton key={index} />)
//           ) : blogs.length > 0 ? (
//             blogs.map((post) => (
//               <Grid size={{xs:12, md:6, lg:4}} key={post._id || post.id}>
//                 <Card 
//                   sx={{ 
//                     height: '100%', 
//                     display: 'flex', 
//                     flexDirection: 'column',
//                     borderRadius: 3,
//                     boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
//                     transition: 'transform 0.3s',
//                     '&:hover': { transform: 'translateY(-5px)', boxShadow: 5 }
//                   }}
//                 >
//                   <CardMedia
//                     component="img"
//                     height="200"
//                     image={post.image || 'https://picsum.photos/800/600'}
//                     alt={post.title}
//                   />

//                   <CardContent sx={{ flexGrow: 1, p: 3 }}>
//                     <Chip 
//                       label={post.category || 'General'} 
//                       size="small" 
//                       sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 'bold', mb: 2 }} 
//                     />

//                     <Typography gutterBottom variant="h5" component="h2" fontWeight="bold">
//                       {post.title}
//                     </Typography>

//                     <Typography variant="body2" color="text.secondary" paragraph sx={{ 
//                       display: '-webkit-box',
//                       WebkitLineClamp: 3,
//                       WebkitBoxOrient: 'vertical',
//                       overflow: 'hidden'
//                     }}>
//                       {post.excerpt}
//                     </Typography>

//                     <Stack direction="row" alignItems="center" spacing={1} mt="auto">
//                       <Avatar src={post.authorAvatar} sx={{ width: 32, height: 32 }} />
//                       <Box>
//                         <Typography variant="subtitle2">{post.author || 'Admin'}</Typography>
//                         <Typography variant="caption" color="text.secondary">
//                           {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
//                         </Typography>
//                       </Box>
//                     </Stack>
//                   </CardContent>

//                   <Box sx={{ p: 3, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
//                       <AccessTimeIcon fontSize="small" />
//                       <Typography variant="caption">{post.readTime || '5 min'}</Typography>
//                     </Stack>
//                     <Button 
//                       size="small" 
//                       endIcon={<ArrowForwardIcon />}
//                       onClick={() => navigate(`/blogs/${post._id}`)}
//                       sx={{ fontWeight: 'bold' }}
//                     >
//                       Read More
//                     </Button>
//                   </Box>
//                 </Card>
//               </Grid>
//             ))
//           ) : (
//             // Empty State (जब कोई ब्लॉग न मिले)
//             <Grid size={{xs:12}}>
//               <Box textAlign="center" py={8}>
//                 <Typography variant="h5" color="text.secondary" gutterBottom>
//                   No blogs found matching "{search}" {category && `in ${category}`}
//                 </Typography>
//                 <Button variant="contained" onClick={handleClearFilters} sx={{ mt: 2 }}>
//                   Clear Filters
//                 </Button>
//               </Box>
//             </Grid>
//           )}
//         </Grid>

//       </Container>
//     </Box>
//   );
// }

// export default Blogs;
 