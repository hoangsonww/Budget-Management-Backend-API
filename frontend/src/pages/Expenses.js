import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Typography,
  Button,
  TextField,
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
  InputAdornment,
} from '@mui/material';
import { Edit, Delete, Search, AddCircleOutline } from '@mui/icons-material';
import api from '../services/api';
import AddExpenseModal from '../components/AddExpenseModal';
import EditExpenseModal from '../components/EditExpenseModal';
import ExpenseChart from '../charts/ExpenseChart';
import LoadingOverlay from '../components/LoadingOverlay';

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [budgetMap, setBudgetMap] = useState({});
  const [budgetLimits, setBudgetLimits] = useState({});
  const [budgetTotals, setBudgetTotals] = useState({});

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchBudgetsAndExpenses = async () => {
    setLoading(true);
    try {
      const [budRes, expRes] = await Promise.all([api.get('/api/budgets'), api.get('/api/expenses')]);
      const budgets = budRes.data;
      const exp = expRes.data.expenses || [];

      const bMap = {};
      const bLimits = {};
      budgets.forEach(b => {
        bMap[b._id] = b.name;
        bLimits[b._id] = b.limit;
      });

      const bTotals = {};
      exp.forEach(e => {
        bTotals[e.budgetId] = (bTotals[e.budgetId] || 0) + e.amount;
      });

      setBudgetMap(bMap);
      setBudgetLimits(bLimits);
      setBudgetTotals(bTotals);

      setExpenses(exp);
      setFilteredExpenses(exp);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetsAndExpenses();
  }, []);

  const handleDelete = async id => {
    setLoading(true);
    try {
      await api.delete(`/api/expenses/${id}`);
      fetchBudgetsAndExpenses();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleEditClick = expense => {
    setCurrentExpense(expense);
    setEditOpen(true);
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      setFilteredExpenses(expenses);
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/api/search', { query, page: 1, size: 100 });
      setFilteredExpenses(res.data.expenses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const displayedExpenses = filteredExpenses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const isOverLimit = budgetId => {
    const total = budgetTotals[budgetId] || 0;
    const limit = budgetLimits[budgetId] || Infinity;
    return total > limit;
  };

  const totalSpend = useMemo(() => filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0), [filteredExpenses]);

  return (
    <Container sx={{ mt: 4, pb: 6 }}>
      <LoadingOverlay loading={loading} />
      <Fade in timeout={500}>
        <Box>
          <Paper sx={{ p: { xs: 3, md: 4 }, mb: 3 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ md: 'center' }} justifyContent="space-between">
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  Expenses
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Search across expenses, watch budget thresholds, and keep a clear audit trail.
                </Typography>
              </Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }}>
                <Chip label={`${filteredExpenses.length} records`} />
                <Chip label={`Total spend $${totalSpend.toLocaleString()}`} color="secondary" />
                <Button variant="contained" startIcon={<AddCircleOutline />} onClick={() => setAddOpen(true)}>
                  Add Expense
                </Button>
              </Stack>
            </Stack>
            <Divider sx={{ my: 3 }} />
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
              <TextField
                placeholder="Search expenses by description"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSearch()}
                sx={{ minWidth: { xs: '100%', md: 320 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <Button variant="outlined" onClick={handleSearch}>
                Search
              </Button>
            </Stack>

            {filteredExpenses.length > 0 && (
              <Box sx={{ width: '100%', overflow: 'hidden', mt: 3 }}>
                <ExpenseChart expenses={filteredExpenses} budgetMap={budgetMap} />
              </Box>
            )}
          </Paper>

          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Expense Ledger
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Showing {displayedExpenses.length} of {filteredExpenses.length}
              </Typography>
            </Stack>
            <TableContainer>
              <Table sx={{ minWidth: 600 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Budget</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedExpenses.map(e => {
                    const highlight = isOverLimit(e.budgetId);
                    return (
                      <TableRow
                        key={e._id}
                        hover
                        sx={{
                          backgroundColor: highlight ? 'rgba(216, 74, 74, 0.08)' : 'inherit',
                        }}
                      >
                        <TableCell>{budgetMap[e.budgetId] || e.budgetId}</TableCell>
                        <TableCell>{e.description}</TableCell>
                        <TableCell>${Number(e.amount || 0).toLocaleString()}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleEditClick(e)}>
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(e._id)}>
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={filteredExpenses.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <AddExpenseModal open={addOpen} onClose={() => setAddOpen(false)} onAdded={fetchBudgetsAndExpenses} />
            <EditExpenseModal open={editOpen} onClose={() => setEditOpen(false)} onUpdated={fetchBudgetsAndExpenses} expense={currentExpense} />
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
}

export default Expenses;
