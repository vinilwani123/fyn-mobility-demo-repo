import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

import { api } from '../api/endpoints';
import { useSnackbar } from '../context/SnackbarContext';

const CheckoutPage = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const [laborCharges, setLaborCharges] = useState('');
  const [otherCharges, setOtherCharges] = useState('');
  
  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.transactions.simulatePayment({
        vehicle_id: vehicleId,
        labor_charges: laborCharges || '0.00',
        other_charges: otherCharges || '0.00'
      });
      setSimulation(res.data);
      showSnackbar('Invoice simulated successfully', 'success');
    } catch (error) {
      showSnackbar(error.response?.data?.detail || 'Simulation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    if (!simulation) return;
    try {
      await api.transactions.pay(simulation.id);
      showSnackbar('Payment successful!', 'success');
      navigate(`/transactions/${simulation.id}/receipt`);
    } catch (error) {
      showSnackbar(error.response?.data?.detail || 'Payment failed', 'error');
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Checkout</Typography>
        <Button variant="outlined" onClick={() => navigate(`/vehicles/${vehicleId}/issues`)}>
          Back to Issues
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Step 1: Input Extra Charges */}
        <Grid item xs={12} md={5}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Step 1: Calculate Final Invoice</Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Add labor and miscellaneous charges to generate the final bill for vehicle {vehicleId}.
              </Typography>
              <form onSubmit={handleSimulate}>
                <TextField
                  label="Labor Charges (₹)"
                  type="number"
                  inputProps={{ step: "0.01", min: "0" }}
                  fullWidth
                  margin="dense"
                  value={laborCharges}
                  onChange={(e) => setLaborCharges(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Other Charges (₹)"
                  type="number"
                  inputProps={{ step: "0.01", min: "0" }}
                  fullWidth
                  margin="dense"
                  value={otherCharges}
                  onChange={(e) => setOtherCharges(e.target.value)}
                  sx={{ mb: 3 }}
                />
                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth 
                  disabled={loading}
                >
                  Generate Invoice
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Step 2: Review and Pay */}
        <Grid item xs={12} md={7}>
          <Card elevation={2} sx={{ minHeight: '300px', opacity: simulation ? 1 : 0.5 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Step 2: Review and Pay</Typography>
              <Divider sx={{ mb: 3 }} />

              {!simulation ? (
                <Typography color="text.secondary" align="center" mt={5}>
                  Generate an invoice on the left to preview it here.
                </Typography>
              ) : (
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Transaction ID: {simulation.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Status: {simulation.status}
                  </Typography>

                  <Box bgcolor="background.default" p={2} borderRadius={1} mb={3}>
                    <Grid container justifyContent="space-between" mb={1}>
                      <Typography>Parts & Components Total:</Typography>
                      <Typography>₹{simulation.total_amount}</Typography>
                    </Grid>
                    <Grid container justifyContent="space-between" mb={1}>
                      <Typography>Labor Charges:</Typography>
                      <Typography>₹{simulation.labor_charges}</Typography>
                    </Grid>
                    <Grid container justifyContent="space-between" mb={1}>
                      <Typography>Other Charges:</Typography>
                      <Typography>₹{simulation.other_charges}</Typography>
                    </Grid>
                    <Divider sx={{ my: 1 }} />
                    <Grid container justifyContent="space-between">
                      <Typography variant="h6" fontWeight="bold">Final Cost:</Typography>
                      <Typography variant="h6" fontWeight="bold" color="success.main">
                        ₹{simulation.final_cost}
                      </Typography>
                    </Grid>
                  </Box>

                  <Button 
                    variant="contained" 
                    color="success" 
                    size="large" 
                    fullWidth 
                    onClick={handlePay}
                  >
                    Confirm Payment
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CheckoutPage;
