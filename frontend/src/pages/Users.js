import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Table, TableBody, TableCell, TableHead, TableRow, Paper, Fade, TablePagination } from '@mui/material';
import api from '../services/api';
import LoadingOverlay from '../components/LoadingOverlay';

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Pagination
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
    <Container sx={{ mt: 4 }}>
      <LoadingOverlay loading={loading} />
      <Fade in timeout={500}>
        <Paper sx={{ p: 4, overflowX: 'auto' }}>
          <Typography variant="h4" mb={2} sx={{ fontWeight: 600 }}>
            Users
          </Typography>
          <TextField placeholder="Search for a User..." sx={{ mb: 2 }} fullWidth value={search} onChange={e => setSearch(e.target.value)} />
          <Table sx={{ minWidth: 400 }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography sx={{ fontWeight: 600 }}>Username</Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontWeight: 600 }}>Email</Typography>
                </TableCell>
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
          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Fade>
    </Container>
  );
}

export default Users;
