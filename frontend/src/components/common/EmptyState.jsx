import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FolderOffIcon from '@mui/material/Icon';

const EmptyState = ({ message = "No Data Found", description = "Get started by adding some records.", icon: Icon }) => {
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center" 
      height="100%"
      p={6}
      textAlign="center"
      color="text.secondary"
    >
      {Icon && <Icon sx={{ fontSize: 60, mb: 2, color: 'text.disabled' }} />}
      <Typography variant="h6" gutterBottom color="text.primary">
        {message}
      </Typography>
      <Typography variant="body2">
        {description}
      </Typography>
    </Box>
  );
};

export default EmptyState;
