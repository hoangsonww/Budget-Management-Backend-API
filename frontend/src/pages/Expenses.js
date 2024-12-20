import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
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

  // Pagination
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

  return (
    <Container sx={{ mt: 4 }}>
      <LoadingOverlay loading={loading} />
      <Fade in timeout={500}>
        <Paper sx={{ p: 4, overflowX: 'auto' }}>
          <Typography variant="h4" mb={2} sx={{ fontWeight: 600 }}>
            Expenses
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
            <Button variant="contained" onClick={() => setAddOpen(true)}>
              Add Expense
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search Expenses by Description"
                value={query}
                onChange={e => setQuery(e.target.value)}
                size="small"
                onKeyPress={e => e.key === 'Enter' && handleSearch()}
                sx={{ minWidth: 280 }}
              />
              <Button variant="outlined" onClick={handleSearch}>
                Search
              </Button>
            </Box>
          </Box>

          {filteredExpenses.length > 0 && (
            <Box sx={{ width: '100%', overflow: 'hidden', mb: 2 }}>
              {/* Previously line chart, now Scatter chart in ExpenseChart.js */}
              <ExpenseChart expenses={filteredExpenses} budgetMap={budgetMap} />
            </Box>
          )}
          <Table sx={{ mt: 2, minWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography sx={{ fontWeight: 600 }}>Budget</Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontWeight: 600 }}>Description</Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontWeight: 600 }}>Amount</Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontWeight: 600 }}>Actions</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedExpenses.map(e => {
                const highlight = isOverLimit(e.budgetId);
                return (
                  <TableRow key={e._id} hover sx={{ backgroundColor: highlight ? 'rgba(255,0,0,0.1)' : 'inherit' }}>
                    <TableCell>{budgetMap[e.budgetId] || e.budgetId}</TableCell>
                    <TableCell>{e.description}</TableCell>
                    <TableCell>{e.amount}</TableCell>
                    <TableCell>
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
      </Fade>
    </Container>
  );
}

export default Expenses;
