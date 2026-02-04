import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Fade,
  TablePagination,
  TableContainer,
  Stack,
  Divider,
  Chip,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import api from '../services/api';
import LoadingOverlay from '../components/LoadingOverlay';

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/users');
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter(u => u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const displayedUsers = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Container sx={{ mt: 4, pb: 6 }}>
      <LoadingOverlay loading={loading} />
      <Fade in timeout={500}>
        <Paper sx={{ p: { xs: 3, md: 4 } }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ md: 'center' }} justifyContent="space-between">
            <div>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                Users
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Search and review user records, emails, and platform activity.
              </Typography>
            </div>
            <Chip label={`${filtered.length} users`} color="secondary" />
          </Stack>
          <Divider sx={{ my: 3 }} />
          <TextField
            placeholder="Search by username or email"
            fullWidth
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />
          <TableContainer>
            <Table sx={{ minWidth: 400 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedUsers.map(u => (
                  <TableRow key={u._id} hover>
                    <TableCell>{u.username}</TableCell>
                    <TableCell>{u.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Fade>
    </Container>
  );
}

export default Users;
