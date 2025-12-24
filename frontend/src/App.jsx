import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Blogs from './pages/Blogs';
import SingleBlog from './pages/SingleBlog';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

// Admin/Dashboard Pages
import DashboardHome from './pages/admin/DashboardHome';
import MyBlogs from './pages/admin/MyBlogs';
import EditBlog from './pages/admin/EditBlog';
import CreateBlog from './pages/admin/CreateBlog';
import ProfilePage from './pages/admin/ProfilePage';

import './App.css';
import MyDrafts from './pages/admin/MyDrafts';
import { CssBaseline, ThemeProvider } from '@mui/material';
import {theme} from './theme/MUI-theme';
import { SnackbarProvider } from './context/SnackbarContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline normalizes styles and applies the background color */}
      <CssBaseline />
      <SnackbarProvider> 
        <Router>
      <AuthProvider>
        <Routes>
          
          {/* =========================================
              SECTION 1: PUBLIC ROUTES (Main Site)
              Wraps everything in Navbar via MainLayout
             ========================================= */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<SingleBlog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>


          {/* =========================================
              SECTION 2: ADMIN DASHBOARD ROUTES
              Protected -> Dashboard Layout (Sidebar)
             ========================================= */}
          <Route path="/dashboard" element={<ProtectedRoute />}>
             <Route element={<DashboardLayout />}>
                
                {/* http://localhost:3000/dashboard */}
                <Route index element={<DashboardHome />} />
                
                {/* http://localhost:3000/dashboard/my-blogs */}
                <Route path="my-blogs" element={<MyBlogs />} />
                
                {/* http://localhost:3000/dashboard/my-drafts */}
                {/* <Route path="my-drafts" element={<MyDrafts />} /> */}
                
                {/* http://localhost:3000/dashboard/create */}
                <Route path="create" element={<CreateBlog />} />
                
                {/* http://localhost:3000/dashboard/edit/123 */}
                <Route path="blog/edit/:id" element={<EditBlog />} />
                
                {/* http://localhost:3000/dashboard/profile */}
                <Route path="profile" element={<ProfilePage />} />

             </Route>
          </Route>

        </Routes>
      </AuthProvider>
    </Router>
    </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;