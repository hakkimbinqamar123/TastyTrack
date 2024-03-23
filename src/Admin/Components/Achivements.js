import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Card, CardContent, Typography } from '@mui/material';

const Achievements = () => {
  const [totalCustomers, setTotalCustomers] = useState(0);

  useEffect(() => {
    fetchTotalCustomers();
  }, []);

  const fetchTotalCustomers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/viewallcustomers', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const customers = await response.json();
      setTotalCustomers(customers.length);
      // const response = await fetch('http://localhost:5000/api/viewallcustomers');
      // const customers = await response.json();
      // console.log(customers)
      // setTotalCustomers(customers.length);
    } catch (error) {
      console.error('Error fetching total customers:', error);
      // Handle error
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Card className='' style={{ position: 'relative', backgroundColor: 'black', color: 'white', height: '205px' }}>
        {/* Adjust the 'height' value to your desired height */}
        <CardContent>
          <Typography variant='h6' sx={{ letterSpacing: '.25px' }}>
            Eat with TastyTrack
          </Typography>
          <Typography variant='body2'>Total customers</Typography>
          <Typography variant='h5' sx={{ my: 3.1 }}>
            {totalCustomers}
          </Typography>

          <Button
            size='small'
            variant='contained'
            style={{ backgroundColor: 'blue', color: 'white' }}
            href='/admin/customers'
          >
            View Customers
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Achievements;
