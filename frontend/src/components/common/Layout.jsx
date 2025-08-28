import React from 'react';
import { Box, AppBar, Toolbar, Typography, Avatar, Menu, MenuItem } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return '#1976d2'; // Blue
      case 'LECTURER':
        return '#2e7d32'; // Green
      case 'STUDENT':
        return '#ed6c02'; // Orange
      default:
        return '#1976d2';
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ bgcolor: getRoleColor(user?.role) }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Course Management System - {user?.role?.toLowerCase()}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              Welcome, {user?.firstName || user?.name || user?.email}
            </Typography>
            
            <Avatar
              sx={{ cursor: 'pointer', bgcolor: 'rgba(255,255,255,0.2)' }}
              onClick={handleMenu}
            >
              {(user?.firstName || user?.name || user?.email)?.charAt(0)?.toUpperCase()}
            </Avatar>
            
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>Settings</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ flexGrow: 1, p: 3, bgcolor: '#f5f5f5' }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
