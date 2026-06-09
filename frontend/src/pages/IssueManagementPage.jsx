import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MenuItem from '@mui/material/MenuItem';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';

import { api } from '../api/endpoints';
import { useSnackbar } from '../context/SnackbarContext';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

const IssueManagementPage = () => {
  const { id: vehicleId } = useParams();
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [vehicleIssues, setVehicleIssues] = useState([]);
  const [components, setComponents] = useState([]);
  
  // New Issue State
  const [description, setDescription] = useState('');

  // Assign Component Modal State
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [assignData, setAssignData] = useState({
    component: '',
    action: 'REPAIR',
    quantity: 1
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [issuesRes, componentsRes] = await Promise.all([
        api.issues.getAll(),
        api.components.getAll()
      ]);
      // Filter issues for this vehicle locally for simplicity
      const filteredIssues = issuesRes.data.filter(issue => issue.vehicle === vehicleId);
      setVehicleIssues(filteredIssues);
      setComponents(componentsRes.data);
    } catch (error) {
      showSnackbar('Failed to load issues', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [vehicleId]);

  const handleReportIssue = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    try {
      await api.issues.create({
        vehicle: vehicleId,
        description: description
      });
      showSnackbar('Issue reported successfully', 'success');
      setDescription('');
      fetchData();
    } catch (error) {
      showSnackbar('Failed to report issue', 'error');
    }
  };

  const handleOpenAssign = (issueId) => {
    setSelectedIssueId(issueId);
    setAssignData({ component: '', action: 'REPAIR', quantity: 1 });
    setAssignOpen(true);
  };

  const handleCloseAssign = () => {
    setAssignOpen(false);
    setSelectedIssueId(null);
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!assignData.component || !assignData.action || assignData.quantity <= 0) {
      showSnackbar('Please select a component, an action, and a valid quantity', 'error');
      return;
    }
    try {
      await api.issues.assignComponent(selectedIssueId, assignData);
      showSnackbar('Component assigned successfully', 'success');
      handleCloseAssign();
      fetchData();
    } catch (error) {
      const errDetail = error.response?.data?.detail || 'Failed to assign component';
      showSnackbar(errDetail, 'error');
    }
  };

  if (loading) return <Loader />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Manage Vehicle Issues</Typography>
        <Button variant="outlined" onClick={() => navigate('/vehicles')}>
          Back to Vehicles
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Left Side: Report New Issue */}
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Report New Issue</Typography>
              <form onSubmit={handleReportIssue}>
                <TextField
                  label="Issue Description"
                  multiline
                  rows={4}
                  fullWidth
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Brakes are squeaking loudly..."
                  sx={{ mb: 2, mt: 1 }}
                />
                <Button type="submit" variant="contained" fullWidth>
                  Log Issue
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Side: List of Open Issues */}
        <Grid item xs={12} md={8}>
          <Card elevation={2} sx={{ minHeight: '300px' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Current Issues</Typography>
                <Button 
                  variant="contained" 
                  color="secondary"
                  onClick={() => navigate(`/transactions/${vehicleId}/checkout`)}
                  disabled={vehicleIssues.filter(i => i.status === 'OPEN').length === 0}
                >
                  Proceed to Checkout
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />

              {vehicleIssues.length === 0 ? (
                <EmptyState message="No Issues Logged" description="Report an issue on the left to get started." />
              ) : (
                <Box display="flex" flexDirection="column" gap={2}>
                  {vehicleIssues.map(issue => (
                    <Card key={issue.id} variant="outlined" sx={{ p: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {issue.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Logged: {new Date(issue.created_at).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Chip 
                          label={issue.status} 
                          color={issue.status === 'OPEN' ? 'warning' : 'success'} 
                          size="small" 
                        />
                      </Box>
                      
                      {issue.issue_components && issue.issue_components.length > 0 && (
                        <Box mt={2} p={1} bgcolor="background.default" borderRadius={1}>
                          <Typography variant="body2" fontWeight="bold" mb={1}>Assigned Actions:</Typography>
                          {issue.issue_components.map(ic => {
                            const compObj = components.find(c => c.id === ic.component);
                            return (
                              <Typography key={ic.id} variant="body2" sx={{ ml: 1 }}>
                                • {ic.action} {compObj ? compObj.name : 'Unknown'} (Qty: {ic.quantity}) - ₹{ic.applied_price}
                              </Typography>
                            );
                          })}
                        </Box>
                      )}

                      {issue.status === 'OPEN' && (
                        <Box mt={2} display="flex" justifyContent="flex-end">
                          <Button 
                            variant="outlined" 
                            size="small" 
                            startIcon={<BuildCircleIcon />}
                            onClick={() => handleOpenAssign(issue.id)}
                          >
                            Assign Component
                          </Button>
                        </Box>
                      )}
                    </Card>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Assign Component Modal */}
      <Dialog open={assignOpen} onClose={handleCloseAssign} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Component for Repair/Replace</DialogTitle>
        <form onSubmit={handleAssignSubmit}>
          <DialogContent>
            <TextField
              select
              margin="dense"
              label="Select Component"
              fullWidth
              required
              value={assignData.component}
              onChange={(e) => setAssignData({ ...assignData, component: e.target.value })}
            >
              {components.length === 0 ? (
                <MenuItem disabled value="">
                  <em>No components available. Please create a component first.</em>
                </MenuItem>
              ) : (
                components.map((comp) => (
                  <MenuItem key={comp.id} value={comp.id}>
                    {comp.name}
                  </MenuItem>
                ))
              )}
            </TextField>
            <TextField
              select
              margin="dense"
              label="Action"
              fullWidth
              required
              value={assignData.action}
              onChange={(e) => setAssignData({ ...assignData, action: e.target.value })}
            >
              <MenuItem value="REPAIR">Repair Existing</MenuItem>
              <MenuItem value="REPLACE">Replace with New</MenuItem>
            </TextField>
            <TextField
              margin="dense"
              label="Quantity"
              type="number"
              fullWidth
              required
              inputProps={{ min: 1 }}
              value={assignData.quantity}
              onChange={(e) => setAssignData({ ...assignData, quantity: parseInt(e.target.value) || 1 })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAssign}>Cancel</Button>
            <Button type="submit" variant="contained">Assign</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default IssueManagementPage;
