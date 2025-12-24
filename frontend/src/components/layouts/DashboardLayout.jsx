import React from 'react'

const DashboardLayout = () => {
  return ( 
      <Router> 
        <AuthProvider>
           
          <Sidebar />

        <Routes> 
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/create" element={<CreateBlog />} />
          </Route>

        </Routes>

      </AuthProvider>
    </Router>
  )
}

export default DashboardLayout