import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, CssBaseline, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Menu, MenuItem, DialogContentText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminDashboard from './Components/Dashboard';
import CreateProductForm from './Components/CreateProductForm';
import ProductTable from './Components/ProductTable';
import OrdersTable from './Components/OrdersTable';
import CustomersTable from './Components/CustomersTable';
import UpdateFoodItemForm from './Components/UpdateFood';

const theme = createTheme();

const menu = [
    { name: "Dashboard", path: "/admin", icon: <DashboardIcon /> },
    { name: "Products", path: "/admin/products", icon: <DashboardIcon /> },
    { name: "Customers", path: "/admin/customers", icon: <DashboardIcon /> },
    { name: "Orders", path: "/admin/orders", icon: <DashboardIcon /> },
    { name: "AddProduct", path: "/admin/product/create", icon: <DashboardIcon /> },
    { name: "Categories", path: "", icon: <DashboardIcon /> },
];

const Admin = () => {
    const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [anchorEl, setAnchorEl] = useState(null); // State for anchor element of the menu
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
    const navigate = useNavigate();

    // Check for admin key and token
    useEffect(() => {
        const admkey = sessionStorage.getItem('adminkey');
        const token = sessionStorage.getItem('token');
    
        if (!admkey || !token) {
            // Redirect to login page or handle unauthorized access
            console.log("Redirecting to login page");
            navigate("/adminlogin");
        }
    }, [navigate]);

    const handleCategoryDialogClose = () => {
        setOpenCategoryDialog(false);
    };

    const handleCategoryDialogOpen = () => {
        setOpenCategoryDialog(true);
    };

    const handleCategoryNameChange = (event) => {
        setCategoryName(event.target.value);
    };

    const addCategory = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ categoryName })
            });
            console.log(JSON.stringify({ categoryName }))
            if (response.ok) {
                alert("Category added successfully")
                console.log('Category added successfully');
                setCategoryName('');
                handleCategoryDialogClose();
            } else {
                console.error('Failed to add category');
            }
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    // Function to handle logout
    const handleLogout = () => {
        setOpenLogoutDialog(true);
    };

    const confirmLogout = () => {
        // Clear session storage or perform any necessary logout actions
        sessionStorage.clear();
        navigate("/adminlogin");
    };

    const cancelLogout = () => {
        setOpenLogoutDialog(false);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

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
                        <ListItem key={item.name} disablePadding onClick={() => item.name === "Categories" ? handleCategoryDialogOpen() : navigate(item.path)}>
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
                    <ListItemButton onClick={handleMenuOpen}>
                        <ListItemIcon>
                            <AccountCircleIcon />
                        </ListItemIcon>
                        <ListItemText>Account</ListItemText>
                    </ListItemButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
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
                    <Route path='/product/update' element={<UpdateFoodItemForm />} />
                </Routes>
                </Grid>
            </Grid>

            <Dialog open={openCategoryDialog} onClose={handleCategoryDialogClose}>
                <DialogTitle>Add Category</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="categoryName"
                        label="Category Name"
                        type="text"
                        fullWidth
                        value={categoryName}
                        onChange={handleCategoryNameChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCategoryDialogClose}>Cancel</Button>
                    <Button onClick={addCategory}>Add</Button>
                </DialogActions>
            </Dialog>

            {/* Logout Confirmation Dialog */}
            <Dialog open={openLogoutDialog} onClose={cancelLogout}>
                <DialogTitle>Logout</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to logout?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelLogout}>Cancel</Button>
                    <Button onClick={confirmLogout} autoFocus>
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
        
    );
};

export default Admin;
