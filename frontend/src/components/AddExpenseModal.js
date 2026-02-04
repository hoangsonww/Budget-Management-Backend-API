import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, Paper, Stack } from '@mui/material';
import api from '../services/api';

function AddExpenseModal({ open, onClose, onAdded }) {
  const [budgetId, setBudgetId] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const handleAdd = async () => {
    try {
      await api.post('/api/expenses', { budgetId, description, amount: Number(amount) });
      onAdded();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 460,
        }}
      >
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={1} sx={{ fontWeight: 700 }}>
            Add Expense
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Record a new expense against a budget.
          </Typography>
          <Stack spacing={2}>
            <TextField label="Budget ID" fullWidth value={budgetId} onChange={e => setBudgetId(e.target.value)} />
            <TextField label="Description" fullWidth value={description} onChange={e => setDescription(e.target.value)} />
            <TextField label="Amount" type="number" fullWidth value={amount} onChange={e => setAmount(e.target.value)} />
            <Button variant="contained" fullWidth onClick={handleAdd} size="large">
              Add Expense
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Modal>
  );
}

export default AddExpenseModal;
