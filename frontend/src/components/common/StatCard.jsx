import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const StatCard = ({ title, value, icon: Icon, color = 'primary.main' }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography color="text.secondary" variant="subtitle2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          {Icon && (
            <Box 
              sx={{ 
                backgroundColor: `${color}15`, 
                borderRadius: '50%', 
                p: 1.5, 
                display: 'flex' 
              }}
            >
              <Icon sx={{ color: color, fontSize: 32 }} />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
