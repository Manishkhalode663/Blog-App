
import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
import {
    Box, Typography, Button, IconButton, Container, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip, Avatar, Tooltip, Skeleton, Fade, Stack, Grow, useTheme, alpha
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive'; // New Icon for Restore
import ArticleIcon from '@mui/icons-material/Article';
import CircleIcon from '@mui/icons-material/Circle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { blogsApi } from '../../api/blogApi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DeleteBlogModal from '../../components/admin/DeleteBlogModal';
import { useSnackbar } from '../../context/SnackbarContext';

// -------------------------- HELPER FUNCTIONS --------------------------

const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

const getStatusStyle = (status, theme) => {
    switch (status) {
        case 'published':
            return { label: 'Published', color: 'success.main', bgcolor: alpha(theme.palette.success.main, 0.12), border: `1px solid ${alpha(theme.palette.success.main, 0.3)}` };
        case 'draft':
            return { label: 'Draft', color: 'warning.main', bgcolor: alpha(theme.palette.warning.main, 0.12), border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}` };
        case 'scheduled':
            return { label: 'Scheduled', color: 'info.main', bgcolor: alpha(theme.palette.info.main, 0.12), border: `1px solid ${alpha(theme.palette.info.main, 0.3)}` };
        case 'archived':
            // Alag schema hai, par UI styling ke liye status handle kar lete hain
            return { label: 'Archived', color: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.12), border: `1px solid ${alpha(theme.palette.error.main, 0.3)}` };
        default:
            return { label: 'Unknown', color: theme.palette.text.secondary, bgcolor: 'transparent', border: `1px solid ${theme.palette.divider}` };
    }
};

// -------------------------- SUB-COMPONENTS --------------------------

const BlogRow = memo(({ blog, filter, theme, onEdit, onDelete, onArchive, onRestore }) => {
    // Agar archived tab mein hain to status 'archived' dikhaye, warn backend status
    const effectiveStatus = filter === 'archived' ? 'archived' : blog.status;
    const statusStyle = useMemo(() => getStatusStyle(effectiveStatus, theme), [effectiveStatus, theme]);

    const displayDate = useMemo(() => {
        if (filter === 'drafts') return null;
        if (effectiveStatus === 'published') return formatDate(blog.publishedAt);
        if (effectiveStatus === 'archived') return formatDate(blog.archivedAt); // Assuming archivedAt field exists in schema
        return formatDate(blog.scheduledAt);
    }, [blog, filter, effectiveStatus]);

    const createdDate = useMemo(() => formatDate(blog.createdAt), [blog.createdAt]);

    return (
        <TableRow
            sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                transition: 'all 0.2s ease',
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.03), '& .action-buttons': { opacity: 1 } },
            }}
        >
            <TableCell sx={{ pl: 3 }}>
                <Avatar variant="rounded" src={blog.image} alt={blog.title} sx={{ width: 56, height: 56, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }} />
            </TableCell>
            <TableCell>
                <Typography variant="subtitle2" fontWeight={700} color="text.primary">{blog.title}</Typography>
                <Typography variant="caption" color="text.secondary">{blog.readTime || '5 min read'}</Typography>
            </TableCell>
            <TableCell>
                <Chip label={blog.category} size="small" sx={{ borderRadius: 1.5, bgcolor: 'action.hover', fontWeight: 600, color: 'text.secondary' }} />
            </TableCell>
            <TableCell>
                <Chip
                    icon={<CircleIcon sx={{ fontSize: '8px !important', color: `${statusStyle.color} !important`, ml: 0.5 }} />}
                    label={statusStyle.label}
                    size="medium"
                    sx={{ bgcolor: statusStyle.bgcolor, color: statusStyle.color, border: statusStyle.border, fontWeight: 700, borderRadius: 1.5, px: 0.5 }}
                />
            </TableCell>
            <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                <Chip label={createdDate} size="large" sx={{ borderRadius: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.08), color: theme.palette.primary.dark, border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}` }} />
            </TableCell>
            {filter !== 'drafts' && (
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, pl: 3 }}>
                    {displayDate && (
                        <Chip label={displayDate} size="large" sx={{ borderRadius: 1.5, bgcolor: alpha(theme.palette.secondary.main, 0.12), color: theme.palette.secondary.dark, border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}` }} />
                    )}
                </TableCell>
            )}
            <TableCell align="right" sx={{ pr: 3 }}>
                <Stack direction="row" spacing={1} justifyContent="flex-end" className="action-buttons" sx={{ opacity: { xs: 1, md: 0.6 }, transition: 'opacity 0.2s' }}>
                    
                    {/* ACTION LOGIC: Agar 'Archived' tab hai to RESTORE dikhao, nahi to ARCHIVE dikhao */}
                    {filter === 'archived' ? (
                         <Tooltip title="Restore Article" arrow>
                            <IconButton onClick={() => onRestore(blog._id)} size="large" sx={{ color: 'text.secondary', border: `1px solid ${theme.palette.divider}`, '&:hover': { color: 'success.main', borderColor: 'success.main', bgcolor: alpha(theme.palette.success.main, 0.1) } }}>
                                <UnarchiveIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    ) : null }

                    {/* Edit button - usually disabled for archived, but keeping it if you want */}
                    {filter !== 'archived' && (
                        <Tooltip title="Edit" arrow>
                            <IconButton onClick={() => onEdit(blog._id)} size="large" sx={{ color: 'text.secondary', border: `1px solid ${theme.palette.divider}`, '&:hover': { color: 'primary.main', borderColor: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.1) } }}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                    {filter !== 'archived' ? (
                    <Tooltip title="Add to Archive" arrow>
                         <IconButton onClick={() => onArchive(blog._id)} size="large" sx={{ color: 'text.secondary', border: `1px solid ${theme.palette.divider}`, '&:hover': { color: theme.palette.common.white, borderColor: theme.palette.error.main, bgcolor: theme.palette.error.main, transform: 'scale(1.05)' } }}>
                             <DeleteIcon fontSize="small" />
                         </IconButton>
                     </Tooltip>
                    ) : (
                        null
                    // <Tooltip title="Delete Permanently" arrow>
                    //     <IconButton onClick={() => onDelete(blog._id)} size="large" sx={{ color: 'text.secondary', border: `1px solid ${theme.palette.divider}`, '&:hover': { color: '#fff', borderColor: theme.palette.error.main, bgcolor: theme.palette.error.main, transform: 'scale(1.05)' } }}>
                    //         <DeleteIcon fontSize="small" />
                    //     </IconButton>
                    // </Tooltip>
                    )
                }
                </Stack>
            </TableCell>
        </TableRow>
    );
});

// -------------------------- MAIN COMPONENT --------------------------

const FILTER_CHIPS = [
    { label: 'All', value: 'all' },
    { label: 'Published', value: 'published' },
    { label: 'Drafts', value: 'draft' },
    { label: 'Scheduled', value: 'scheduled' },
    { label: 'Archived', value: 'archived' }, // Ye alag collection se aayega
];

const MyBlogs = () => {
    // ------------------------------ STATE ------------------------------
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'published', 'drafts', 'scheduled', 'archived'
    const [deleteId, setDeleteId] = useState(null);

    const { user } = useAuth();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const theme = useTheme();

    // -------------------------- DATA FETCHING LOGIC --------------------------
    
    // Bhai yahan logic change kiya hai. 
    // Agar filter 'archived' hai, to Archive API hit hogi.
    // Agar nahi, to normal Author Blogs API hit hogi.
    useEffect(() => {
        const fetchBlogs = async () => {
            if (!user) return;
            setLoading(true);
            try {
                let data;
                if (filter === 'archived') {
                    // 1. Fetch from Archived Collection
                    // NOTE: Make sure 'blogsApi.getArchivedByAuthor' exists in your API helper
                    data = await blogsApi.getArchived();
                    
                } else {
                    // 2. Fetch from Active Blog Collection
                    data = await blogsApi.getByAuthor(user.username);
                }
                setBlogs(data);
            } catch (err) {
                console.error('Failed to fetch blogs', err);
                showSnackbar('Failed to fetch blogs', 'error');
                setBlogs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [user, filter, showSnackbar]); // Dependency 'filter' added: Filter change pe API call dobara hogi

    // -------------------------- ACTIONS --------------------------

    /**
     * Archive Logic (Move to Archive Schema)
     */
    const handleArchive = useCallback(async (id) => {
        // Optimistic UI: Remove from Current List immediately
        const prevBlogs = [...blogs];
        setBlogs(prev => prev.filter(b => b._id !== id));
        showSnackbar('Moving to archive...', 'info');

        try {
            // Backend Transaction call happens here
            await blogsApi.addToArchive(id); 
            showSnackbar('Blog archived successfully', 'success');
        } catch (err) {
            // Revert if failed
            console.error(err);
            setBlogs(prevBlogs);
            showSnackbar(err.response?.data?.message || 'Failed to archive. Is Replica Set enabled?', 'error');
        }
    }, [blogs, showSnackbar]);

    /**
     * Restore Logic (Optional: Move back from Archive to Active)
     */
    const handleRestore = useCallback(async (id) => {
        const prevBlogs = [...blogs];
        setBlogs(prev => prev.filter(b => b._id !== id)); // Remove from Archive view
        
        try {
            // Assuming you have a restore endpoint
            const result = await blogsApi.restore(id);
            showSnackbar(result.message || 'Blog restored successfully', 'success');
        } catch (err) {
            setBlogs(prevBlogs);
            showSnackbar(err.response?.data?.message || 'Failed to restore blog', 'error');
        }
    }, [blogs, showSnackbar]);

    const handleEdit = useCallback((id) => navigate(`/dashboard/blog/edit/${id}`), [navigate]);
    const handleDeleteClick = useCallback((id) => setDeleteId(id), []);

    const handleConfirmDelete = useCallback(async () => {
        if (!deleteId) return;
        
        const prevBlogs = [...blogs];
        setBlogs(prev => prev.filter(b => b._id !== deleteId));
        setDeleteId(null); 

        try {
            let result;
            // Check current filter to decide which delete API to call
            if (filter === 'archived') {
                 
                 result = await blogsApi.delete(deleteId); // Delete from Archive Collection

            } else {
                 result = await blogsApi.addToArchive(deleteId); // Delete from Main Collection
            }
            if(result){
                console.log(result);
                showSnackbar(result.message || 'Blog deleted successfully', 'success');
            }
        } catch (err) {
            setBlogs(prevBlogs);
            showSnackbar(err.response?.data?.message || 'Failed to delete.', 'error');
        }
    }, [deleteId, blogs, filter, showSnackbar]);

    // -------------------------- CLIENT SIDE FILTERING --------------------------
    
    // Server se data aa gaya, ab usmein se 'published'/'draft' filter karna hai.
    // NOTE: 'Archived' ke liye hum already server se sirf archived la rahe hain, to filter ki zarurat nahi.
    const filteredBlogs = useMemo(() => {
        if (filter === 'archived') return blogs; // Already fetched correct data
        if (filter === 'all') return blogs;
        
        // Client side filtering for active statuses
        return blogs.filter(b => b.status === filter);

    }, [blogs, filter]);

    // -------------------------- RENDER ------------------------------
    return (
        <Container maxWidth="xl" sx={{ py: 4, position: 'relative' }}>
            {/* Header */}
            <Fade in={true} timeout={800}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'start', sm: 'center' }, mb: 4, gap: 2 }}>
                    <Box>
                        <Typography variant="h4" fontWeight={800} color="primary.main" sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                            My Articles <AutoAwesomeIcon sx={{ color: 'secondary.main', fontSize: 24, opacity: 0.8 }} />
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {filter === 'archived' ? 'Viewing Archived Articles' : 'Manage your active content'}
                        </Typography>
                    </Box>
                    {filter !== 'archived' && (
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/dashboard/create')} sx={{ borderRadius: 2, px: 3, py: 1.2, fontWeight: 700, bgcolor: 'primary.main', background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)` }}>
                            Write New Article
                        </Button>
                    )}
                </Box>
            </Fade>

            {/* Filter Chips */}
            <Fade in={true} timeout={1000}>
                <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
                    {FILTER_CHIPS.map((chip) => (
                        <Chip
                            key={chip.value}
                            label={chip.label}
                            clickable
                            onClick={() => setFilter(chip.value)}
                            sx={{
                                borderRadius: 2, fontWeight: 600, fontSize: '0.9rem', px: 1,
                                transition: 'all 0.2s ease-in-out',
                                ...(filter === chip.value
                                    ? { bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', border: `1px solid ${theme.palette.primary.main}`, transform: 'scale(1.05)' }
                                    : { bgcolor: 'transparent', color: 'text.secondary', border: `1px solid ${theme.palette.divider}` }),
                            }}
                        />
                    ))}
                </Box>
            </Fade>

            {/* Table */}
            <Grow in={true} timeout={1200}>
                <Paper elevation={0} sx={{ width: '100%', overflow: 'hidden', borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: (t) => t.shadows[2] }}>
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                                    <TableCell sx={{ fontWeight: 700, color: 'primary.main', pl: 3, py: 2 }}>IMAGE</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: 'primary.main', py: 2 }}>DETAILS</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: 'primary.main', py: 2 }}>CATEGORY</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: 'primary.main', py: 2 }}>STATUS</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: 'primary.main', display: { xs: 'none', md: 'table-cell' }, py: 2 }}>CREATED</TableCell>
                                    {filter !== 'drafts' && (
                                        <TableCell sx={{ fontWeight: 700, color: 'primary.main', display: { xs: 'none', md: 'table-cell' }, py: 2, pl: 3 }}>
                                            {filter === 'published' ? 'PUBLISHED' : filter === 'archived' ? 'ARCHIVED DATE' : 'DATE'}
                                        </TableCell>
                                    )}
                                    <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main', pr: 3, py: 2 }}>ACTIONS</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton variant="rounded" width={48} height={48} /></TableCell>
                                            <TableCell><Skeleton width="60%" /><Skeleton width="40%" /></TableCell>
                                            <TableCell colSpan={4}><Skeleton width="100%" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredBlogs.length > 0 ? (
                                    filteredBlogs.map((blog) => (
                                        <BlogRow
                                            key={blog._id}
                                            blog={blog}
                                            filter={filter}
                                            theme={theme}
                                            onEdit={handleEdit}
                                            onDelete={handleDeleteClick}
                                            onArchive={handleDeleteClick}
                                            onRestore={handleRestore}
                                        />
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                                            <ArticleIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                                            <Typography variant="h6" color="text.secondary">
                                                {filter === 'archived' ? 'No archived articles' : 'No articles found'}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grow>

            <DeleteBlogModal open={Boolean(deleteId)} onClose={() => setDeleteId(null)} onConfirm={handleConfirmDelete} />
        </Container>
    );
};

export default MyBlogs;

// // import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
// // import {
// //     Box, Typography, Button, IconButton, Container, Paper,
// //     Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
// //     Chip, Avatar, Tooltip, Skeleton, Fade, Stack, Grow, useTheme, alpha
// // } from '@mui/material';
// // import AddIcon from '@mui/icons-material/Add';
// // import EditIcon from '@mui/icons-material/Edit';
// // import DeleteIcon from '@mui/icons-material/DeleteOutline';
// // import ArticleIcon from '@mui/icons-material/Article';
// // import CircleIcon from '@mui/icons-material/Circle';
// // import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
// // import { blogsApi } from '../../api/blogApi';
// // import { useAuth } from '../../context/AuthContext';
// // import { useNavigate } from 'react-router-dom';
// // import DeleteBlogModal from '../../components/admin/DeleteBlogModal';
// // import { useSnackbar } from '../../context/SnackbarContext';
// // /**
// //  * MyBlogs Component
// //  * Displays a paginated, filterable table of blog posts authored by the current user.
// //  * Supports CRUD operations via API calls and provides visual feedback via snackbar.
// //  */
// // const MyBlogs = () => {
// //     // ------------------------------ STATE ------------------------------
// //     const [blogs, setBlogs] = useState([]);          // Raw blog list from API
// //     const [archivedBlogs, setArchivedBlogs] = useState([]); // Archived blogs list
// //     const [loading, setLoading] = useState(true);    // Global loading flag
// //     const [filter, setFilter] = useState('all');     // Active filter key
// //     const [deleteId, setDeleteId] = useState(null);  // ID of blog queued for deletion
// //     // -------------------------- HOOKS / CONTEXT --------------------------
// //     const { user } = useAuth();                      // Authenticated user metadata
// //     const navigate = useNavigate();                  // Router navigation helper
// //     const { showSnackbar } = useSnackbar();          // Global toast notifications
// //     const theme = useTheme();                        // MUI theme for consistent styling
// //     // -------------------------- DATA FETCHING --------------------------
// //     /**
// //      * Fetch blogs authored by the current user.
// //      * Triggered on mount and when user object changes.
// //      */
// //     useEffect(() => {
// //         if (!user) return;
// //         let stale = false;
// //         (async () => {
// //             setLoading(true);
// //             try {
// //                 const [active, archived] = await Promise.all([
// //                     blogsApi.getByAuthor(user.username),
// //                     blogsApi.getArchived(),
// //                 ]);
// //                 if (!stale) {
// //                     setBlogs(active);
// //                     setArchivedBlogs(archived);
// //                 }
// //             } catch (err) {
// //                 if (!stale) showSnackbar('Failed to fetch blogs', 'error');
// //             } finally {
// //                 if (!stale) setLoading(false);
// //             }
// //         })();
// //         return () => (stale = true);
// //     }, [user, showSnackbar]);
// //     // -------------------------- EVENT HANDLERS --------------------------
// //     const handleEdit = useCallback((id) => navigate(`/dashboard/blog/edit/${id}`), [navigate]);
// //     const handleDeleteClick = useCallback((id) => setDeleteId(id), []);
// //     const permanentDelete = useCallback(async (id) => {
// //         try {
// //             await blogsApi.delete(id);
// //             setBlogs((prev) => prev.filter((b) => b._id !== id));
// //             showSnackbar('Blog post deleted successfully!', 'success');
// //         } catch (err) {
// //             showSnackbar('Failed to delete blog post.', 'error');
// //         }
// //     };

// //     const handleAddToArchive = async (id) => {
// //         try {
// //             const result= await blogsApi.addToArchive(id);
// //             setBlogs((prev) => prev.filter((b) => b._id !== id));
// //             showSnackbar('Blog post archived successfully!', 'success');
// //             getArchivedBlogs();
// //             return result;
// //         } catch (err) {
// //             showSnackbar('Failed to archive blog post.', 'error');
// //         }
// //     };



// //     /**
// //      * Confirm deletion via modal.
// //      * Optimistically removes blog from state and shows toast on success.
// //      */
// //     const handleConfirmDelete = async () => {
// //         try {
// //             if (!deleteId) return;
             
// //             if(filter != 'archived'){
// //               await handleAddToArchive(deleteId);
// //             }else{
// //                 await permanentDelete(deleteId);
// //             } 
// //             setDeleteId(null);
// //         } catch (err) { console.log(err);
// //             showSnackbar( err?.response?.data?.message ||'Failed to delete blog post.', 'error');
// //         }
// //     };
// //     // -------------------------- FILTERING LOGIC --------------------------
// //     /**
// //      * Memoized filter function to avoid re-computation on every render.
// //      * Returns filtered subset based on active filter key.
// //      */
// //     const getFilteredBlogs = () => {
// //         switch (filter) {
// //             case 'published': return blogs.filter((b) => b.status === 'published');
// //             case 'drafts': return blogs.filter((b) => b.status === 'draft');
// //             case 'scheduled': return blogs.filter((b) => b.status === 'scheduled');
// //             case 'archived':  return  archivedBlogs;
// //             default: return blogs;
// //         }
// //     };

// //     const getArchivedBlogs = async () => {
// //         try {
// //             const data = await blogsApi.getArchived();
// //             console.log(data);
// //             setArchivedBlogs(data);
// //         } catch (err) {
// //             console.error('Failed to fetch archived blogs', err);
// //             showSnackbar('Failed to fetch archived blogs', 'error');
// //         }
// //     };
// //     const filteredBlogs = getFilteredBlogs();
// //     // -------------------------- UI CONSTANTS --------------------------
// //     const FILTER_CHIPS = [
// //         { label: 'All', value: 'all' },
// //         { label: 'Published', value: 'published' },
// //         { label: 'Drafts', value: 'drafts' },
// //         { label: 'Scheduled', value: 'scheduled' },
// //         { label: 'Archived', value: 'archived' },
// //     ];
// //     /**
// //      * Derive consistent status styling (color, label, border) from theme.
// //      * @param {string} status - The status of the blog post
// //      * @returns {object} Style props for MUI Chip
// //      */
// //     const getStatusStyle = (status) => {
// //         switch (status) {
// //             case 'published':
// //                 return {
// //                     label: 'Published',
// //                     color: 'success.main',
// //                     bgcolor: alpha(theme.palette.success.main, 0.12),
// //                     border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
// //                 };
// //             case 'draft':
// //                 return {
// //                     label: 'Draft',
// //                     color: 'warning.main',
// //                     bgcolor: alpha(theme.palette.warning.main, 0.12),
// //                     border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
// //                 };
// //             case 'scheduled':
// //                 return {
// //                     label: 'Scheduled',
// //                     color: 'info.main',
// //                     bgcolor: alpha(theme.palette.info.main, 0.12),
// //                     border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
// //                 };
// //             case 'archived':
// //                 return {
// //                     label: 'Archived',
// //                     color: 'error.main',
// //                     bgcolor: alpha(theme.palette.error.main, 0.12),
// //                     border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
// //                 };
// //             default:
// //                 return {
// //                     label: 'Unknown',
// //                     color: theme.palette.text.secondary,
// //                     bgcolor: 'transparent',
// //                     border: `1px solid ${theme.palette.divider}`,
// //                 };
// //         }
// //     };

// //     // -------------------------- LOADING SKELETON --------------------------
// //     const TableRowSkeleton = () => (
// //         <TableRow>
// //             <TableCell><Skeleton variant="rounded" width={48} height={48} /></TableCell>
// //             <TableCell sx={{ width: '40%' }}>
// //                 <Skeleton variant="text" width="60%" height={28} />
// //                 <Skeleton variant="text" width="30%" height={20} />
// //             </TableCell>
// //             <TableCell><Skeleton width={80} height={32} sx={{ borderRadius: 4 }} /></TableCell>
// //             <TableCell><Skeleton width={70} height={32} sx={{ borderRadius: 4 }} /></TableCell>
// //             <TableCell><Skeleton width={90} /></TableCell>
// //             <TableCell align="right"><Skeleton width={80} /></TableCell>
// //         </TableRow>
// //     );

// //     // -------------------------- RENDER ------------------------------
// //     return (
// //         <Container maxWidth="xl" sx={{ py: 4, position:'relative' }}>
// //             {/* Header: Title + CTA */}
// //             <Fade in={true} timeout={800}>
// //                 <Box
// //                     sx={{
// //                         display: 'flex',
// //                         flexDirection: { xs: 'column', sm: 'row' },
// //                         justifyContent: 'space-between',
// //                         alignItems: { xs: 'start', sm: 'center' },
// //                         mb: 4,
// //                         gap: 2,
// //                     }}
// //                 >
// //                     <Box>
// //                         <Typography
// //                             variant="h4"
// //                             fontWeight={800}
// //                             color="primary.main"
// //                             sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}
// //                         >
// //                             My Articles <AutoAwesomeIcon sx={{ color: 'secondary.main', fontSize: 24, opacity: 0.8 }} />
// //                         </Typography>
// //                         <Typography variant="body1" color="text.secondary">
// //                             Manage your blog content and view performance.
// //                         </Typography>
// //                     </Box>

// //                     <Button
// //                         variant="contained"
// //                         startIcon={<AddIcon />}
// //                         onClick={() => navigate('/dashboard/create')}
// //                         sx={{
// //                             borderRadius: 2,
// //                             px: 3,
// //                             py: 1.2,
// //                             textTransform: 'none',
// //                             fontWeight: 700,
// //                             boxShadow: (t) => t.shadows[4],
// //                             bgcolor: 'primary.main',
// //                             background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
// //                             transition: 'all 0.3s ease',
// //                             '&:hover': {
// //                                 transform: 'translateY(-2px)',
// //                                 boxShadow: (t) => t.shadows[8],
// //                             },
// //                         }}
// //                     >
// //                         Write New Article
// //                     </Button>
// //                 </Box>
// //             </Fade>

// //             {/* Filter Chips */}
// //             <Fade in={true} timeout={1000}>
// //                 <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
// //                     {FILTER_CHIPS.map((chip) => (
// //                         <Chip
// //                             key={chip.value}
// //                             label={chip.label}
// //                             clickable
// //                             onClick={() => setFilter(chip.value)}
// //                             sx={{
// //                                 borderRadius: 2,
// //                                 fontWeight: 600,
// //                                 fontSize: '0.9rem',
// //                                 px: 1,
// //                                 transition: 'all 0.2s ease-in-out',
// //                                 ...(filter === chip.value
// //                                     ? {
// //                                         bgcolor: alpha(theme.palette.primary.main, 0.1),
// //                                         color: 'primary.main',
// //                                         border: `1px solid ${theme.palette.primary.main}`,
// //                                         transform: 'scale(1.05)',
// //                                     }
// //                                     : {
// //                                         bgcolor: 'transparent',
// //                                         color: 'text.secondary',
// //                                         border: `1px solid ${theme.palette.divider}`,
// //                                         '&:hover': {
// //                                             bgcolor: 'action.hover',
// //                                             borderColor: 'text.primary',
// //                                         },
// //                                     }),
// //                             }}
// //                         />
// //                     ))}
// //                 </Box>
// //             </Fade>

// //             {/* Table Container */}
// //             <Grow in={true} timeout={1200}>
// //                 <Paper
// //                     elevation={0}
// //                     sx={{
// //                         width: '100%',
// //                         overflow: 'hidden',
// //                         borderRadius: 4,
// //                         border: '1px solid',
// //                         borderColor: 'divider',
// //                         boxShadow: (t) => t.shadows[2],
// //                     }}
// //                 >
// //                     <TableContainer>
// //                         <Table sx={{ minWidth: 650 }} aria-label="blogs table">
// //                             <TableHead>
// //                                 <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
// //                                     <TableCell sx={{ fontWeight: 700, color: 'primary.main', pl: 3, py: 2 }}>IMAGE</TableCell>
// //                                     <TableCell sx={{ fontWeight: 700, color: 'primary.main', py: 2 }}>DETAILS</TableCell>
// //                                     <TableCell sx={{ fontWeight: 700, color: 'primary.main', py: 2 }}>CATEGORY</TableCell>
// //                                     <TableCell sx={{ fontWeight: 700, color: 'primary.main', py: 2 }}>STATUS</TableCell>

// //                                     <TableCell sx={{ fontWeight: 700, color: 'primary.main', display: { xs: 'none', md: 'table-cell' }, py: 2 }}> CREATED DATE</TableCell>
// //                                     {filter === 'drafts' ? null : (
// //                                         <TableCell sx={{ fontWeight: 700, color: 'primary.main', display: { xs: 'none', md: 'table-cell' }, py: 2,pl: 3 }}>
// //                                             {filter === 'published' ? 'PUBLISHED DATE' : filter === 'scheduled' ? 'SCHEDULED DATE' : 'SCHEDULED / PUBLISHED DATE'}
// //                                         </TableCell>
// //                                     )}
// //                                     <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main', pr: 3, py: 2 }}>ACTIONS</TableCell>
// //                                 </TableRow> 
// //                             </TableHead>

// //                             <TableBody>
// //                                 {loading ? (
// //                                     // Skeleton loader: 5 rows
// //                                     [...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)
// //                                 ) : filteredBlogs.length > 0 ? (
// //                                     filteredBlogs.map((blog) => {
// //                                         const statusStyle = getStatusStyle(blog.status);
// //                                         return (
// //                                             <TableRow
// //                                                 key={blog._id}
// //                                                 sx={{
// //                                                     '&:last-child td, &:last-child th': { border: 0 },
// //                                                     transition: 'all 0.2s ease',
// //                                                     cursor: 'default',
// //                                                     '&:hover': {
// //                                                         bgcolor: alpha(theme.palette.primary.main, 0.03),
// //                                                         '& .action-buttons': { opacity: 1 },
// //                                                     },
// //                                                 }}
// //                                             >
// //                                                 {/* Blog Thumbnail */}
// //                                                 <TableCell sx={{ pl: 3 }}>
// //                                                     <Avatar
// //                                                         variant="rounded"
// //                                                         src={blog.image}
// //                                                         alt={blog.title}
// //                                                         sx={{
// //                                                             width: 56,
// //                                                             height: 56,
// //                                                             borderRadius: 3,
// //                                                             border: `1px solid ${theme.palette.divider}`,
// //                                                             transition: 'transform 0.2s',
// //                                                             '&:hover': { transform: 'scale(1.1)' },
// //                                                         }}
// //                                                     />
// //                                                 </TableCell>

// //                                                 {/* Title & Read Time */}
// //                                                 <TableCell>
// //                                                     <Typography variant="subtitle2" fontWeight={700} color="text.primary" sx={{ fontSize: '0.95rem', mb: 0.5 }}>
// //                                                         {blog.title}
// //                                                     </Typography>
// //                                                     <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
// //                                                         {blog.readTime || '5 min read'}
// //                                                     </Typography>
// //                                                 </TableCell>

// //                                                 {/* Category Chip */}
// //                                                 <TableCell>
// //                                                     <Chip
// //                                                         label={blog.category}
// //                                                         size="small"
// //                                                         sx={{
// //                                                             borderRadius: 1.5,
// //                                                             bgcolor: 'action.hover',
// //                                                             fontWeight: 600,
// //                                                             color: 'text.secondary',
// //                                                             border: '1px solid transparent',
// //                                                         }}
// //                                                     />
// //                                                 </TableCell>

// //                                                 {/* Status Chip */}
// //                                                 <TableCell>
// //                                                     <Chip
// //                                                         icon={<CircleIcon sx={{ fontSize: '8px !important', color: `${statusStyle.color} !important`, ml: 0.5 }} />}
// //                                                         label={statusStyle.label}
// //                                                         size="medium"
// //                                                         sx={{
// //                                                             bgcolor: statusStyle.bgcolor,
// //                                                             color: statusStyle.color,
// //                                                             border: statusStyle.border,
// //                                                             fontWeight: 700,
// //                                                             borderRadius: 1.5,
// //                                                             px: 0.5,
// //                                                         }}
// //                                                     />
// //                                                 </TableCell>

// //                                                 {/* Creation Date (hidden on xs) */}
// //                                                 <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
// //                                                     <Chip
// //                                                         label={new Date(blog.createdAt).toLocaleDateString(undefined, {
// //                                                             month: 'short',
// //                                                             day: 'numeric',
// //                                                             year: 'numeric',
// //                                                             hour: '2-digit',
// //                                                             minute: '2-digit',
// //                                                         })}
// //                                                         size="large"
// //                                                         sx={{
// //                                                             borderRadius: 1.5,
// //                                                             bgcolor: alpha(theme.palette.primary.main, 0.08),
// //                                                             color: theme.palette.primary.dark,
// //                                                             fontWeight: 600,
// //                                                             border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
// //                                                         }}
// //                                                     />
// //                                                 </TableCell>

// //                                                 {/* Published Or Scheduled Date (hidden on xs) */}
// //                                                 {filter === 'drafts' ? null : (
// //                                                     <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
// //                                                         {blog.status === 'draft'? null :
// //                                                             blog.status === 'published'?
// //                                                         <Chip
// //                                                             label={  new Date(blog.publishedAt).toLocaleDateString(undefined, {
// //                                                                         month: 'short',
// //                                                                         day: 'numeric',
// //                                                                         year: 'numeric',
// //                                                                         hour: '2-digit',
// //                                                                         minute: '2-digit', 
// //                                                                     }) 
// //                                                             }
// //                                                             size="large"
// //                                                             sx={{
// //                                                                 borderRadius: 1.5,
// //                                                                 bgcolor: alpha(theme.palette.secondary.main, 0.12),
// //                                                                 color: theme.palette.secondary.dark,
// //                                                                 border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
// //                                                                 fontWeight: 600,
// //                                                             }}
// //                                                         />
// //                                                         :
// //                                                         <Chip
// //                                                             label={  new Date(blog.scheduledAt).toLocaleDateString(undefined, {
// //                                                                         month: 'short',
// //                                                                         day: 'numeric',
// //                                                                         year: 'numeric',
// //                                                                         hour: '2-digit',
// //                                                                         minute: '2-digit', 
// //                                                                     }) 
// //                                                             }
// //                                                             size="large"
// //                                                             sx={{
// //                                                                 borderRadius: 1.5,
// //                                                                 bgcolor: alpha(theme.palette.secondary.main, 0.12),
// //                                                                 color: theme.palette.secondary.dark,
// //                                                                 border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
// //                                                                 fontWeight: 600,
// //                                                             }}
// //                                                         />
// //                                     }
                                                        

// //                                                     </TableCell>
// //                                                 )}

// //                                                 {/* Action Buttons */}
// //                                                 <TableCell align="right" sx={{ pr: 3 }}>
// //                                                     <Stack
// //                                                         direction="row"
// //                                                         spacing={1}
// //                                                         justifyContent="flex-end"
// //                                                         className="action-buttons"
// //                                                         sx={{
// //                                                             opacity: { xs: 1, md: 0.6 },
// //                                                             transition: 'opacity 0.2s',
// //                                                         }}
// //                                                     >
// //                                                         <Tooltip title="Edit Article" arrow>
// //                                                             <IconButton
// //                                                                 onClick={() => handleEdit(blog._id)}
// //                                                                 size="large"
// //                                                                 sx={{
// //                                                                     color: 'text.secondary',
// //                                                                     border: `1px solid ${theme.palette.divider}`,
// //                                                                     '&:hover': {
// //                                                                         color: 'primary.main',
// //                                                                         borderColor: 'primary.main',
// //                                                                         bgcolor: alpha(theme.palette.primary.main, 0.1),
// //                                                                     },
// //                                                                 }}
// //                                                             >
// //                                                                 <EditIcon fontSize="small" />
// //                                                             </IconButton>
// //                                                         </Tooltip>
// //                                                         <Tooltip title="Delete Article" arrow>
// //                                                             <IconButton
// //                                                                 onClick={() => handleDeleteClick(blog._id)}
// //                                                                 size="large"
// //                                                                 sx={{
// //                                                                     color: 'text.secondary',
// //                                                                     border: `1px solid ${theme.palette.divider}`,
// //                                                                     transition: 'all 0.2s ease-in-out',
// //                                                                     '&:hover': {
// //                                                                         color: '#fff',
// //                                                                         borderColor: theme.palette.error.main,
// //                                                                         bgcolor: theme.palette.error.main,
// //                                                                         transform: 'scale(1.05)',
// //                                                                     },
// //                                                                 }}
// //                                                             >
// //                                                                 <DeleteIcon fontSize="small" />
// //                                                             </IconButton>
// //                                                         </Tooltip>
// //                                                     </Stack>
// //                                                 </TableCell>
// //                                             </TableRow>
// //                                         );
// //                                     })
// //                                 ) : (
// //                                     // Empty state
// //                                     <TableRow>
// //                                         <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
// //                                             <ArticleIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
// //                                             <Typography variant="h6" color="text.secondary">
// //                                                 No articles found
// //                                             </Typography>
// //                                             <Typography variant="body2" color="text.secondary">
// //                                                 Try adjusting your filter or create a new article.
// //                                             </Typography>
// //                                         </TableCell>
// //                                     </TableRow>
// //                                 )}
// //                             </TableBody>
// //                         </Table>
// //                     </TableContainer>
// //                 </Paper>
// //             </Grow>

// //             {/* Delete Confirmation Modal */}
// //             <DeleteBlogModal
// //                 open={Boolean(deleteId)}
// //                 onClose={() => setDeleteId(null)}
// //                 onConfirm={handleConfirmDelete} 
// //             />
// //         </Container>
// //     );
// // };

// // export default MyBlogs;
 
// import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
// import {
//     Box, Typography, Button, IconButton, Container, Paper,
//     Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//     Chip, Avatar, Tooltip, Skeleton, Fade, Stack, Grow, useTheme, alpha
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/DeleteOutline';
// import ArticleIcon from '@mui/icons-material/Article';
// import CircleIcon from '@mui/icons-material/Circle';
// import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
// import { blogsApi } from '../../api/blogApi';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import DeleteBlogModal from '../../components/admin/DeleteBlogModal';
// import { useSnackbar } from '../../context/SnackbarContext';

// /**
//  * MyBlogs Component
//  * Displays a paginated, filterable table of blog posts authored by the current user.
//  * Supports CRUD operations via API calls and provides visual feedback via snackbar.
//  */
// const MyBlogs = () => {
//     // ------------------------------ STATE ------------------------------
//     const [blogs, setBlogs] = useState([]);          // Raw blog list from API
//     const [archivedBlogs, setArchivedBlogs] = useState([]); // Archived blogs list
//     const [loading, setLoading] = useState(true);    // Global loading flag
//     const [filter, setFilter] = useState('all');     // Active filter key
//     const [deleteId, setDeleteId] = useState(null);  // ID of blog queued for deletion

//     // -------------------------- HOOKS / CONTEXT --------------------------
//     const { user } = useAuth();                      // Authenticated user metadata
//     const navigate = useNavigate();                  // Router navigation helper
//     const { showSnackbar } = useSnackbar();          // Global toast notifications
//     const theme = useTheme();                        // MUI theme for consistent styling

//     // -------------------------- DATA FETCHING --------------------------
//     /**
//      * Fetch blogs authored by the current user.
//      * Triggered on mount and when user object changes.
//      */
//     useEffect(() => {
//         if (!user) return;
//         let stale = false;
//         (async () => {
//             setLoading(true);
//             try {
//                 const [active, archived] = await Promise.all([
//                     blogsApi.getByAuthor(user.username),
//                     blogsApi.getArchived(),
//                 ]);
//                 if (!stale) {
//                     setBlogs(active);
//                     setArchivedBlogs(archived);
//                 }
//             } catch (err) {
//                 if (!stale) showSnackbar('Failed to fetch blogs', 'error');
//             } finally {
//                 if (!stale) setLoading(false);
//             }
//         })();
//         return () => (stale = true);
//     }, [user, showSnackbar]);

//     // -------------------------- EVENT HANDLERS --------------------------
//     const handleEdit = useCallback((id) => navigate(`/dashboard/blog/edit/${id}`), [navigate]);

//     const handleDeleteClick = useCallback((id) => setDeleteId(id), []);

//     const permanentDelete = useCallback(async (id) => {
//         try {
//             await blogsApi.delete(id);
//             setBlogs((prev) => prev.filter((b) => b._id !== id));
//             setArchivedBlogs((prev) => prev.filter((b) => b._id !== id));
//             showSnackbar('Blog post deleted successfully!', 'success');
//         } catch {
//             showSnackbar('Failed to delete blog post.', 'error');
//         }
//     }, [showSnackbar]);

//     const handleAddToArchive = useCallback(async (id) => {
//         try {
//             await blogsApi.addToArchive(id);
//             setBlogs((prev) => prev.filter((b) => b._id !== id));
//             setArchivedBlogs((prev) => [...prev, blogs.find((b) => b._id === id)].filter(Boolean));
//             showSnackbar('Blog post archived successfully!', 'success');
//         } catch {
//             showSnackbar('Failed to archive blog post.', 'error');
//         }
//     }, [blogs, showSnackbar]);

//     /**
//      * Confirm deletion via modal.
//      * Archives non-archived items; permanently deletes archived ones.
//      */
//     const handleConfirmDelete = useCallback(async () => {
//         if (!deleteId) return;
//         try {
//             filter === 'archived' ? await permanentDelete(deleteId) : await handleAddToArchive(deleteId);
//         } catch (err) {
//             showSnackbar(err?.response?.data?.message || 'Failed to delete blog post.', 'error');
//         } finally {
//             setDeleteId(null);
//         }
//     }, [deleteId, filter, permanentDelete, handleAddToArchive, showSnackbar]);

//     // -------------------------- FILTERING LOGIC --------------------------
//     /**
//      * Memoized filtered blogs list
//      */
//     const filteredBlogs = useMemo(() => {
//         switch (filter) {
//             case 'published': return blogs.filter((b) => b.status === 'published');
//             case 'drafts': return blogs.filter((b) => b.status === 'draft');
//             case 'scheduled': return blogs.filter((b) => b.status === 'scheduled');
//             case 'archived': return archivedBlogs;
//             default: return blogs;
//         }
//     }, [blogs, archivedBlogs, filter]);

//     // -------------------------- UI CONSTANTS --------------------------
//     const FILTER_CHIPS = useMemo(
//         () => [
//             { label: 'All', value: 'all' },
//             { label: 'Published', value: 'published' },
//             { label: 'Drafts', value: 'drafts' },
//             { label: 'Scheduled', value: 'scheduled' },
//             { label: 'Archived', value: 'archived' },
//         ],
//         []
//     );

//     /**
//      * Derive consistent status styling (color, label, border) from theme.
//      * @param {string} status - The status of the blog post
//      * @returns {object} Style props for MUI Chip
//      */
//     const getStatusStyle = useCallback(
//         (status) => {
//             const map = {
//                 published: {
//                     label: 'Published',
//                     color: 'success.main',
//                     bgcolor: alpha(theme.palette.success.main, 0.12),
//                     border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
//                 },
//                 draft: {
//                     label: 'Draft',
//                     color: 'warning.main',
//                     bgcolor: alpha(theme.palette.warning.main, 0.12),
//                     border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
//                 },
//                 scheduled: {
//                     label: 'Scheduled',
//                     color: 'info.main',
//                     bgcolor: alpha(theme.palette.info.main, 0.12),
//                     border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
//                 },
//                 archived: {
//                     label: 'Archived',
//                     color: 'error.main',
//                     bgcolor: alpha(theme.palette.error.main, 0.12),
//                     border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
//                 },
//             };
//             return (
//                 map[status] || {
//                     label: 'Unknown',
//                     color: theme.palette.text.secondary,
//                     bgcolor: 'transparent',
//                     border: `1px solid ${theme.palette.divider}`,
//                 }
//             );
//         },
//         [theme]
//     );

//     // -------------------------- LOADING SKELETON --------------------------
//     const TableRowSkeleton = useMemo(
//         () => (
//             <TableRow>
//                 <TableCell><Skeleton variant="rounded" width={48} height={48} /></TableCell>
//                 <TableCell sx={{ width: '40%' }}>
//                     <Skeleton variant="text" width="60%" height={28} />
//                     <Skeleton variant="text" width="30%" height={20} />
//                 </TableCell>
//                 <TableCell><Skeleton width={80} height={32} sx={{ borderRadius: 4 }} /></TableCell>
//                 <TableCell><Skeleton width={70} height={32} sx={{ borderRadius: 4 }} /></TableCell>
//                 <TableCell><Skeleton width={90} /></TableCell>
//                 <TableCell align="right"><Skeleton width={80} /></TableCell>
//             </TableRow>
//         ),
//         []
//     );

//     // -------------------------- RENDER ------------------------------
//     return (
//         <Container maxWidth="xl" sx={{ py: 4, position:'relative' }}>
//             {/* Header: Title + CTA */}
//             <Fade in={true} timeout={800}>
//                 <Box
//                     sx={{
//                         display: 'flex',
//                         flexDirection: { xs: 'column', sm: 'row' },
//                         justifyContent: 'space-between',
//                         alignItems: { xs: 'start', sm: 'center' },
//                         mb: 4,
//                         gap: 2,
//                     }}
//                 >
//                     <Box>
//                         <Typography
//                             variant="h4"
//                             fontWeight={800}
//                             color="primary.main"
//                             sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}
//                         >
//                             My Articles <AutoAwesomeIcon sx={{ color: 'secondary.main', fontSize: 24, opacity: 0.8 }} />
//                         </Typography>
//                         <Typography variant="body1" color="text.secondary">
//                             Manage your blog content and view performance.
//                         </Typography>
//                     </Box>

//                     <Button
//                         variant="contained"
//                         startIcon={<AddIcon />}
//                         onClick={() => navigate('/dashboard/create')}
//                         sx={{
//                             borderRadius: 2,
//                             px: 3,
//                             py: 1.2,
//                             textTransform: 'none',
//                             fontWeight: 700,
//                             boxShadow: (t) => t.shadows[4],
//                             bgcolor: 'primary.main',
//                             background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
//                             transition: 'all 0.3s ease',
//                             '&:hover': {
//                                 transform: 'translateY(-2px)',
//                                 boxShadow: (t) => t.shadows[8],
//                             },
//                         }}
//                     >
//                         Write New Article
//                     </Button>
//                 </Box>
//             </Fade>

//             {/* Filter Chips */}
//             <Fade in={true} timeout={1000}>
//                 <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
//                     {FILTER_CHIPS.map((chip) => (
//                         <Chip
//                             key={chip.value}
//                             label={chip.label}
//                             clickable
//                             onClick={() => setFilter(chip.value)}
//                             sx={{
//                                 borderRadius: 2,
//                                 fontWeight: 600,
//                                 fontSize: '0.9rem',
//                                 px: 1,
//                                 transition: 'all 0.2s ease-in-out',
//                                 ...(filter === chip.value
//                                     ? {
//                                         bgcolor: alpha(theme.palette.primary.main, 0.1),
//                                         color: 'primary.main',
//                                         border: `1px solid ${theme.palette.primary.main}`,
//                                         transform: 'scale(1.05)',
//                                     }
//                                     : {
//                                         bgcolor: 'transparent',
//                                         color: 'text.secondary',
//                                         border: `1px solid ${theme.palette.divider}`,
//                                         '&:hover': {
//                                             bgcolor: 'action.hover',
//                                             borderColor: 'text.primary',
//                                         },
//                                     }),
//                             }}
//                         />
//                     ))}
//                 </Box>
//             </Fade>

//             {/* Table Container */}
//             <Grow in={true} timeout={1200}>
//                 <Paper
//                     elevation={0}
//                     sx={{
//                         width: '100%',
//                         overflow: 'hidden',
//                         borderRadius: 4,
//                         border: '1px solid',
//                         borderColor: 'divider',
//                         boxShadow: (t) => t.shadows[2],
//                     }}
//                 >
//                     <TableContainer>
//                         <Table sx={{ minWidth: 650 }} aria-label="blogs table">
//                             <TableHead>
//                                 <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
//                                     <TableCell sx={{ fontWeight: 700, color: 'primary.main', pl: 3, py: 2 }}>IMAGE</TableCell>
//                                     <TableCell sx={{ fontWeight: 700, color: 'primary.main', py: 2 }}>DETAILS</TableCell>
//                                     <TableCell sx={{ fontWeight: 700, color: 'primary.main', py: 2 }}>CATEGORY</TableCell>
//                                     <TableCell sx={{ fontWeight: 700, color: 'primary.main', py: 2 }}>STATUS</TableCell>

//                                     <TableCell sx={{ fontWeight: 700, color: 'primary.main', display: { xs: 'none', md: 'table-cell' }, py: 2 }}> CREATED DATE</TableCell>
//                                     {filter === 'drafts' ? null : (
//                                         <TableCell sx={{ fontWeight: 700, color: 'primary.main', display: { xs: 'none', md: 'table-cell' }, py: 2,pl: 3 }}>
//                                             {filter === 'published' ? 'PUBLISHED DATE' : filter === 'scheduled' ? 'SCHEDULED DATE' : 'SCHEDULED / PUBLISHED DATE'}
//                                         </TableCell>
//                                     )}
//                                     <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main', pr: 3, py: 2 }}>ACTIONS</TableCell>
//                                 </TableRow> 
//                             </TableHead>

//                             <TableBody>
//                                 {loading ? (
//                                     // Skeleton loader: 5 rows
//                                     [...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)
//                                 ) : filteredBlogs.length > 0 ? (
//                                     filteredBlogs.map((blog) => {
//                                         const statusStyle = getStatusStyle(blog.status);
//                                         return (
//                                             <TableRow
//                                                 key={blog._id}
//                                                 sx={{
//                                                     '&:last-child td, &:last-child th': { border: 0 },
//                                                     transition: 'all 0.2s ease',
//                                                     cursor: 'default',
//                                                     '&:hover': {
//                                                         bgcolor: alpha(theme.palette.primary.main, 0.03),
//                                                         '& .action-buttons': { opacity: 1 },
//                                                     },
//                                                 }}
//                                             >
//                                                 {/* Blog Thumbnail */}
//                                                 <TableCell sx={{ pl: 3 }}>
//                                                     <Avatar
//                                                         variant="rounded"
//                                                         src={blog.image}
//                                                         alt={blog.title}
//                                                         sx={{
//                                                             width: 56,
//                                                             height: 56,
//                                                             borderRadius: 3,
//                                                             border: `1px solid ${theme.palette.divider}`,
//                                                             transition: 'transform 0.2s',
//                                                             '&:hover': { transform: 'scale(1.1)' },
//                                                         }}
//                                                     />
//                                                 </TableCell>

//                                                 {/* Title & Read Time */}
//                                                 <TableCell>
//                                                     <Typography variant="subtitle2" fontWeight={700} color="text.primary" sx={{ fontSize: '0.95rem', mb: 0.5 }}>
//                                                         {blog.title}
//                                                     </Typography>
//                                                     <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                                                         {blog.readTime || '5 min read'}
//                                                     </Typography>
//                                                 </TableCell>

//                                                 {/* Category Chip */}
//                                                 <TableCell>
//                                                     <Chip
//                                                         label={blog.category}
//                                                         size="small"
//                                                         sx={{
//                                                             borderRadius: 1.5,
//                                                             bgcolor: 'action.hover',
//                                                             fontWeight: 600,
//                                                             color: 'text.secondary',
//                                                             border: '1px solid transparent',
//                                                         }}
//                                                     />
//                                                 </TableCell>

//                                                 {/* Status Chip */}
//                                                 <TableCell>
//                                                     <Chip
//                                                         icon={<CircleIcon sx={{ fontSize: '8px !important', color: `${statusStyle.color} !important`, ml: 0.5 }} />}
//                                                         label={statusStyle.label}
//                                                         size="medium"
//                                                         sx={{
//                                                             bgcolor: statusStyle.bgcolor,
//                                                             color: statusStyle.color,
//                                                             border: statusStyle.border,
//                                                             fontWeight: 700,
//                                                             borderRadius: 1.5,
//                                                             px: 0.5,
//                                                         }}
//                                                     />
//                                                 </TableCell>

//                                                 {/* Creation Date (hidden on xs) */}
//                                                 <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
//                                                     <Chip
//                                                         label={new Date(blog.createdAt).toLocaleDateString(undefined, {
//                                                             month: 'short',
//                                                             day: 'numeric',
//                                                             year: 'numeric',
//                                                             hour: '2-digit',
//                                                             minute: '2-digit',
//                                                         })}
//                                                         size="large"
//                                                         sx={{
//                                                             borderRadius: 1.5,
//                                                             bgcolor: alpha(theme.palette.primary.main, 0.08),
//                                                             color: theme.palette.primary.dark,
//                                                             fontWeight: 600,
//                                                             border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
//                                                         }}
//                                                     />
//                                                 </TableCell>

//                                                 {/* Published Or Scheduled Date (hidden on xs) */}
//                                                 {filter === 'drafts' ? null : (
//                                                     <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
//                                                         {blog.status === 'draft'? null :
//                                                             blog.status === 'published'?
//                                                         <Chip
//                                                             label={  new Date(blog.publishedAt).toLocaleDateString(undefined, {
//                                                                         month: 'short',
//                                                                         day: 'numeric',
//                                                                         year: 'numeric',
//                                                                         hour: '2-digit',
//                                                                         minute: '2-digit', 
//                                                                     }) 
//                                                             }
//                                                             size="large"
//                                                             sx={{
//                                                                 borderRadius: 1.5,
//                                                                 bgcolor: alpha(theme.palette.secondary.main, 0.12),
//                                                                 color: theme.palette.secondary.dark,
//                                                                 border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
//                                                                 fontWeight: 600,
//                                                             }}
//                                                         />
//                                                         :
//                                                         <Chip
//                                                             label={  new Date(blog.scheduledAt).toLocaleDateString(undefined, {
//                                                                         month: 'short',
//                                                                         day: 'numeric',
//                                                                         year: 'numeric',
//                                                                         hour: '2-digit',
//                                                                         minute: '2-digit', 
//                                                                     }) 
//                                                             }
//                                                             size="large"
//                                                             sx={{
//                                                                 borderRadius: 1.5,
//                                                                 bgcolor: alpha(theme.palette.secondary.main, 0.12),
//                                                                 color: theme.palette.secondary.dark,
//                                                                 border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
//                                                                 fontWeight: 600,
//                                                             }}
//                                                         />
//                                     }
                                                        

//                                                     </TableCell>
//                                                 )}

//                                                 {/* Action Buttons */}
//                                                 <TableCell align="right" sx={{ pr: 3 }}>
//                                                     <Stack
//                                                         direction="row"
//                                                         spacing={1}
//                                                         justifyContent="flex-end"
//                                                         className="action-buttons"
//                                                         sx={{
//                                                             opacity: { xs: 1, md: 0.6 },
//                                                             transition: 'opacity 0.2s',
//                                                         }}
//                                                     >
//                                                         <Tooltip title="Edit Article" arrow>
//                                                             <IconButton
//                                                                 onClick={() => handleEdit(blog._id)}
//                                                                 size="large"
//                                                                 sx={{
//                                                                     color: 'text.secondary',
//                                                                     border: `1px solid ${theme.palette.divider}`,
//                                                                     '&:hover': {
//                                                                         color: 'primary.main',
//                                                                         borderColor: 'primary.main',
//                                                                         bgcolor: alpha(theme.palette.primary.main, 0.1),
//                                                                     },
//                                                                 }}
//                                                             >
//                                                                 <EditIcon fontSize="small" />
//                                                             </IconButton>
//                                                         </Tooltip>
//                                                         <Tooltip title="Delete Article" arrow>
//                                                             <IconButton
//                                                                 onClick={() => handleDeleteClick(blog._id)}
//                                                                 size="large"
//                                                                 sx={{
//                                                                     color: 'text.secondary',
//                                                                     border: `1px solid ${theme.palette.divider}`,
//                                                                     transition: 'all 0.2s ease-in-out',
//                                                                     '&:hover': {
//                                                                         color: '#fff',
//                                                                         borderColor: theme.palette.error.main,
//                                                                         bgcolor: theme.palette.error.main,
//                                                                         transform: 'scale(1.05)',
//                                                                     },
//                                                                 }}
//                                                             >
//                                                                 <DeleteIcon fontSize="small" />
//                                                             </IconButton>
//                                                         </Tooltip>
//                                                     </Stack>
//                                                 </TableCell>
//                                             </TableRow>
//                                         );
//                                     })
//                                 ) : (
//                                     // Empty state
//                                     <TableRow>
//                                         <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
//                                             <ArticleIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
//                                             <Typography variant="h6" color="text.secondary">
//                                                 No articles found
//                                             </Typography>
//                                             <Typography variant="body2" color="text.secondary">
//                                                 Try adjusting your filter or create a new article.
//                                             </Typography>
//                                         </TableCell>
//                                     </TableRow>
//                                 )}
//                             </TableBody>
//                         </Table>
//                     </TableContainer>
//                 </Paper>
//             </Grow>

//             {/* Delete Confirmation Modal */}
//             <DeleteBlogModal
//                 open={Boolean(deleteId)}
//                 onClose={() => setDeleteId(null)}
//                 onConfirm={handleConfirmDelete} 
//             />
//         </Container>
//     );
// };

// export default MyBlogs;