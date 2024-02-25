import React from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { Avatar, Box, Card, CardContent, Grid, IconButton, Typography } from '@mui/material';
import { CardHeader } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const salesData = [
    {
        stats: '245k',
        title: 'Sales',
        color: 'primary',
        icon: <AccountCircle sx={{ fontSize: '1.75rem' }} />,
    },
    {
        stats: '1.5k',
        title: 'Items',
        color: 'primary',
        icon: <LocalDiningIcon sx={{ fontSize: '1.75rem' }} />,
    },
    {
        stats: '245k',
        title: 'Restaurants',
        color: 'primary',
        icon: <LocalDiningIcon sx={{ fontSize: '1.75rem' }} />,
    },
    {
        stats: '245k',
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
                        backgroundColor: `${item.color}`, // Corrected the property name
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

const MonthlyOverview = () => {
    return (
        <div style={{ padding: '20px' }}>
            <Card sx={{position: 'relative', bgcolor:"#242B2E", color:"white"}}>
                <CardHeader
                    title="Monthly Overview"
                    action={
                        <IconButton size="small">
                            <MoreVertIcon />
                        </IconButton>
                    }
                    subheader={
                        <Typography variant="body2">
                            <Box component="span" sx={{ fontWeight: 600, mx:2}}>
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
