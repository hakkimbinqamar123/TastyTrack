import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    TextField,
    TablePagination,
    Avatar,
    Card,
    CardHeader,
    Select,
    MenuItem,
} from '@mui/material';

const OrdersTable = () => {
    const [allOrders, setAllOrders] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/allOrderData', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                const ordersWithDeliveryAddress = data.allOrders.map(order => {
                    return {
                        ...order,
                        deliveryAddress: order.deliveryAddress || {},
                        order_data: order.order_data.map(item => ({
                            ...item,
                            status: item.status || 'pending', // Set a default value if status is not available
                        })),
                    };
                });

                setAllOrders(ordersWithDeliveryAddress || []);
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        };



        fetchOrderDetails();
    }, []);



    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleStatusChange = async (event, orderIndex, itemIndex) => {
        const orderId = allOrders[orderIndex]._id;
        const itemId = allOrders[orderIndex].order_data[itemIndex]._id;

        try {
            const response = await fetch(`http://localhost:5000/api/updateOrderStatus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId,
                    itemId,
                    status: event.target.value,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log(responseData);

            // Update the local state with the new status
            const updatedOrders = allOrders.map((order, currentIndex) => {
                if (currentIndex === orderIndex) {
                    const updatedOrderData = order.order_data.map((item, currentIndex) => {
                        if (currentIndex === itemIndex) {
                            item.status = event.target.value;
                        }
                        return item;
                    });
                    order.order_data = updatedOrderData;
                }
                return order;
            });

            // Set the state with the updated orders
            setAllOrders(updatedOrders);
        } catch (error) {
            console.error('Error updating order status:', error.message);
        }
    };

    const updateStatusInDatabase = async (orderId, itemId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/updateOrderStatus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId,
                    itemId,
                    status: newStatus,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log(responseData);
        } catch (error) {
            console.error('Error updating order status:', error.message);
        }
    };

    const filteredOrders = allOrders.filter((order) => {
        const searchTermLower = searchTerm.toLowerCase();

        return (
            order.email.toLowerCase().includes(searchTermLower) ||
            order.order_data instanceof Array &&
            order.order_data.some((item) =>
                (item.name && item.name.toLowerCase().includes(searchTermLower)) ||
                (item.qty && item.qty.toString().toLowerCase().includes(searchTermLower)) ||
                (item.size && item.size.toLowerCase().includes(searchTermLower)) ||
                (item.price && item.price.toString().toLowerCase().includes(searchTermLower)) ||
                (item.Order_date && item.Order_date.toLowerCase().includes(searchTermLower))
            )

        );
    });

    const totalItemCount = allOrders.reduce((acc, order) => acc + order.order_data.length, 0);

    return (
        <div className='p-5'>
            <Card className='mt-2' elevation={0}>
                <CardHeader title='Order Details' />
            </Card>
            <TextField
                label="Search"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow style={{ backgroundColor: '#E0E0E0' }}>
                            <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Order Date</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Item</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Qty</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Size</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Price</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Delivery Address</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((order, orderIndex) =>
                                order.order_data.map((item, itemIndex) => (
                                    <TableRow
                                        key={`${order._id}-${itemIndex}`}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>{order.email}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={item.status}
                                                onChange={(e) => handleStatusChange(e, orderIndex, itemIndex)}
                                            >
                                                <MenuItem value="pending">Pending</MenuItem>
                                                <MenuItem value="processing">Processing</MenuItem>
                                                <MenuItem value="delivered">Delivered</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell>{item.Order_date}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.qty}</TableCell>
                                        <TableCell>{item.size}</TableCell>
                                        <TableCell>{item.price}</TableCell>
                                        <TableCell>
                                            {`${order.deliveryAddress.fullName}, ${order.deliveryAddress.address}, ${order.deliveryAddress.city} ${order.deliveryAddress.zipCode}`}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}

                        {!filteredOrders.length && (
                            <TableRow>
                                <TableCell colSpan={8}>No order details available.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={totalItemCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </div>
    );
};

export default OrdersTable;
