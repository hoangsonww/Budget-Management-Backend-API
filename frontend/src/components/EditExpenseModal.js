import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Paper, Stack } from '@mui/material';
import api from '../services/api';

function EditExpenseModal({ open, onClose, onUpdated, expense }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (expense) {
      setDescription(expense.description);
      setAmount(expense.amount);
    }
  }, [expense]);

  const handleUpdate = async () => {
    try {
      await api.put(`/api/expenses/${expense._id}`, { description, amount: Number(amount) });
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (!expense) return null;

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
            Edit Expense
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Update description and amount for this expense.
          </Typography>
          <Stack spacing={2}>
            <TextField label="Description" fullWidth value={description} onChange={e => setDescription(e.target.value)} />
            <TextField label="Amount" type="number" fullWidth value={amount} onChange={e => setAmount(e.target.value)} />
            <Button variant="contained" fullWidth onClick={handleUpdate} size="large">
              Update Expense
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Modal>
  );
}

export default EditExpenseModal;
