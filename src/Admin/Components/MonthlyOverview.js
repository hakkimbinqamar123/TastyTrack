import React, { useState, useEffect } from 'react';
import { IconButton, Typography, Box, Grid, Avatar, Card, CardHeader, CardContent } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

const MonthlyOverview = () => {
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalCategories, setTotalCategories] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        fetchTotalOrders();
        fetchTotalCategories();
        fetchTotalItems();
    }, []);

    const fetchTotalOrders = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/allOrderData', {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setTotalOrders(data.allOrders.length);
        } catch (error) {
            console.error('Error fetching total orders:', error);
            // Handle error
        }
    };

    const fetchTotalCategories = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/fetchcategories', {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setTotalCategories(data.length);
        } catch (error) {
            console.error('Error fetching total categories:', error);
            // Handle error
        }
    };

    const fetchTotalItems = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/totalFoodItems', {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setTotalItems(data.totalItemsCount)
        } catch (error) {
            console.error('Error fetching total items:', error);
            // Handle error
        }
    };

    const salesData = [
        {
            stats: totalOrders,
            title: 'Sales',
            color: 'primary',
            icon: <AccountCircle sx={{ fontSize: '1.75rem' }} />,
        },
        {
            stats: totalItems,
            title: 'Items',
            color: 'primary',
            icon: <LocalDiningIcon sx={{ fontSize: '1.75rem' }} />,
        },
        {
            stats: totalCategories,
            title: 'Categories',
            color: 'primary',
            icon: <LocalDiningIcon sx={{ fontSize: '1.75rem' }} />,
        },
        {
            stats: '2450', // Placeholder for revenue
            title: 'Revenue',
            color: 'primary',
            icon: <CurrencyRupeeIcon sx={{ fontSize: '1.75rem' }} />,
        },
    ];

    const renderStats = () => {
        return salesData.map((item, index) => (
            <Grid item xs={12} sm={3} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                        variant="rounded"
                        sx={{
                            mr: 3,
                            width: 44,
                            height: 44,
                            boxShadow: 3,
                            color: 'white',
                            backgroundColor: `${item.color}`,
                        }}
                    >
                        {item.icon}
                    </Avatar>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="caption">{item.title}</Typography>
                        <Typography variant="h6">{item.stats}</Typography>
                    </Box>
                </Box>
            </Grid>
        ));
    };

    return (
        <div style={{ padding: '20px' }}>
            <Card sx={{ position: 'relative', bgcolor: "#242B2E", color: "white" }}>
                <CardHeader
                    title="Monthly Overview"
                    action={
                        <IconButton size="small">
                            <MoreVertIcon />
                        </IconButton>
                    }
                    subheader={
                        <Typography variant="body2">
                            <Box component="span" sx={{ fontWeight: 600, mx: 2 }}>
                                Total 48.5% growth
                            </Box>
                            this month
                        </Typography>
                    }
                    titleTypographyProps={{
                        sx: {
                            mb: 2.5,
                            lineHeight: '2rem !important',
                            letterSpacing: '.15px !important',
                        },
                    }}
                />
                <CardContent sx={{ pt: (theme) => `${theme.spacing(3)} !important` }}>
                    <Grid container spacing={5}>
                        {renderStats()}
                    </Grid>
                </CardContent>
            </Card>
        </div>
    );
};

export default MonthlyOverview;
