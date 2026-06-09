import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const Loader = ({ fullHeight = true }) => {
  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      height={fullHeight ? "100%" : "auto"}
      p={4}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loader;
