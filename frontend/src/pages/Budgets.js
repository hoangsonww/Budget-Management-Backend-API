import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Fade,
  TablePagination,
  Box,
  TableContainer,
  Stack,
  Divider,
  Chip,
} from '@mui/material';
import { Edit, Delete, AddCircleOutline } from '@mui/icons-material';
import api from '../services/api';
import AddBudgetModal from '../components/AddBudgetModal';
import EditBudgetModal from '../components/EditBudgetModal';
import BudgetChart from '../charts/BudgetChart';
import LoadingOverlay from '../components/LoadingOverlay';

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(null);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/budgets');
      setBudgets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleDelete = async id => {
    setLoading(true);
    try {
      await api.delete(`/api/budgets/${id}`);
      fetchBudgets();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleEditClick = budget => {
    setCurrentBudget(budget);
    setEditOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const displayedBudgets = budgets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const totalLimit = useMemo(() => budgets.reduce((sum, b) => sum + (b.limit || 0), 0), [budgets]);

  return (
    <Container sx={{ mt: 4, pb: 6 }}>
      <LoadingOverlay loading={loading} />
      <Fade in timeout={500}>
        <Box>
          <Paper sx={{ p: { xs: 3, md: 4 }, mb: 3 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ md: 'center' }} justifyContent="space-between">
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  Budgets
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Define spending guardrails, track limits, and keep budgets aligned with outcomes.
                </Typography>
              </Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }}>
                <Chip label={`${budgets.length} budgets`} />
                <Chip label={`Total limit $${totalLimit.toLocaleString()}`} color="secondary" />
                <Button variant="contained" startIcon={<AddCircleOutline />} onClick={() => setAddOpen(true)}>
                  Add Budget
                </Button>
              </Stack>
            </Stack>
            <Divider sx={{ my: 3 }} />
            {budgets.length > 0 && <BudgetChart budgets={budgets} />}
          </Paper>

          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Budget Ledger
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Showing {displayedBudgets.length} of {budgets.length}
              </Typography>
            </Stack>

            <TableContainer>
              <Table sx={{ minWidth: 600 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Limit</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedBudgets.map(b => (
                    <TableRow key={b._id} hover>
                      <TableCell>{b.name}</TableCell>
                      <TableCell>${Number(b.limit || 0).toLocaleString()}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleEditClick(b)}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(b._id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={budgets.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <AddBudgetModal open={addOpen} onClose={() => setAddOpen(false)} onAdded={fetchBudgets} />
            <EditBudgetModal open={editOpen} onClose={() => setEditOpen(false)} onUpdated={fetchBudgets} budget={currentBudget} />
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
}

export default Budgets;
