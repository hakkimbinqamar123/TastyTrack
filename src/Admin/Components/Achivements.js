import React from 'react';
import { Button } from 'react-bootstrap';
import { Card, CardContent, Typography } from '@mui/material';

const Achievements = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Card className='' style={{ position: 'relative', backgroundColor: 'black', color: 'white', height: '205px' }}>
        {/* Adjust the 'height' value to your desired height */}
        <CardContent>
          <Typography variant='h6' sx={{ letterSpacing: '.25px' }}>
            Shop With Zosh
          </Typography>
          <Typography variant='body2'>Congratulations</Typography>
          <Typography variant='h5' sx={{ my: 3.1 }}>
            420
          </Typography>

          <Button
            size='small'
            variant='contained'
            style={{ backgroundColor: 'blue', color: 'white' }}
          >
            View Sales
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Achievements;
