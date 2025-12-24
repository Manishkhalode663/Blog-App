import React, { useMemo, useState, useEffect } from 'react';
import { 
    Grid, Paper, Typography, Box, Stack, Avatar, Chip, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    IconButton, LinearProgress, Divider, Button,
    Tooltip, useTheme, Skeleton
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

// --- Components ---

// 1. Professional Stat Card
const StatCard = ({ title, value, icon, color, trend, loading }) => (
    <Paper 
        elevation={0} 
        sx={{ 
            p: 3, borderRadius: 3, height: '100%', border: '1px solid', borderColor: 'divider',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: (theme) => theme.shadows[4] }
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
                    <Typography variant="caption" sx={{ color: 'success.dark', display: 'flex', alignItems: 'center', mt: 1, fontWeight: 600 }}>
                        <TrendingUpIcon sx={{ fontSize: 14, mr: 0.5 }} /> {trend}
                    </Typography>
                )}
            </Box>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${color}.50`, color: `${color}.main`, display: 'flex' }}>
                {icon}
            </Box>
        </Box>
    </Paper>
);

// 2. Dynamic Bar Chart (Shows Top 7 Most Viewed Posts)
const ViewsBarChart = ({ data }) => {
    // Normalize height for bars (find max value to scale percentages)
    const maxVal = Math.max(...data.map(d => d.views), 1);

    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 200, mt: 2, px: 2, gap: 1 }}>
            {data.length === 0 ? (
                 <Typography variant="body2" color="text.secondary" sx={{ width: '100%', textAlign: 'center', alignSelf: 'center' }}>
                     No data available for chart
                 </Typography>
            ) : data.map((item, i) => {
                const heightPercent = Math.max((item.views / maxVal) * 100, 10); // Min 10% height
                return (
                    <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        <Tooltip title={`${item.title}: ${item.views} Views`}>
                            <Box 
                                sx={{ 
                                    width: '60%', 
                                    height: `${heightPercent}%`, 
                                    bgcolor: i === 0 ? 'primary.main' : 'primary.light', // Highlight top post
                                    borderRadius: '4px 4px 0 0',
                                    opacity: i === 0 ? 1 : 0.6,
                                    transition: 'all 0.3s',
                                    '&:hover': { opacity: 1, transform: 'scaleY(1.05)' }
                                }} 
                            />
                        </Tooltip>
                        {/* Truncate title for X-axis */}
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, fontSize: '0.65rem', maxWidth: '40px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.title.substring(0, 6)}..
                        </Typography>
                    </Box>
                )
            })}
        </Box>
    );
};

// --- MAIN PAGE ---

const DashboardHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. FETCH REAL DATA ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const data = await blogsApi.getByAuthor(user.username);
        setPosts(data || []);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user.username]);

  // --- 2. CALCULATE STATS (MEMOIZED) ---
  const stats = useMemo(() => {
    if (!posts.length) return { totalPosts: 0, totalViews: 0, totalLikes: 0, topCategories: [], chartData: [] };

    // A. Basic Totals
    const totalPosts = posts.length;
    const totalViews = posts.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const totalLikes = posts.reduce((acc, curr) => acc + (curr.likes?.length || 0), 0); // Assuming likes is an array of IDs

    // B. Calculate Categories Distribution
    const categoryCount = {};
    posts.forEach(post => {
        const cat = post.category || 'Uncategorized';
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    // Convert to array, sort by count, take top 4
    const topCategories = Object.entries(categoryCount)
        .map(([name, count]) => ({
            name,
            count,
            percent: Math.round((count / totalPosts) * 100),
            color: ['primary', 'secondary', 'warning', 'info', 'success'][Math.floor(Math.random() * 5)] // Random color
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 4);

    // C. Chart Data: Top 7 Posts by Views
    const chartData = [...posts]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 7)
        .map(p => ({ title: p.title, views: p.views || 0 }));

    return { totalPosts, totalViews, totalLikes, topCategories, chartData };
  }, [posts]);


  return (
    <Box>
      {/* --- HEADER --- */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="text.primary">Dashboard</Typography>
            <Typography variant="body1" color="text.secondary">
                Welcome back, {user?.username}! Here is your real-time overview.
            </Typography>
        </Box>
        <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => navigate('/dashboard/create')}
        >
            New Post
        </Button>
      </Box>

      <Grid container spacing={3}>
        
        {/* --- ROW 1: REAL STAT CARDS --- */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>

            <StatCard 
                title="Total Posts" 
                value={stats.totalPosts} 
                loading={loading}
                icon={<ArticleIcon />} 
                color="primary" 
                trend="All time" 
            />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard 
                title="Total Views" 
                value={stats.totalViews.toLocaleString()} // Format 1,200
                loading={loading}
                icon={<TrendingUpIcon />} 
                color="success" 
                trend="Across all articles" 
            />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard 
                title="Total Interactions" 
                value={stats.totalLikes} 
                loading={loading}
                icon={<CommentIcon />} 
                color="warning" 
                trend="Likes & Comments" 
            />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard 
                title="Engagement Rate" 
                value={`${stats.totalViews ? ((stats.totalLikes / stats.totalViews) * 100).toFixed(1) : 0}%`} 
                loading={loading}
                icon={<PeopleIcon />} 
                color="info" 
                trend="Avg. performance" 
            />
        </Grid>

        {/* --- ROW 2: REAL CHARTS & ANALYTICS --- */}
        
        {/* Main Chart Area */}
        <Grid size={{ xs: 12, md: 8 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight="700">Top Performing Articles</Typography>
                    <Chip label="By Views" size="small" />
                </Box>
                <Divider />
                {loading ? (
                     <Box height={200} display="flex" alignItems="center" justifyContent="center">
                         <Typography>Loading Chart...</Typography>
                     </Box>
                ) : (
                    <ViewsBarChart data={stats.chartData} />
                )}
            </Paper>
        </Grid>

        {/* Side Stats (Dynamic Categories) */}
        <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                <Typography variant="h6" fontWeight="700" mb={3}>Category Breakdown</Typography>
                
                {loading ? (
                    <Stack spacing={2}>
                         <Skeleton variant="rectangular" height={20} />
                         <Skeleton variant="rectangular" height={20} />
                         <Skeleton variant="rectangular" height={20} />
                    </Stack>
                ) : stats.topCategories.length > 0 ? (
                    <Stack spacing={3}>
                        {stats.topCategories.map((cat) => (
                            <Box key={cat.name}>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography variant="body2" fontWeight="600">{cat.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">{cat.count} posts</Typography>
                                </Box>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={cat.percent} 
                                    color={cat.color} 
                                    sx={{ height: 8, borderRadius: 4 }} 
                                />
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <Typography color="text.secondary">No categories found yet.</Typography>
                )}

                <Box mt={4} p={2} bgcolor="background.default" borderRadius={2}>
                    <Typography variant="body2" color="text.secondary" align="center">
                        {stats.topCategories.length > 0 
                            ? `💡 Tip: Write more about "${stats.topCategories[0].name}"!`
                            : "💡 Tip: Write your first article to see stats!"}
                    </Typography>
                </Box>
            </Paper>
        </Grid>

        {/* --- ROW 3: RECENT POSTS TABLE --- */}
        <Grid size={{ xs: 12 }}>
            <Paper elevation={0} sx={{ p: 0, borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                <Box p={3} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="700">Recent Articles</Typography>
                    <Button endIcon={<ArrowForwardIcon />} size="small" onClick={() => navigate('/dashboard/my-blogs')}>View All</Button>
                </Box>
                <Divider />
                
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: 'background.default' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Title</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Category</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Views</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Date</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600, color: 'text.secondary' }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center"><Typography py={3}>Loading data...</Typography></TableCell>
                                </TableRow>
                            ) : posts.slice(0, 5).map((row) => (
                                <TableRow key={row._id} hover>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="600">{row.title}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={row.category || 'General'} size="small" sx={{ bgcolor: 'background.default', fontWeight: 500 }} />
                                    </TableCell>
                                    <TableCell>{row.views ?? 0}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={row.status} 
                                            size="small" 
                                            color={row.status === 'published' ? 'success' : row.status === 'archived' ? 'error' : 'warning'}
                                            variant={row.status === 'published' ? 'filled' : 'outlined'}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>
                                        {new Date(row.publishedAt || row.createdAt).toLocaleDateString()}
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

      </Grid>
    </Box>
  );
};

export default DashboardHome;
// import React from 'react';
// import { 
//     Grid, Paper, Typography, Box, Stack, Avatar, Chip, 
//     Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
//     IconButton, LinearProgress, Divider, Button,
//     Tooltip, useTheme
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

// // 1. Professional Stat Card with Trend Indicator
// const StatCard = ({ title, value, icon, color, trend }) => (
//     <Paper 
//         elevation={0} 
//         sx={{ 
//             p: 3, 
//             borderRadius: 3, 
//             height: '100%',
//             border: '1px solid',
//             borderColor: 'divider',
//             transition: 'transform 0.2s',
//             '&:hover': { transform: 'translateY(-4px)', boxShadow: (theme) => theme.shadows[4] }
//         }}
//     >
//         <Box display="flex" justifyContent="space-between" alignItems="flex-start">
//             <Box>
//                 <Typography variant="body2" color="text.secondary" fontWeight="600" sx={{ mb: 1 }}>
//                     {title}
//                 </Typography>
//                 <Typography variant="h4" fontWeight="800" color="text.primary">
//                     {value}
//                 </Typography>
//                 {trend && (
//                     <Typography variant="caption" sx={{ color: 'success.dark', display: 'flex', alignItems: 'center', mt: 1, fontWeight: 600 }}>
//                         <TrendingUpIcon sx={{ fontSize: 14, mr: 0.5 }} /> {trend}
//                     </Typography>
//                 )}
//             </Box>
//             <Box 
//                 sx={{ 
//                     p: 1.5, 
//                     borderRadius: 2, 
//                     bgcolor: `${color}.50`, 
//                     color: `${color}.main`,
//                     display: 'flex' 
//                 }}
//             >
//                 {icon}
//             </Box>
//         </Box>
//     </Paper>
// );

// // 2. Simple CSS-Only Bar Chart (No external libraries needed)
// const MockBarChart = () => {
//     const data = [40, 70, 45, 90, 60, 80, 50]; // Percentages
//     const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
//     return (
//         <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 200, mt: 2, px: 2 }}>
//             {data.map((height, i) => (
//                 <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
//                     <Tooltip title={`${height} Views`}>
//                         <Box 
//                             sx={{ 
//                                 width: '40%', 
//                                 height: `${height}%`, 
//                                 bgcolor: i === 3 ? 'primary.main' : 'primary.light', // Highlight peak
//                                 borderRadius: '4px 4px 0 0',
//                                 opacity: i === 3 ? 1 : 0.6,
//                                 transition: 'all 0.3s',
//                                 '&:hover': { opacity: 1, transform: 'scaleY(1.05)' }
//                             }} 
//                         />
//                     </Tooltip>
//                     <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>{days[i]}</Typography>
//                 </Box>
//             ))}
//         </Box>
//     );
// };
 

// const CATEGORY_STATS = [
//     { name: 'Technology', count: 12, percent: 70, color: 'primary' },
//     { name: 'Design', count: 5, percent: 40, color: 'secondary' },
//     { name: 'Lifestyle', count: 3, percent: 25, color: 'warning' },
// ];


// const DashboardHome = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [recentPosts, setRecentPosts] = React.useState([]);

//   React.useEffect(() => {
//     const fetchRecentPosts = async () => {
//       try {
//         const posts = await blogsApi.getByAuthor(user.username);
//         const enriched = (posts || []).map(post => ({
//           ...post,
//           statusColor: post.status === 'published' ? 'success' : 'warning'
//         })); 
        
//         setRecentPosts(enriched.slice(0, 5));
//       } catch (err) {
//         console.error(err);
//         setRecentPosts([]);
//       }
//     };
//     fetchRecentPosts();
//   }, [user.username]);

//   const RECENT_POSTS = recentPosts;

//   return (
//     <Box>
//       {/* --- HEADER --- */}
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
//         <Box>
//             <Typography variant="h4" fontWeight="800" color="text.primary">
//                 Dashboard
//             </Typography>
//             <Typography variant="body1" color="text.secondary">
//                 Welcome back, {user?.username}! Here's what's happening.
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
        
//         {/* --- ROW 1: STAT CARDS --- */}
//         <Grid  size={{ xs:12, sm:6, md:3}}>
//             <StatCard title="Total Posts" value="24" icon={<ArticleIcon />} color="primary" trend="+2 this week" />
//         </Grid>
//         <Grid  size={{ xs:12, sm:6, md:3}}>
//             <StatCard title="Total Views" value="45.2k" icon={<TrendingUpIcon />} color="success" trend="+12% vs last month" />
//         </Grid>
//         <Grid  size={{ xs:12, sm:6, md:3}}>
//             <StatCard title="Comments" value="128" icon={<CommentIcon />} color="warning" trend="+5 new today" />
//         </Grid>
//         <Grid  size={{ xs:12, sm:6, md:3}}>
//             <StatCard title="Subscribers" value="850" icon={<PeopleIcon />} color="info" trend="+18 this week" />
//         </Grid>

//         {/* --- ROW 2: CHARTS & ANALYTICS --- */}
        
//         {/* Main Chart Area */}
//         <Grid size={{ xs:12, md:8}}>
//             <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
//                 <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//                     <Typography variant="h6" fontWeight="700">Views Overview</Typography>
//                     <Chip label="Last 7 Days" size="small" />
//                 </Box>
//                 <Divider />
//                 <MockBarChart />
//             </Paper>
//         </Grid>

//         {/* Side Stats (Categories) */}
//         <Grid  size={{ xs:12, md:4}}>
//             <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
//                 <Typography variant="h6" fontWeight="700" mb={3}>Top Categories</Typography>
                
//                 <Stack spacing={3}>
//                     {CATEGORY_STATS.map((cat) => (
//                         <Box key={cat.name}>
//                             <Box display="flex" justifyContent="space-between" mb={1}>
//                                 <Typography variant="body2" fontWeight="600">{cat.name}</Typography>
//                                 <Typography variant="body2" color="text.secondary">{cat.count} posts</Typography>
//                             </Box>
//                             <LinearProgress 
//                                 variant="determinate" 
//                                 value={cat.percent} 
//                                 color={cat.color} 
//                                 sx={{ height: 8, borderRadius: 4 }} 
//                             />
//                         </Box>
//                     ))}
//                 </Stack>

//                 <Box mt={4} p={2} bgcolor="background.default" borderRadius={2}>
//                     <Typography variant="body2" color="text.secondary" align="center">
//                         💡 Tip: Design articles are trending this week!
//                     </Typography>
//                 </Box>
//             </Paper>
//         </Grid>

//         {/* --- ROW 3: RECENT POSTS TABLE --- */}
//         <Grid  size={{ xs:12}}>
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
//                             {recentPosts.map((row) => (
//                                 <TableRow key={row._id} hover>
//                                     <TableCell>
//                                         <Typography variant="body2" fontWeight="600">{row.title}</Typography>
//                                     </TableCell>
//                                     <TableCell>
//                                         <Chip label={row.category} size="small" sx={{ bgcolor: 'background.default', fontWeight: 500 }} />
//                                     </TableCell>
//                                     <TableCell>{row.views ?? 0}</TableCell>
//                                     <TableCell>
//                                         <Chip 
//                                             label={row.status} 
//                                             size="small" 
//                                             color={row.statusColor || 'default'}
//                                             variant={row.status === 'published' ? 'filled' : 'outlined'}
//                                         />
//                                     </TableCell>
//                                     <TableCell sx={{ color: 'text.secondary' }}>
//                                         {new Date(row.publishedAt || row.createdAt).toLocaleDateString()}
//                                     </TableCell>
//                                     <TableCell align="right">
//                                         <IconButton size="small"><MoreVertIcon fontSize="small" /></IconButton>
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