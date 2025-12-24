import React, { useMemo, useState, useEffect } from 'react';
import { 
    Grid, Paper, Typography, Box, Stack, Avatar, Chip, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    IconButton, LinearProgress, Divider, Button,
    Tooltip, Skeleton, useTheme
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CommentIcon from '@mui/icons-material/Comment';
import PeopleIcon from '@mui/icons-material/People';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { blogsApi } from '../../api/blogApi';

const StatCard = ({ title, value, icon, color, trend, loading }) => {
    const theme = useTheme();
    return (
        <Paper 
            elevation={0} 
            sx={{ 
                p: 3, borderRadius: 3, height: '100%', 
                bgcolor: 'background.paper',
                border: `1px solid ${theme.palette.divider}`,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: theme.shadows[4] }
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight="600" sx={{ mb: 1 }}>
                        {title}
                    </Typography>
                    {loading ? (
                        <Skeleton variant="rectangular" width={60} height={40} />
                    ) : (
                        <Typography variant="h4" fontWeight="800" color="text.primary">
                            {value}
                        </Typography>
                    )}
                    {trend && (
                        <Typography variant="caption" sx={{ color: 'success.main', display: 'flex', alignItems: 'center', mt: 1, fontWeight: 600 }}>
                            <TrendingUpIcon sx={{ fontSize: 14, mr: 0.5 }} /> {trend}
                        </Typography>
                    )}
                </Box>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${color}.main`, color: 'white', display: 'flex' }}>
                    {icon}
                </Box>
            </Box>
        </Paper>
    );
};

const DashboardHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const data = await blogsApi.getByAuthor(user.username);
        setPosts(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user.username]);

  const stats = useMemo(() => {
    if (!posts.length) return { totalPosts: 0, totalViews: 0, totalLikes: 0, topCategories: [] };
    const totalPosts = posts.length;
    const totalViews = posts.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const totalLikes = posts.reduce((acc, curr) => acc + (curr.likes?.length || 0), 0);

    const categoryCount = {};
    posts.forEach(post => {
        const cat = post.category || 'Uncategorized';
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    const topCategories = Object.entries(categoryCount)
        .map(([name, count]) => ({
            name, count, percent: Math.round((count / totalPosts) * 100),
            color: 'primary' // Simplified color
        }))
        .sort((a, b) => b.count - a.count).slice(0, 4);

    return { totalPosts, totalViews, totalLikes, topCategories };
  }, [posts]);

  return (
    <Box>
      {/* HEADER */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="text.primary">Dashboard</Typography>
            <Typography variant="body1" color="text.secondary">
                Welcome back, {user?.username}!
            </Typography>
        </Box>
        <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => navigate('/dashboard/create')}
            sx={{ fontWeight: 700, borderRadius: 2 }}
        >
            New Post
        </Button>
      </Box>

      <Grid container spacing={3}>
        
        {/* STAT CARDS */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard title="Total Posts" value={stats.totalPosts} loading={loading} icon={<ArticleIcon />} color="primary" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard title="Total Views" value={stats.totalViews} loading={loading} icon={<TrendingUpIcon />} color="success" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard title="Interactions" value={stats.totalLikes} loading={loading} icon={<CommentIcon />} color="warning" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard title="Avg. Views" value={stats.totalPosts ? Math.round(stats.totalViews/stats.totalPosts) : 0} loading={loading} icon={<PeopleIcon />} color="info" />
        </Grid>

        {/* RECENT POSTS TABLE */}
        <Grid size={{ xs: 12, md: 8 }}>
            <Paper elevation={0} sx={{ p: 0, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, overflow: 'hidden' }}>
                <Box p={3} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="700">Recent Articles</Typography>
                    <Button endIcon={<ArrowForwardIcon />} size="small" onClick={() => navigate('/dashboard/my-blogs')}>View All</Button>
                </Box>
                <Divider />
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: 'action.hover' }}>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Views</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={5} align="center">Loading...</TableCell></TableRow>
                            ) : posts.slice(0, 5).map((row) => (
                                <TableRow key={row._id} hover>
                                    <TableCell sx={{ fontWeight: 600 }}>{row.title}</TableCell>
                                    <TableCell><Chip label={row.category} size="small" /></TableCell>
                                    <TableCell>{row.views || 0}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={row.status} 
                                            size="small" 
                                            color={row.status === 'published' ? 'success' : 'default'}
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={() => navigate(`/dashboard/blog/edit/${row._id}`)}>
                                            <MoreVertIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Grid>

        {/* CATEGORIES */}
        <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                <Typography variant="h6" fontWeight="700" mb={3}>Categories</Typography>
                {loading ? <Skeleton /> : (
                    <Stack spacing={3}>
                        {stats.topCategories.map((cat) => (
                            <Box key={cat.name}>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography variant="body2" fontWeight="600">{cat.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">{cat.count}</Typography>
                                </Box>
                                <LinearProgress variant="determinate" value={cat.percent} color={cat.color} sx={{ borderRadius: 2, height: 6 }} />
                            </Box>
                        ))}
                    </Stack>
                )}
            </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHome;

// import React, { useMemo, useState, useEffect } from 'react';
// import { 
//     Grid, Paper, Typography, Box, Stack, Avatar, Chip, 
//     Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
//     IconButton, LinearProgress, Divider, Button,
//     Tooltip, useTheme, Skeleton
// } from '@mui/material';
// import ArticleIcon from '@mui/icons-material/Article';
// import TrendingUpIcon from '@mui/icons-material/TrendingUp';
// import CommentIcon from '@mui/icons-material/Comment';
// import PeopleIcon from '@mui/icons-material/People';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// import AddIcon from '@mui/icons-material/Add';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { blogsApi } from '../../api/blogApi';

// // --- Components ---

// // 1. Professional Stat Card
// const StatCard = ({ title, value, icon, color, trend, loading }) => (
//     <Paper 
//         elevation={0} 
//         sx={{ 
//             p: 3, borderRadius: 3, height: '100%', border: '1px solid', borderColor: 'divider',
//             transition: 'transform 0.2s',
//             '&:hover': { transform: 'translateY(-4px)', boxShadow: (theme) => theme.shadows[4] }
//         }}
//     >
//         <Box display="flex" justifyContent="space-between" alignItems="flex-start">
//             <Box>
//                 <Typography variant="body2" color="text.secondary" fontWeight="600" sx={{ mb: 1 }}>
//                     {title}
//                 </Typography>
//                 {loading ? (
//                     <Skeleton variant="rectangular" width={60} height={40} />
//                 ) : (
//                     <Typography variant="h4" fontWeight="800" color="text.primary">
//                         {value}
//                     </Typography>
//                 )}
//                 {trend && (
//                     <Typography variant="caption" sx={{ color: 'success.dark', display: 'flex', alignItems: 'center', mt: 1, fontWeight: 600 }}>
//                         <TrendingUpIcon sx={{ fontSize: 14, mr: 0.5 }} /> {trend}
//                     </Typography>
//                 )}
//             </Box>
//             <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${color}.50`, color: `${color}.main`, display: 'flex' }}>
//                 {icon}
//             </Box>
//         </Box>
//     </Paper>
// );

// // 2. Dynamic Bar Chart (Shows Top 7 Most Viewed Posts)
// const ViewsBarChart = ({ data }) => {
//     // Normalize height for bars (find max value to scale percentages)
//     const maxVal = Math.max(...data.map(d => d.views), 1);

//     return (
//         <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 200, mt: 2, px: 2, gap: 1 }}>
//             {data.length === 0 ? (
//                  <Typography variant="body2" color="text.secondary" sx={{ width: '100%', textAlign: 'center', alignSelf: 'center' }}>
//                      No data available for chart
//                  </Typography>
//             ) : data.map((item, i) => {
//                 const heightPercent = Math.max((item.views / maxVal) * 100, 10); // Min 10% height
//                 return (
//                     <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
//                         <Tooltip title={`${item.title}: ${item.views} Views`}>
//                             <Box 
//                                 sx={{ 
//                                     width: '60%', 
//                                     height: `${heightPercent}%`, 
//                                     bgcolor: i === 0 ? 'primary.main' : 'primary.light', // Highlight top post
//                                     borderRadius: '4px 4px 0 0',
//                                     opacity: i === 0 ? 1 : 0.6,
//                                     transition: 'all 0.3s',
//                                     '&:hover': { opacity: 1, transform: 'scaleY(1.05)' }
//                                 }} 
//                             />
//                         </Tooltip>
//                         {/* Truncate title for X-axis */}
//                         <Typography variant="caption" color="text.secondary" sx={{ mt: 1, fontSize: '0.65rem', maxWidth: '40px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                             {item.title.substring(0, 6)}..
//                         </Typography>
//                     </Box>
//                 )
//             })}
//         </Box>
//     );
// };

// // --- MAIN PAGE ---

// const DashboardHome = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // --- 1. FETCH REAL DATA ---
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       setLoading(true);
//       try {
//         const data = await blogsApi.getByAuthor(user.username);
//         setPosts(data || []);
//       } catch (err) {
//         console.error("Failed to load dashboard data", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDashboardData();
//   }, [user.username]);

//   // --- 2. CALCULATE STATS (MEMOIZED) ---
//   const stats = useMemo(() => {
//     if (!posts.length) return { totalPosts: 0, totalViews: 0, totalLikes: 0, topCategories: [], chartData: [] };

//     // A. Basic Totals
//     const totalPosts = posts.length;
//     const totalViews = posts.reduce((acc, curr) => acc + (curr.views || 0), 0);
//     const totalLikes = posts.reduce((acc, curr) => acc + (curr.likes?.length || 0), 0); // Assuming likes is an array of IDs

//     // B. Calculate Categories Distribution
//     const categoryCount = {};
//     posts.forEach(post => {
//         const cat = post.category || 'Uncategorized';
//         categoryCount[cat] = (categoryCount[cat] || 0) + 1;
//     });

//     // Convert to array, sort by count, take top 4
//     const topCategories = Object.entries(categoryCount)
//         .map(([name, count]) => ({
//             name,
//             count,
//             percent: Math.round((count / totalPosts) * 100),
//             color: ['primary', 'secondary', 'warning', 'info', 'success'][Math.floor(Math.random() * 5)] // Random color
//         }))
//         .sort((a, b) => b.count - a.count)
//         .slice(0, 4);

//     // C. Chart Data: Top 7 Posts by Views
//     const chartData = [...posts]
//         .sort((a, b) => (b.views || 0) - (a.views || 0))
//         .slice(0, 7)
//         .map(p => ({ title: p.title, views: p.views || 0 }));

//     return { totalPosts, totalViews, totalLikes, topCategories, chartData };
//   }, [posts]);


//   return (
//     <Box>
//       {/* --- HEADER --- */}
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
//         <Box>
//             <Typography variant="h4" fontWeight="800" color="text.primary">Dashboard</Typography>
//             <Typography variant="body1" color="text.secondary">
//                 Welcome back, {user?.username}! Here is your real-time overview.
//             </Typography>
//         </Box>
//         <Button 
//             variant="contained" 
//             startIcon={<AddIcon />} 
//             onClick={() => navigate('/dashboard/create')}
//         >
//             New Post
//         </Button>
//       </Box>

//       <Grid container spacing={3}>
        
//         {/* --- ROW 1: REAL STAT CARDS --- */}
//         <Grid size={{ xs: 12, sm: 6, md: 3 }}>

//             <StatCard 
//                 title="Total Posts" 
//                 value={stats.totalPosts} 
//                 loading={loading}
//                 icon={<ArticleIcon />} 
//                 color="primary" 
//                 trend="All time" 
//             />
//         </Grid>
//         <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//             <StatCard 
//                 title="Total Views" 
//                 value={stats.totalViews.toLocaleString()} // Format 1,200
//                 loading={loading}
//                 icon={<TrendingUpIcon />} 
//                 color="success" 
//                 trend="Across all articles" 
//             />
//         </Grid>
//         <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//             <StatCard 
//                 title="Total Interactions" 
//                 value={stats.totalLikes} 
//                 loading={loading}
//                 icon={<CommentIcon />} 
//                 color="warning" 
//                 trend="Likes & Comments" 
//             />
//         </Grid>
//         <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//             <StatCard 
//                 title="Engagement Rate" 
//                 value={`${stats.totalViews ? ((stats.totalLikes / stats.totalViews) * 100).toFixed(1) : 0}%`} 
//                 loading={loading}
//                 icon={<PeopleIcon />} 
//                 color="info" 
//                 trend="Avg. performance" 
//             />
//         </Grid>

//         {/* --- ROW 2: REAL CHARTS & ANALYTICS --- */}
        
//         {/* Main Chart Area */}
//         <Grid size={{ xs: 12, md: 8 }}>
//             <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
//                 <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//                     <Typography variant="h6" fontWeight="700">Top Performing Articles</Typography>
//                     <Chip label="By Views" size="small" />
//                 </Box>
//                 <Divider />
//                 {loading ? (
//                      <Box height={200} display="flex" alignItems="center" justifyContent="center">
//                          <Typography>Loading Chart...</Typography>
//                      </Box>
//                 ) : (
//                     <ViewsBarChart data={stats.chartData} />
//                 )}
//             </Paper>
//         </Grid>

//         {/* Side Stats (Dynamic Categories) */}
//         <Grid size={{ xs: 12, md: 4 }}>
//             <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
//                 <Typography variant="h6" fontWeight="700" mb={3}>Category Breakdown</Typography>
                
//                 {loading ? (
//                     <Stack spacing={2}>
//                          <Skeleton variant="rectangular" height={20} />
//                          <Skeleton variant="rectangular" height={20} />
//                          <Skeleton variant="rectangular" height={20} />
//                     </Stack>
//                 ) : stats.topCategories.length > 0 ? (
//                     <Stack spacing={3}>
//                         {stats.topCategories.map((cat) => (
//                             <Box key={cat.name}>
//                                 <Box display="flex" justifyContent="space-between" mb={1}>
//                                     <Typography variant="body2" fontWeight="600">{cat.name}</Typography>
//                                     <Typography variant="body2" color="text.secondary">{cat.count} posts</Typography>
//                                 </Box>
//                                 <LinearProgress 
//                                     variant="determinate" 
//                                     value={cat.percent} 
//                                     color={cat.color} 
//                                     sx={{ height: 8, borderRadius: 4 }} 
//                                 />
//                             </Box>
//                         ))}
//                     </Stack>
//                 ) : (
//                     <Typography color="text.secondary">No categories found yet.</Typography>
//                 )}

//                 <Box mt={4} p={2} bgcolor="background.default" borderRadius={2}>
//                     <Typography variant="body2" color="text.secondary" align="center">
//                         {stats.topCategories.length > 0 
//                             ? `💡 Tip: Write more about "${stats.topCategories[0].name}"!`
//                             : "💡 Tip: Write your first article to see stats!"}
//                     </Typography>
//                 </Box>
//             </Paper>
//         </Grid>

//         {/* --- ROW 3: RECENT POSTS TABLE --- */}
//         <Grid size={{ xs: 12 }}>
//             <Paper elevation={0} sx={{ p: 0, borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
//                 <Box p={3} display="flex" justifyContent="space-between" alignItems="center">
//                     <Typography variant="h6" fontWeight="700">Recent Articles</Typography>
//                     <Button endIcon={<ArrowForwardIcon />} size="small" onClick={() => navigate('/dashboard/my-blogs')}>View All</Button>
//                 </Box>
//                 <Divider />
                
//                 <TableContainer>
//                     <Table>
//                         <TableHead sx={{ bgcolor: 'background.default' }}>
//                             <TableRow>
//                                 <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Title</TableCell>
//                                 <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Category</TableCell>
//                                 <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Views</TableCell>
//                                 <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Status</TableCell>
//                                 <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Date</TableCell>
//                                 <TableCell align="right" sx={{ fontWeight: 600, color: 'text.secondary' }}>Action</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {loading ? (
//                                 <TableRow>
//                                     <TableCell colSpan={6} align="center"><Typography py={3}>Loading data...</Typography></TableCell>
//                                 </TableRow>
//                             ) : posts.slice(0, 5).map((row) => (
//                                 <TableRow key={row._id} hover>
//                                     <TableCell>
//                                         <Typography variant="body2" fontWeight="600">{row.title}</Typography>
//                                     </TableCell>
//                                     <TableCell>
//                                         <Chip label={row.category || 'General'} size="small" sx={{ bgcolor: 'background.default', fontWeight: 500 }} />
//                                     </TableCell>
//                                     <TableCell>{row.views ?? 0}</TableCell>
//                                     <TableCell>
//                                         <Chip 
//                                             label={row.status} 
//                                             size="small" 
//                                             color={row.status === 'published' ? 'success' : row.status === 'archived' ? 'error' : 'warning'}
//                                             variant={row.status === 'published' ? 'filled' : 'outlined'}
//                                         />
//                                     </TableCell>
//                                     <TableCell sx={{ color: 'text.secondary' }}>
//                                         {new Date(row.publishedAt || row.createdAt).toLocaleDateString()}
//                                     </TableCell>
//                                     <TableCell align="right">
//                                         <IconButton size="small" onClick={() => navigate(`/dashboard/blog/edit/${row._id}`)}>
//                                             <MoreVertIcon fontSize="small" />
//                                         </IconButton>
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             </Paper>
//         </Grid>

//       </Grid>
//     </Box>
//   );
// };

// export default DashboardHome; 