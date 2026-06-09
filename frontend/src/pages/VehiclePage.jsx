import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SettingsIcon from '@mui/icons-material/Settings';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

import { api } from '../api/endpoints';
import { useSnackbar } from '../context/SnackbarContext';
import DataTable from '../components/common/DataTable';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

const VehiclePage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    license_plate: '',
    vin: '',
    make: '',
    model: '',
    year: '',
    owner_name: ''
  });

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await api.vehicles.getAll();
      setVehicles(response.data);
    } catch (error) {
      showSnackbar('Failed to fetch vehicles', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ license_plate: '', vin: '', make: '', model: '', year: '', owner_name: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.vehicles.create(formData);
      showSnackbar('Vehicle registered successfully', 'success');
      handleClose();
      fetchVehicles();
    } catch (error) {
      // Extract specific error details if available from Django DRF
      const errDetail = error.response?.data?.detail || JSON.stringify(error.response?.data) || 'Validation error';
      showSnackbar(`Error: ${errDetail}`, 'error');
    }
  };

  const columns = [
    { id: 'license_plate', label: 'License Plate' },
    { id: 'make', label: 'Make' },
    { id: 'model', label: 'Model' },
    { id: 'year', label: 'Year' },
    { id: 'owner_name', label: 'Owner Name' },
    { 
      id: 'actions', 
      label: 'Actions',
      render: (row) => (
        <Button 
          variant="outlined" 
          size="small" 
          startIcon={<SettingsIcon />}
          onClick={() => navigate(`/vehicles/${row.id}/issues`)}
        >
          Manage Issues
        </Button>
      )
    }
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Vehicles</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Register Vehicle
        </Button>
      </Box>

      {loading ? (
        <Loader />
      ) : vehicles.length === 0 ? (
        <EmptyState 
          icon={DirectionsCarIcon} 
          message="No Vehicles Found" 
          description="Register your first customer vehicle." 
        />
      ) : (
        <DataTable columns={columns} data={vehicles} />
      )}

      {/* Register Vehicle Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Register New Vehicle</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              margin="dense"
              label="License Plate"
              name="license_plate"
              fullWidth
              required
              value={formData.license_plate}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="VIN"
              name="vin"
              fullWidth
              required
              value={formData.vin}
              onChange={handleChange}
            />
            <Box display="flex" gap={2}>
              <TextField
                margin="dense"
                label="Make"
                name="make"
                fullWidth
                required
                value={formData.make}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                label="Model"
                name="model"
                fullWidth
                required
                value={formData.model}
                onChange={handleChange}
              />
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                margin="dense"
                label="Year"
                name="year"
                type="number"
                fullWidth
                required
                value={formData.year}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                label="Owner Name"
                name="owner_name"
                fullWidth
                required
                value={formData.owner_name}
                onChange={handleChange}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">Save Vehicle</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default VehiclePage;
