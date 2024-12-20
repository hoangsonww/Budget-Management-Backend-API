import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, Paper } from '@mui/material';
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
          width: 300,
        }}
      >
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2} sx={{ fontWeight: 600 }}>
            Add Expense
          </Typography>
          <TextField label="Budget ID" fullWidth sx={{ mb: 2 }} value={budgetId} onChange={e => setBudgetId(e.target.value)} />
          <TextField label="Description" fullWidth sx={{ mb: 2 }} value={description} onChange={e => setDescription(e.target.value)} />
          <TextField label="Amount" type="number" fullWidth sx={{ mb: 2 }} value={amount} onChange={e => setAmount(e.target.value)} />
          <Button variant="contained" fullWidth onClick={handleAdd}>
            Add Expense
          </Button>
        </Paper>
      </Box>
    </Modal>
  );
}

export default AddExpenseModal;
