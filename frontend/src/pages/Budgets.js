import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Paper, Fade, TablePagination } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
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

  // Pagination states
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

  return (
    <Container sx={{ mt: 4 }}>
      <LoadingOverlay loading={loading} />
      <Fade in timeout={500}>
        <Paper sx={{ p: 4, overflowX: 'auto' }}>
          <Typography variant="h4" mb={2} sx={{ fontWeight: 600 }}>
            Budgets
          </Typography>
          <Button variant="contained" sx={{ mb: 2, mr: 2 }} onClick={() => setAddOpen(true)}>
            Add Budget
          </Button>
          {budgets.length > 0 && <BudgetChart budgets={budgets} />}
          <Table sx={{ mt: 2, minWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography sx={{ fontWeight: 600 }}>Name</Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontWeight: 600 }}>Limit</Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontWeight: 600 }}>Actions</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedBudgets.map(b => (
                <TableRow key={b._id} hover>
                  <TableCell>{b.name}</TableCell>
                  <TableCell>{b.limit}</TableCell>
                  <TableCell>
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
      </Fade>
    </Container>
  );
}

export default Budgets;
