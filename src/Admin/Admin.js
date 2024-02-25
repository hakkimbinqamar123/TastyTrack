import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, CssBaseline, Drawer, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, useMediaQuery } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import InboxIcon from '@mui/icons-material/Inbox';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Dashboard } from '@mui/icons-material';
import CreateProductForm from './Components/CreateProductForm';
import ProductTable from './Components/ProductTable';
import OrdersTable from './Components/OrdersTable';
import CustomersTable from './Components/CustomersTable';
import AdminDashboard from './Components/Dashboard';

const theme = createTheme();

const menu = [
    { name: "Dashboard", path: "/admin", icon: <DashboardIcon /> },
    { name: "Products", path: "/admin/products", icon: <DashboardIcon /> },
    { name: "Customers", path: "/admin/customers", icon: <DashboardIcon /> },
    { name: "Orders", path: "/admin/orders", icon: <DashboardIcon /> },
    { name: "AddProduct", path: "/admin/product/create", icon: <DashboardIcon /> },
    { name: "", path: " " },
];

const Admin = () => {
    const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
    const [sideBarVisible, setSideBarVisible] = useState(false);
    const navigate = useNavigate();

    // Check for admin key and token
    useEffect(() => {
        const admkey = sessionStorage.getItem('adminkey');
        const token = sessionStorage.getItem('token');
        console.log("Admin Key:", admkey);
        console.log("Token:", token);
    
        if (!admkey || !token) {
            // Redirect to login page or handle unauthorized access
            console.log("Redirecting to login page");
            navigate("/adminlogin");
        }
    }, [navigate]);
    

    const drawer = (
        <Box
            sx={{
                overflow: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%"
            }}
        >
            <>
                <List>
                    {menu.map((item, index) => (
                        <ListItem key={item.name} disablePadding onClick={() => navigate(item.path)}>
                            <ListItemButton>
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText>
                                    {item.name}
                                </ListItemText>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </>

            <List>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <AccountCircleIcon />
                        </ListItemIcon>
                        <ListItemText>Account</ListItemText>
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <ThemeProvider theme={theme}>
            <Grid container style={{ height: '100vh' }} className='flex '>
                <CssBaseline />
                <Grid item xs={isLargeScreen ? 2 : 12} className='border border-r-gray-300'>
                    {drawer}
                </Grid>
                <Grid item xs={isLargeScreen ? 10 : 12}>
                    <Routes>
                        <Route path='/' element={<AdminDashboard />} />
                        <Route path='/product/create' element={<CreateProductForm />} />
                        <Route path='/products' element={<ProductTable />} />
                        <Route path='/orders' element={<OrdersTable />} />
                        <Route path='/customers' element={<CustomersTable />} />
                    </Routes>
                </Grid>
            </Grid>
        </ThemeProvider>


    );
};

export default Admin;
