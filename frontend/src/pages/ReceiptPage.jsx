import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { api } from '../api/endpoints';
import { useSnackbar } from '../context/SnackbarContext';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

const ReceiptPage = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const res = await api.transactions.getReceipt(transactionId);
        setReceipt(res.data);
      } catch (error) {
        showSnackbar('Failed to load receipt', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchReceipt();
  }, [transactionId]);

  if (loading) return <Loader />;
  if (!receipt) return <EmptyState message="Receipt Not Found" description="The requested transaction could not be located." />;

  return (
    <Box display="flex" justifyContent="center" py={4}>
      <Card elevation={3} sx={{ maxWidth: 600, width: '100%', borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
            <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 1 }} />
            <Typography variant="h4" fontWeight="bold">Payment Successful</Typography>
            <Typography color="text.secondary">Thank you for your business!</Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2} mb={3}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Transaction ID</Typography>
              <Typography variant="body1" fontWeight="bold">{receipt.transaction_id.split('-')[0]}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Date Paid</Typography>
              <Typography variant="body1" fontWeight="bold">
                {new Date(receipt.payment_date).toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">Vehicle License Plate</Typography>
              <Typography variant="body1" fontWeight="bold">{receipt.vehicle}</Typography>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom mt={4}>Itemized Services</Typography>
          <Box bgcolor="background.default" p={2} borderRadius={1} mb={4}>
            {receipt.items.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No parts installed.</Typography>
            ) : (
              receipt.items.map((item, index) => (
                <Box key={index} mb={2}>
                  <Grid container justifyContent="space-between">
                    <Typography variant="body1" fontWeight="bold">{item.issue}</Typography>
                    <Typography variant="body1">₹{item.amount}</Typography>
                  </Grid>
                  <Typography variant="body2" color="text.secondary">
                    {item.component} (Qty: {item.quantity})
                  </Typography>
                  {index < receipt.items.length - 1 && <Divider sx={{ my: 1 }} />}
                </Box>
              ))
            )}
          </Box>

          <Grid container justifyContent="space-between" mb={1}>
            <Typography color="text.secondary">Parts Total:</Typography>
            <Typography>₹{receipt.total_amount}</Typography>
          </Grid>
          <Grid container justifyContent="space-between" mb={1}>
            <Typography color="text.secondary">Labor Charges:</Typography>
            <Typography>₹{receipt.labor_charges}</Typography>
          </Grid>
          <Grid container justifyContent="space-between" mb={2}>
            <Typography color="text.secondary">Other Charges:</Typography>
            <Typography>₹{receipt.other_charges}</Typography>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="bold">Total Paid:</Typography>
            <Typography variant="h4" fontWeight="bold" color="success.main">
              ₹{receipt.final_cost}
            </Typography>
          </Grid>

          <Box mt={5} display="flex" justifyContent="center">
            <Button variant="outlined" size="large" onClick={() => navigate('/')}>
              Return to Dashboard
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReceiptPage;
