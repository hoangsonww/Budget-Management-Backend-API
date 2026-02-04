import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Typography, TextField, IconButton, Paper, Grid, Divider, Chip } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import LoadingOverlay from '../components/LoadingOverlay';
import api from '../services/api';
import { Link } from 'react-router-dom';

const avatarImages = [
  '/OIP.jpg',
  '/OIP2.webp',
  '/OIP3.png',
  '/OIP4.png',
  '/OIP5.png',
  '/OIP6.webp',
  '/OIP7.webp',
  '/OIP8.webp',
  '/OIP9.webp',
  '/OIP10.webp',
  '/OIP11.webp',
  '/OIP12.webp',
  '/OIP13.webp',
  '/OIP14.webp',
  '/OIP15.webp',
  '/OIP16.webp',
  '/OIP17.webp',
  '/OIP18.webp',
  '/OIP19.webp',
  '/OIP20.webp',
];

function Profile() {
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [daysSinceJoined, setDaysSinceJoined] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [joinedDate, setJoinedDate] = useState('');
  const [error, setError] = useState('');
  const [randomAvatar, setRandomAvatar] = useState('');
  const [userData, setUserData] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchUser, setSearchUser] = useState(null);

  const userToken = localStorage.getItem('token');

  const fetchAllUsers = useCallback(async () => {
    try {
      const res = await api.get('/api/users');
      setAllUsers(res.data || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      if (!userToken) {
        setLoading(false);
        return;
      }
      const res = await api.get('/api/users/profile');
      const user = res.data;
      setUserData(user);

      if (user && user.createdAt) {
        const joined = new Date(user.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - joined);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        setDaysSinceJoined(diffDays);
        setJoinedDate(joined.toLocaleDateString());
      } else {
        setDaysSinceJoined('N/A');
        setJoinedDate('N/A');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userToken]);

  useEffect(() => {
    setRandomAvatar(avatarImages[Math.floor(Math.random() * avatarImages.length)]);
    fetchProfile();
    fetchAllUsers();
  }, [fetchProfile, fetchAllUsers]);

  const handleUpdateEmail = async () => {
    setUpdatingEmail(true);
    setError('');
    try {
      await api.put('/api/users/profile', { email: newEmail });
      setUserData(prev => (prev ? { ...prev, email: newEmail } : prev));
      setIsEditingEmail(false);
    } catch (err) {
      setError('Failed to update email. Please try again.');
    } finally {
      setUpdatingEmail(false);
    }
  };

  const handleSearch = useCallback(
    term => {
      if (!term) {
        setSearchUser(null);
        return;
      }
      const lowerTerm = term.toLowerCase();
      const matched = allUsers.find(
        u => (u.username && u.username.toLowerCase().includes(lowerTerm)) || (u.email && u.email.toLowerCase().includes(lowerTerm))
      );
      setSearchUser(matched || null);
    },
    [allUsers]
  );

  const onSearchChange = e => {
    const val = e.target.value;
    setSearchTerm(val);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, handleSearch]);

  if (loading) return <LoadingOverlay loading={true} />;

  if (!userToken) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4} height="100vh">
        <Typography variant="h5">
          You are not signed in. Please{' '}
          <Link to="/login" style={{ textDecoration: 'underline' }}>
            log in
          </Link>{' '}
          to view your profile.
        </Typography>
      </Box>
    );
  }

  const displayUser = searchUser ? searchUser : userData;
  const displayEmail = displayUser && displayUser.email ? displayUser.email : 'N/A';

  let displayDaysSinceJoined = daysSinceJoined;
  let displayJoinedDate = joinedDate;

  const isSearchedUser = !!searchUser && searchUser._id !== userData?._id;
  if (isSearchedUser) {
    displayDaysSinceJoined = 'N/A';
    displayJoinedDate = 'N/A';
  }

  const today = new Date().toLocaleDateString();

  return (
    <Box sx={{ py: { xs: 4, md: 7 } }}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Box
              sx={{
                width: 140,
                height: 140,
                borderRadius: '50%',
                overflow: 'hidden',
                mx: 'auto',
                mb: 2,
                border: '3px solid',
                borderColor: 'primary.main',
              }}
            >
              <img src={randomAvatar} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
              {displayEmail !== 'N/A' ? `Welcome, ${displayEmail.split('@')[0]}` : 'Welcome'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isSearchedUser ? 'Viewing search results' : 'Account overview'}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <StackedMeta label="Member since" value={displayJoinedDate} />
            <StackedMeta label="Days active" value={displayDaysSinceJoined} />
            <StackedMeta label="Today" value={today} />
            {!isSearchedUser && (
              <Button
                variant="outlined"
                color="primary"
                sx={{ mt: 3 }}
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }}
              >
                Logout
              </Button>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Profile details
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Manage account information and search for other users.
            </Typography>

            <TextField
              fullWidth
              variant="outlined"
              label="Search for a user by username or email"
              value={searchTerm}
              onChange={onSearchChange}
              sx={{ mb: 3 }}
            />

            <Paper variant="outlined" sx={{ p: 2.5, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {isSearchedUser ? 'User record' : 'Your account'}
                </Typography>
                <Chip label={isSearchedUser ? 'Search result' : 'Active'} color={isSearchedUser ? 'secondary' : 'success'} size="small" />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Email: {displayEmail}
              </Typography>
              {!isSearchedUser && (
                <IconButton onClick={() => setIsEditingEmail(true)}>
                  <EditIcon />
                </IconButton>
              )}
            </Paper>

            {isEditingEmail && !isSearchedUser && (
              <Box sx={{ mb: 2 }}>
                <TextField fullWidth label="New Email" variant="outlined" value={newEmail} onChange={e => setNewEmail(e.target.value)} sx={{ mb: 2 }} />
                <Button onClick={handleUpdateEmail} variant="contained" fullWidth disabled={updatingEmail}>
                  {updatingEmail ? 'Updating...' : 'Update Email'}
                </Button>
                {error && (
                  <Typography color="error" sx={{ mt: 1 }}>
                    {error}
                  </Typography>
                )}
              </Box>
            )}

            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Keep your profile accurate to receive notifications and access secure features.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

function StackedMeta({ label, value }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
    </Box>
  );
}

export default Profile;
