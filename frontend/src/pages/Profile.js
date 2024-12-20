import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Typography, TextField, IconButton, Paper } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import LoadingOverlay from '../components/LoadingOverlay';
import api from '../services/api';

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
  // eslint-disable-next-line no-unused-vars
  const [email, setEmail] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [daysSinceJoined, setDaysSinceJoined] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [joinedDate, setJoinedDate] = useState('');
  const [error, setError] = useState('');
  const [randomAvatar, setRandomAvatar] = useState('');
  const [userData, setUserData] = useState(null); // The authenticated user's data
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchUser, setSearchUser] = useState(null); // matched user from search

  const userToken = localStorage.getItem('token');

  // Debounce utility
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

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

      setEmail(user.email || 'N/A');
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
      setEmail(newEmail);
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
      // Filter logic: find user whose username or email includes the search term (case-insensitive)
      const lowerTerm = term.toLowerCase();
      const matched = allUsers.find(
        u => (u.username && u.username.toLowerCase().includes(lowerTerm)) || (u.email && u.email.toLowerCase().includes(lowerTerm))
      );
      setSearchUser(matched || null);
    },
    [allUsers]
  );

  // Debounced search
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(value => {
      handleSearch(value);
    }, 300),
    [handleSearch]
  );

  const onSearchChange = e => {
    const val = e.target.value;
    setSearchTerm(val);
    debouncedSearch(val);
  };

  if (loading) return <LoadingOverlay loading={true} />;

  if (!userToken) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4} height="100vh">
        <Typography variant="h5">
          You are not signed in. Please{' '}
          <a href="/login" style={{ color: '#f57c00' }}>
            log in
          </a>{' '}
          to view your profile.
        </Typography>
      </Box>
    );
  }

  // Decide which user data to show: searchUser if available, else authenticated userData
  const displayUser = searchUser ? searchUser : userData;
  const displayEmail = displayUser && displayUser.email ? displayUser.email : 'N/A';

  let displayDaysSinceJoined = daysSinceJoined;
  let displayJoinedDate = joinedDate;

  // If we're showing a searched user (not the authenticated one), we don't have joinedDate or daysSinceJoined info.
  // The prompt only provides `"_id", "username", "email", "createdAt"` for the profile endpoint,
  // and for all users only `"_id","username","email"`. No `createdAt` for all users was guaranteed.
  // If it's not the authenticated user, we just show what we can: email, no joined data since not provided.
  const isSearchedUser = !!searchUser && searchUser._id !== userData?._id;
  if (isSearchedUser) {
    // For searched users:
    displayDaysSinceJoined = 'N/A';
    displayJoinedDate = 'N/A';
  }

  const today = new Date().toLocaleDateString();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'background.default',
        pt: 8,
        pb: 20,
      }}
    >
      {/* Search bar */}
      <Box sx={{ width: '400px', mb: 4 }}>
        <TextField fullWidth variant="outlined" label="Search for a User by Username or Email..." value={searchTerm} onChange={onSearchChange} />
      </Box>

      <Paper
        sx={{
          backgroundColor: 'background.paper',
          color: 'text.primary',
          p: 4,
          borderRadius: 2,
          width: '400px',
          textAlign: 'center',
          boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
        }}
      >
        <Box
          sx={{
            width: 150,
            height: 150,
            borderRadius: '50%',
            overflow: 'hidden',
            mx: 'auto',
            mb: 2,
            border: '3px solid #8B4513',
          }}
        >
          <img src={randomAvatar} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Box>

        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
          Welcome{displayEmail !== 'N/A' ? `, ${displayEmail.split('@')[0]}!` : '!'}
        </Typography>
        <Box sx={{ borderBottom: '1px solid #ccc', mb: 2 }}></Box>

        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', fontSize: '20px' }}>
          {isSearchedUser ? `Searched User Profile` : `Your Profile`}
        </Typography>

        {displayEmail !== 'N/A' && !isSearchedUser && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1.5 }}>
            <Typography>
              <strong>Email:</strong> {displayEmail}
            </Typography>
            <IconButton onClick={() => setIsEditingEmail(true)}>
              <EditIcon sx={{ '&:hover': { color: '#f57c00' } }} />
            </IconButton>
          </Box>
        )}

        {displayEmail !== 'N/A' && isSearchedUser && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1.5 }}>
            <Typography>
              <strong>Email:</strong> {displayEmail}
            </Typography>
          </Box>
        )}

        {isEditingEmail && !isSearchedUser && (
          <Box sx={{ mb: 2 }}>
            <TextField fullWidth label="New Email" variant="outlined" value={newEmail} onChange={e => setNewEmail(e.target.value)} sx={{ mb: 2 }} />
            <Button onClick={handleUpdateEmail} variant="contained" color="primary" fullWidth disabled={updatingEmail}>
              {updatingEmail ? 'Updating...' : 'Update Email'}
            </Button>
            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
          </Box>
        )}

        <Typography sx={{ mb: 2.5 }}>
          <strong>Days Since Joined:</strong> {displayDaysSinceJoined}
        </Typography>
        <Typography sx={{ mb: 2.5 }}>
          <strong>Date Joined:</strong> {displayJoinedDate}
        </Typography>
        <Typography sx={{ mb: 1.5 }}>
          <strong>Today's Date:</strong> {today}
        </Typography>

        <Typography sx={{ mt: 3, fontWeight: 'bold', fontSize: '18px' }}>Thank you for exploring Budget Manager today! 🚀</Typography>
        <Box sx={{ borderBottom: '1px solid #ccc', mt: 2, mb: 2 }}></Box>
        {!isSearchedUser && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
          >
            Logout
          </Button>
        )}
      </Paper>
    </Box>
  );
}

export default Profile;
