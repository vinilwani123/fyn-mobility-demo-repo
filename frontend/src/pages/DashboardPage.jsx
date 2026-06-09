import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import WarningIcon from '@mui/icons-material/Warning';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import StatCard from '../components/common/StatCard';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { api } from '../api/endpoints';
import { useSnackbar } from '../context/SnackbarContext';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const showSnackbar = useSnackbar();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, monthlyRes, dailyRes, yearlyRes] = await Promise.all([
          api.dashboard.getSummary(),
          api.revenue.getMonthly(),
          api.revenue.getDaily(),
          api.revenue.getYearly()
        ]);

        setSummary(summaryRes.data);
        
        // Format dates for charts
        setMonthlyData(monthlyRes.data.map(d => ({
          name: new Date(d.month).toLocaleString('default', { month: 'short', year: 'numeric' }),
          revenue: parseFloat(d.total)
        })));
        
        setDailyData(dailyRes.data.map(d => ({
          name: new Date(d.date).toLocaleDateString(),
          revenue: parseFloat(d.total)
        })));
        
        setYearlyData(yearlyRes.data.map(d => ({
          name: new Date(d.year).getFullYear().toString(),
          revenue: parseFloat(d.total)
        })));

      } catch (error) {
        showSnackbar('Failed to load dashboard data', 'error');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [showSnackbar]);

  if (loading) return <Loader />;
  if (!summary) return <EmptyState message="No Dashboard Data" description="Check backend connection." />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      
      {/* Top Row: Stat Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Vehicles" value={summary.total_vehicles} icon={DirectionsCarIcon} color="primary.main" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Components" value={summary.total_components} icon={BuildIcon} color="secondary.main" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Open Issues" value={summary.open_issues} icon={WarningIcon} color="error.main" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Revenue" value={`₹${summary.total_revenue.toLocaleString()}`} icon={AttachMoneyIcon} color="success.main" />
        </Grid>
      </Grid>

      {/* Middle Row: Monthly Revenue */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Monthly Revenue</Typography>
          <Box height={300}>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `₹${value}`} />
                  <RechartsTooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#1976d2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No Monthly Data" description="No paid transactions found." />
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Bottom Row: Daily & Yearly Revenue */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Daily Revenue</Typography>
              <Box height={250}>
                {dailyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `₹${value}`} />
                      <RechartsTooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                      <Line type="monotone" dataKey="revenue" stroke="#2e7d32" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState message="No Daily Data" description="No paid transactions found." />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Yearly Revenue</Typography>
              <Box height={250}>
                {yearlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={yearlyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `₹${value}`} />
                      <RechartsTooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                      <Bar dataKey="revenue" fill="#dc004e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState message="No Yearly Data" description="No paid transactions found." />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
