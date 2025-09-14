import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const AdminProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const adminEmail = localStorage.getItem('adminEmail');
    const loginTime = localStorage.getItem('adminLoginTime');
    const ADMIN_EMAIL = 'suman_saurabh@srmap.edu.in';
    
    // Check if admin session exists and is valid (within 24 hours)
    if (!isAdmin || adminEmail !== ADMIN_EMAIL || !loginTime) {
      navigate('/admin/login');
      return;
    }

    // Check session expiry (24 hours)
    const loginDate = new Date(loginTime);
    const now = new Date();
    const hoursDiff = (now - loginDate) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
      // Session expired
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminEmail');
      localStorage.removeItem('adminLoginTime');
      navigate('/admin/login');
      return;
    }
  }, [navigate]);

  // Check authentication status
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const adminEmail = localStorage.getItem('adminEmail');
  const ADMIN_EMAIL = 'suman_saurabh@srmap.edu.in';
  
  if (!isAdmin || adminEmail !== ADMIN_EMAIL) {
    return null; // Don't show anything, just redirect
  }

  return children;
};

AdminProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminProtectedRoute;
