import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Paper, Stack } from '@mui/material';
import api from '../services/api';

function EditBudgetModal({ open, onClose, onUpdated, budget }) {
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');

  useEffect(() => {
    if (budget) {
      setName(budget.name);
      setLimit(budget.limit);
    }
  }, [budget]);

  const handleUpdate = async () => {
    try {
      await api.put(`/api/budgets/${budget._id}`, { name, limit: Number(limit) });
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (!budget) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 420,
        }}
      >
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={1} sx={{ fontWeight: 700 }}>
            Edit Budget
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Update the budget name or adjust the limit.
          </Typography>
          <Stack spacing={2}>
            <TextField label="Budget Name" fullWidth value={name} onChange={e => setName(e.target.value)} />
            <TextField label="Limit" type="number" fullWidth value={limit} onChange={e => setLimit(e.target.value)} />
            <Button variant="contained" fullWidth onClick={handleUpdate} size="large">
              Update Budget
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Modal>
  );
}

export default EditBudgetModal;
