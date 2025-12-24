import React, { useState, useEffect } from 'react';
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
  Skeleton
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { blogsApi } from '../api/blogApi';
import { useNavigate } from 'react-router-dom';
 
// --- Skeleton Component ---
const BlogSkeleton = () => (
  <Grid size={{ xs:12,md:6, xl:4}}>
    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <Skeleton variant="rectangular" height={200} />
      <CardContent sx={{ p: 3 }}>
        <Skeleton variant="text" width="30%" height={24} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="90%" />
        <Skeleton variant="text" width="85%" sx={{ mb: 3 }} />
        <Stack direction="row" alignItems="center" spacing={1}>
          <Skeleton variant="circular" width={32} height={32} />
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton variant="text" width="40%" height={20} />
            <Skeleton variant="text" width="30%" height={16} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  </Grid>
);

// --- Main Blogs Component ---
const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false); // For "Load More" spinner
  const [initialLoading, setInitialLoading] = useState(true); // For initial page load
  const navigate = useNavigate();

  // Configuration: How many items to fetch per click
  const ITEMS_PER_PAGE = 18; 

  // Function to fetch data
  const fetchBlogs = async (pageNumber) => {
    // Only show full loading screen on first load
    if (pageNumber === 1) setInitialLoading(true);
    else setLoading(true);

    try {
      // const data = await blogsApi.getPaginated(pageNumber, ITEMS_PER_PAGE);
      const data = await blogsApi.getAll();
      console.log(data);
      // Handle both backend structures: { results: [...] } or just [...]
      const newBlogs = data.results ? data.results : (Array.isArray(data) ? data : []);

      // If page 1, replace data. If page > 1, append new data to existing list.
      setBlogs(prev => pageNumber === 1 ? newBlogs : [...prev, ...newBlogs]);

    } catch (error) {
      console.error("Failed to load blogs:", error);
    } finally {
      setInitialLoading(false);
      setLoading(false);
    }
  };


  // Initial Load
  useEffect(() => {
    fetchBlogs(1);
  }, []);

  

  return (
    <Box sx={{ bgcolor: '#f9f9f9', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="lg">
        
        {/* Page Header */}
        <Box mb={6} textAlign="center">
          <Typography 
            variant="h3" 
            component="h1" 
            fontWeight="bold" 
            gutterBottom
            sx={{ color: '#2c3e50' }}
          >
            Latest Insights
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Thoughts, tutorials, and trends from our team of experts.
          </Typography>
        </Box>

        {/* Blogs Grid */}
        <Grid container spacing={4}>
          {/* 1. Show Skeletons ONLY on initial load */}
          {initialLoading ? (
            Array.from(new Array(6)).map((_, index) => <BlogSkeleton key={index} />)
          ) : (
            <>
              {/* 2. Show Actual Blogs */}
              {blogs.map((post) => (
                <Grid size={{ sm: 12, md: 6, xl: 4 }} key={post._id || post.id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: 3,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={post.image}
                      alt={post.title}
                    />

                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Chip 
                        label={post.category} 
                        size="small" 
                        sx={{ 
                          bgcolor: '#e3f2fd', 
                          color: '#1565c0', 
                          fontWeight: 'bold', 
                          mb: 2 
                        }} 
                      />

                      <Typography gutterBottom variant="h5" component="h2" fontWeight="bold">
                        {post.title}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 3 }}>
                        {post.excerpt}
                      </Typography>

                      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                        <Avatar src={post.authorAvatar} sx={{ width: 32, height: 32 }} />
                        <Box>
                          <Typography variant="subtitle2" sx={{ lineHeight: 1 }}>
                            {post.author}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {post.date}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>

                    <Box sx={{ p: 3, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'text.secondary' }}>
                        <AccessTimeIcon fontSize="small" />
                        <Typography variant="caption">{post.readTime}</Typography>
                      </Stack>
                      
                      <Button 
                        size="small" 
                        endIcon={<ArrowForwardIcon />}
                        sx={{ textTransform: 'none', fontWeight: 'bold',padding: '10px  16px'}}
                        onClick={()=>{navigate(`/blogs/${post._id || post.id}`)}}
                      >
                        Read More
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}

              {/* 3. Append Skeletons when Loading More */}
              {loading && (
                Array.from(new Array(3)).map((_, index) => <BlogSkeleton key={`loading-${index}`} />)
              )}
            </>
          )}
        </Grid>
        
         

      </Container>
    </Box>
  );
}

export default Blogs;
// import React from 'react';
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
//   Skeleton
// } from '@mui/material';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// import { useState } from 'react';
// import { useEffect } from 'react';
// import { blogsApi } from '../api/blogApi';


// const BlogSkeleton = () => (
//   <Grid size={{ xs: 12, md: 6, lg: 6, xl: 4 }}>
//     <Card
//       sx={{
//         height: '100%',
//         display: 'flex',
//         flexDirection: 'column',
//         borderRadius: 3,
//         boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
//       }}
//     >
//       <Skeleton variant="rectangular" height={200} />
//       <CardContent sx={{ flexGrow: 1, p: 3 }}>
//         <Skeleton variant="text" width="30%" height={24} sx={{ mb: 2 }} />
//         <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
//         <Skeleton variant="text" width="90%" />
//         <Skeleton variant="text" width="85%" sx={{ mb: 3 }} />
//         <Stack direction="row" alignItems="center" spacing={1} mb={2}>
//           <Skeleton variant="circular" width={32} height={32} />
//           <Box sx={{ flexGrow: 1 }}>
//             <Skeleton variant="text" width="40%" height={20} />
//             <Skeleton variant="text" width="30%" height={16} />
//           </Box>
//         </Stack>
//       </CardContent>
//       <Box sx={{ p: 3, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <Skeleton variant="text" width={60} height={20} />
//         <Skeleton variant="text" width={80} height={36} />
//       </Box>
//     </Card>
//   </Grid>
// );

// const Blogs = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page,setPage] = useState(1); 
//   const [hasMore, setHasMore] = useState(true);

//   const handleViewMore = () => {
//     setPage(page + 1);
//   }

//     useEffect(() => {
//       const fetchData = async () => {
//         try {
//           // Call the API function to get paginated blogs
//           const data = await blogsApi.getPaginated(1,4);
//           setBlogs(data.data); 
//           console.log(data);
//         } catch (error) {
//           console.error("Failed to load blogs");
//         } finally {
//           setLoading(false);
//         }
//       };
  
//       fetchData();
//     }, []);

//   return (
//     <Box sx={{ bgcolor: '#f9f9f9', minHeight: '100vh', py: 8 }}>
//       <Container maxWidth="lg">
        
//         {/* Page Header */}
//         <Box mb={6} textAlign="center">
//           <Typography 
//             variant="h3" 
//             component="h1" 
//             fontWeight="bold" 
//             gutterBottom
//             sx={{ color: '#2c3e50' }}
//           >
//             Latest Insights
//           </Typography>
//           <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
//             Thoughts, tutorials, and trends from our team of experts.
//           </Typography>
//         </Box>

 
//         <Grid container spacing={4}>
//           {loading
//             ? // Render skeletons while loading
//               Array.from(new Array(6)).map((_, index) => <BlogSkeleton key={index} />)
//             : // Render actual blog cards
//               blogs.map((post) => (
//                 <Grid size={{ xs: 12, md: 6, lg: 6, xl: 4 }} key={post._id}>
//                   <Card 
//                     sx={{ 
//                       height: '100%', 
//                       display: 'flex', 
//                       flexDirection: 'column',
//                       borderRadius: 3,
//                       boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
//                       transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
//                       '&:hover': {
//                         transform: 'translateY(-8px)',
//                         boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
//                       }
//                     }}
//                   >
//                     {/* Blog Image */}
//                     <CardMedia
//                       component="img"
//                       height="200"
//                       image={post.image}
//                       alt={post.title}
//                     />

//                     <CardContent sx={{ flexGrow: 1, p: 3 }}>
//                       {/* Category Chip */}
//                       <Chip 
//                         label={post.category} 
//                         size="small" 
//                         sx={{ 
//                           bgcolor: '#e3f2fd', 
//                           color: '#1565c0', 
//                           fontWeight: 'bold', 
//                           mb: 2 
//                         }} 
//                       />

//                       {/* Title */}
//                       <Typography gutterBottom variant="h5" component="h2" fontWeight="bold">
//                         {post.title}
//                       </Typography>

//                       {/* Excerpt */}
//                       <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 3 }}>
//                         {post.excerpt}
//                       </Typography>

//                       {/* Author & Date Metadata */}
//                       <Stack direction="row" alignItems="center" spacing={1} mb={2}>
//                         <Avatar src={post.authorAvatar} sx={{ width: 32, height: 32 }} />
//                         <Box>
//                           <Typography variant="subtitle2" sx={{ lineHeight: 1 }}>
//                             {post.author}
//                           </Typography>
//                           <Typography variant="caption" color="text.secondary">
//                             {post.date}
//                           </Typography>
//                         </Box>
//                       </Stack>
//                     </CardContent>

//                     {/* Footer Actions */}
//                     <Box sx={{ p: 3, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                       <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'text.secondary' }}>
//                         <AccessTimeIcon fontSize="small" />
//                         <Typography variant="caption">{post.readTime}</Typography>
//                       </Stack>
                      
//                       <Button 
//                         size="small" 
//                         endIcon={<ArrowForwardIcon />}
//                         sx={{ textTransform: 'none', fontWeight: 'bold' }}
//                       >
//                         Read More
//                       </Button>
//                     </Box>
//                   </Card>
//                 </Grid>
//               ))}
//         </Grid>
        
//         {/* Load More Button (Optional) */}
//         <Box textAlign="center" mt={8}>
//           <Button variant="outlined" size="large" sx={{ px: 4, borderRadius: 2 }} 
//           disabled={!hasMore}  
//           >
//             View More
//           </Button>
//         </Box>

//       </Container>
//     </Box>
//   );
// }

// export default Blogs;
