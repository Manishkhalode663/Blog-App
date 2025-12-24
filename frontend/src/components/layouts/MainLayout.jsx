import React from 'react';
import { Outlet } from 'react-router-dom'; 
import Navbar from '../Navbar'; // Adjust path if needed (e.g., ../components/Navbar)

const MainLayout = () => {
  return (
    <>
      {/* 1. The Navbar stays here for all public pages */}
      <Navbar />

      {/* 2. <Outlet /> renders the child route (Home, About, etc.) */}
          <Outlet />
      

      {/* Optional: <Footer /> */}
    </>
  );
};

export default MainLayout;