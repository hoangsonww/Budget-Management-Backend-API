import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField, IconButton, CircularProgress, Paper } from '@mui/material';
import { GitHub, LinkedIn, Facebook, Instagram, Twitter, Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import LoadingOverlay from '../components/LoadingOverlay';
import api from '../services/api';

const avatarImages = [
  "/OIP.jpg",
  "/OIP2.webp",
  "/OIP3.png",
  "/OIP4.png",
  // ... Add more if available
];

function Profile() {
  const [email, setEmail] = useState("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [daysSinceJoined, setDaysSinceJoined] = useState(null);
  const [documentCount, setDocumentCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [joinedDate, setJoinedDate] = useState("");
  const [socialMedia, setSocialMedia] = useState({
    github: "",
    linkedin: "",
    facebook: "",
    instagram: "",
    twitter: "",
  });
  const [editingField, setEditingField] = useState(null);
  const [error, setError] = useState("");
  const [randomAvatar, setRandomAvatar] = useState("");

  const userToken = localStorage.getItem("token");

  useEffect(() => {
    setRandomAvatar(
      avatarImages[Math.floor(Math.random() * avatarImages.length)],
    );

    const fetchProfile = async() => {
      setLoading(true);
      try {
        if(!userToken) {
          setLoading(false);
          return;
        }
        const res = await api.get('/api/users/profile'); // Returns { _id, username, email, createdAt }
        const user = res.data;
        setEmail(user.email);
        // Mock daysSinceJoined and docCount:
        const joined = new Date(user.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - joined);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        setDaysSinceJoined(diffDays);

        setDocumentCount(42); // Mocked count
        setJoinedDate(joined.toLocaleDateString());

        // Mock social media
        setSocialMedia({
          github: "yourgithub",
          linkedin: "yourlinkedin",
          facebook: "",
          instagram: "",
          twitter: "",
        });

      } catch(err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userToken]);

  const handleUpdateEmail = async () => {
    setUpdatingEmail(true);
    setError("");
    try {
      await api.put('/api/users/profile', { email: newEmail });
      setEmail(newEmail);
      setIsEditingEmail(false);
    } catch (err) {
      setError("Failed to update email. Please try again.");
    } finally {
      setUpdatingEmail(false);
    }
  };

  const handleSocialMediaChange = (e) => {
    const platform = e.target.name;
    setSocialMedia({
      ...socialMedia,
      [platform]: e.target.value,
    });
  };

  const handleUpdateSocialMedia = (platform) => {
    // Here we could call an API to update social media. Mocking:
    setEditingField(null);
  };

  const formatLink = (platform, username) => {
    const baseUrls = {
      github: "https://github.com/",
      linkedin: "https://linkedin.com/in/",
      facebook: "https://facebook.com/",
      instagram: "https://instagram.com/",
      twitter: "https://twitter.com/",
    };
    return username ? baseUrls[platform] + username : "";
  };

  const getUsername = (username) => username || "Not Set";

  if(loading) return <LoadingOverlay loading={true} />;

  if(!userToken) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4} height="100vh">
        <Typography variant="h5">
          You are not signed in. Please <a href="/login" style={{color:'#f57c00'}}>log in</a> to view your profile.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display:'flex',
        justifyContent:'center',
        alignItems:'flex-start',
        height:'100%',
        backgroundColor:'background.default',
        pt:8,
        pb:20
      }}
    >
      <Paper
        sx={{
          backgroundColor:'background.paper',
          color:'text.primary',
          p:4,
          borderRadius:2,
          width:'400px',
          textAlign:'center',
          boxShadow:'0px 4px 10px rgba(0,0,0,0.1)'
        }}
      >
        <Box
          sx={{
            width:150,
            height:150,
            borderRadius:'50%',
            overflow:'hidden',
            mx:'auto',
            mb:2,
            border:'3px solid #8B4513'
          }}
        >
          <img
            src={randomAvatar}
            alt="User Avatar"
            style={{ width:'100%', height:'100%', objectFit:'cover' }}
          />
        </Box>

        <Typography variant="h5" sx={{mb:2, fontWeight:'bold'}}>
          Welcome, {email.split("@")[0]}!
        </Typography>
        <Box sx={{borderBottom:'1px solid #ccc', mb:2}}></Box>

        <Typography variant="h5" sx={{mb:2, fontWeight:'bold', fontSize:'20px'}}>
          Your Profile
        </Typography>

        <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', mb:1.5}}>
          <Typography><strong>Email:</strong> {email}</Typography>
          <IconButton onClick={()=>setIsEditingEmail(true)}>
            <EditIcon sx={{'&:hover':{color:'#f57c00'}}}/>
          </IconButton>
        </Box>

        {isEditingEmail && (
          <Box sx={{mb:2}}>
            <TextField
              fullWidth
              label="New Email"
              variant="outlined"
              value={newEmail}
              onChange={(e)=>setNewEmail(e.target.value)}
              sx={{mb:2}}
            />
            <Button
              onClick={handleUpdateEmail}
              variant="contained"
              color="primary"
              fullWidth
              disabled={updatingEmail}
            >
              {updatingEmail ? "Updating..." : "Update Email"}
            </Button>
            {error && (
              <Typography color="error" sx={{mt:1}}>{error}</Typography>
            )}
          </Box>
        )}

        <Typography sx={{mb:2.5}}><strong>Days Since Joined:</strong> {daysSinceJoined}</Typography>
        <Typography sx={{mb:2.5}}><strong>Date Joined:</strong> {joinedDate}</Typography>
        <Typography sx={{mb:2.5}}><strong>Documents Uploaded So Far:</strong> {documentCount}</Typography>
        <Typography sx={{mb:1.5}}><strong>Today's Date:</strong> {(new Date()).toLocaleDateString()}</Typography>

        {["github","linkedin","facebook","instagram","twitter"].map((platform)=>(
          <Box sx={{display:'flex',alignItems:'center',justifyContent:'center',mb:1}} key={platform}>
            {platform==='github' && <GitHub sx={{mr:1}}/>}
            {platform==='linkedin' && <LinkedIn sx={{mr:1}}/>}
            {platform==='facebook' && <Facebook sx={{mr:1}}/>}
            {platform==='instagram' && <Instagram sx={{mr:1}}/>}
            {platform==='twitter' && <Twitter sx={{mr:1}}/>}

            {editingField===platform ? (
              <>
                <TextField
                  name={platform}
                  value={socialMedia[platform]}
                  label="Enter Username"
                  onChange={handleSocialMediaChange}
                  sx={{textAlign:'center',flexGrow:1}}
                />
                <IconButton onClick={()=>handleUpdateSocialMedia(platform)}>
                  <SaveIcon/>
                </IconButton>
              </>
            ) : (
              <>
                <Typography sx={{fontWeight:'bold',mr:1}}>
                  {platform.charAt(0).toUpperCase()+platform.slice(1)}:
                </Typography>
                <Button
                  href={formatLink(platform, socialMedia[platform])}
                  target="_blank"
                  sx={{fontWeight:'bold',textTransform:'none'}}
                >
                  {getUsername(socialMedia[platform])}
                </Button>
                <IconButton onClick={()=>setEditingField(platform)}>
                  <EditIcon sx={{'&:hover':{color:'#f57c00'}}}/>
                </IconButton>
              </>
            )}
          </Box>
        ))}

        <Typography sx={{mt:3,fontWeight:'bold',fontSize:'18px'}}>
          Thank you for exploring Budget Manager today! 🚀
        </Typography>
        <Box sx={{borderBottom:'1px solid #ccc', mt:2, mb:2}}></Box>
        <Button
          variant="contained"
          color="secondary"
          onClick={()=>{
            localStorage.removeItem("token");
            window.location.href='/login';
          }}
        >
          Logout
        </Button>
      </Paper>
    </Box>
  );
}

export default Profile;
