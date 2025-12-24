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
import { CssBaseline } from '@mui/material';
import { SnackbarProvider } from './context/SnackbarContext';

// --- NEW IMPORT ---
import { ColorModeProvider } from './context/ColorModeContext';

function App() {
  return (
    // 1. Wrap everything in the ColorModeProvider
    <ColorModeProvider>
      <CssBaseline />
      <SnackbarProvider> 
        <Router>
          <AuthProvider>
            <Routes>
              
              {/* SECTION 1: PUBLIC ROUTES */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blogs/:id" element={<SingleBlog />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
              </Route>

              {/* SECTION 2: ADMIN DASHBOARD ROUTES */}
              <Route path="/dashboard" element={<ProtectedRoute />}>
                 <Route element={<DashboardLayout />}>
                    <Route index element={<DashboardHome />} />
                    <Route path="my-blogs" element={<MyBlogs />} />
                    <Route path="create" element={<CreateBlog />} />
                    <Route path="blog/edit/:id" element={<EditBlog />} />
                    <Route path="profile" element={<ProfilePage />} />
                 </Route>
              </Route>

            </Routes>
          </AuthProvider>
        </Router>
      </SnackbarProvider>
    </ColorModeProvider>
  );
}

export default App;