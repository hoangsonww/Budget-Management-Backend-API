import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, Paper, Stack } from '@mui/material';
import api from '../services/api';

function AddBudgetModal({ open, onClose, onAdded }) {
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');

  const handleAdd = async () => {
    try {
      await api.post('/api/budgets', { name, limit: Number(limit) });
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
          maxWidth: 420,
        }}
      >
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={1} sx={{ fontWeight: 700 }}>
            Add Budget
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Create a new budget with a clear spending limit.
          </Typography>
          <Stack spacing={2}>
            <TextField label="Budget Name" fullWidth value={name} onChange={e => setName(e.target.value)} />
            <TextField label="Limit" type="number" fullWidth value={limit} onChange={e => setLimit(e.target.value)} />
            <Button variant="contained" fullWidth onClick={handleAdd} size="large">
              Add Budget
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Modal>
  );
}

export default AddBudgetModal;
