import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import BuildIcon from '@mui/icons-material/Build';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';

import { api } from '../api/endpoints';
import { useSnackbar } from '../context/SnackbarContext';
import DataTable from '../components/common/DataTable';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

const ComponentPage = () => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const showSnackbar = useSnackbar();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    purchase_price: '',
    repair_price: ''
  });

  const fetchComponents = async () => {
    try {
      setLoading(true);
      const response = await api.components.getAll();
      setComponents(response.data);
    } catch (error) {
      showSnackbar('Failed to fetch components', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', description: '', purchase_price: '', repair_price: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.components.create(formData);
      showSnackbar('Component created successfully', 'success');
      handleClose();
      fetchComponents();
    } catch (error) {
      showSnackbar(error.response?.data?.detail || 'Validation error', 'error');
    }
  };

  const columns = [
    { id: 'name', label: 'Component Name' },
    { id: 'description', label: 'Description' },
    { id: 'purchase_price', label: 'Purchase Price (₹)' },
    { id: 'repair_price', label: 'Repair Price (₹)' }
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Components</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Component
        </Button>
      </Box>

      {loading ? (
        <Loader />
      ) : components.length === 0 ? (
        <EmptyState 
          icon={BuildIcon} 
          message="No Components Found" 
          description="Add your first component to start managing inventory." 
        />
      ) : (
        <DataTable columns={columns} data={components} />
      )}

      {/* Add Component Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Component</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              margin="dense"
              label="Component Name"
              name="name"
              fullWidth
              required
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Description"
              name="description"
              fullWidth
              value={formData.description}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Purchase Price"
              name="purchase_price"
              type="number"
              inputProps={{ step: "0.01" }}
              fullWidth
              required
              value={formData.purchase_price}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Repair Price"
              name="repair_price"
              type="number"
              inputProps={{ step: "0.01" }}
              fullWidth
              required
              value={formData.repair_price}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ComponentPage;
