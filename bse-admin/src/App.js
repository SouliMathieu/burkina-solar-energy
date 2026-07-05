import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Login        from './pages/Login';
import Dashboard    from './pages/Dashboard';
import Categories   from './pages/Categories';
import Products     from './pages/Products';
import Projects     from './pages/Projects';
import Messages     from './pages/Messages';
import SiteContent  from './pages/SiteContent';
import MonCompte    from './pages/MonCompte';

// Layout
import AdminLayout  from './components/layout/AdminLayout';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { fontFamily: 'Poppins, sans-serif', fontSize: '14px' },
            success: { iconTheme: { primary: '#2E7D32', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#e53e3e', secondary: '#fff' } },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard"    element={<Dashboard />} />
            <Route path="categories"   element={<Categories />} />
            <Route path="products"     element={<Products />} />
            <Route path="projects"     element={<Projects />} />
            <Route path="messages"     element={<Messages />} />
            <Route path="site-content" element={<SiteContent />} />
            <Route path="mon-compte"   element={<MonCompte />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;