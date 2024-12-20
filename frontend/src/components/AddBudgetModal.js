import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, Paper } from '@mui/material';
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
      <Box sx={{
        position:'absolute', top:'50%', left:'50%',
        transform:'translate(-50%, -50%)', width:300
      }}>
        <Paper sx={{ p:3 }}>
          <Typography variant="h6" mb={2} sx={{ fontWeight:600 }}>Add Budget</Typography>
          <TextField label="Budget Name" fullWidth sx={{ mb:2 }} value={name} onChange={e=>setName(e.target.value)} />
          <TextField label="Limit" type="number" fullWidth sx={{ mb:2 }} value={limit} onChange={e=>setLimit(e.target.value)} />
          <Button variant="contained" fullWidth onClick={handleAdd}>Add</Button>
        </Paper>
      </Box>
    </Modal>
  );
}

export default AddBudgetModal;
