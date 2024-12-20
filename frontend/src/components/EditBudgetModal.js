import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Paper } from '@mui/material';
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
          width: 300,
        }}
      >
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2} sx={{ fontWeight: 600 }}>
            Edit Budget
          </Typography>
          <TextField label="Budget Name" fullWidth sx={{ mb: 2 }} value={name} onChange={e => setName(e.target.value)} />
          <TextField label="Limit" type="number" fullWidth sx={{ mb: 2 }} value={limit} onChange={e => setLimit(e.target.value)} />
          <Button variant="contained" fullWidth onClick={handleUpdate}>
            Update
          </Button>
        </Paper>
      </Box>
    </Modal>
  );
}

export default EditBudgetModal;
