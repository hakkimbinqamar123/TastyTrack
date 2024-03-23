// MyOrder.js

import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function MyOrder() {
    const [orderData, setOrderData] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchMyOrder = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/myorderData", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: localStorage.getItem('userEmail')
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log(responseData);

            setOrderData(responseData.orderData || []);
        } catch (error) {
            console.error('Fetch error:', error.message);
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            const response = await fetch("http://localhost:5000/api/cancelOrder", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ orderId }),
            });
    
            console.log(orderId);
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            // Ensure that orderData is an array before using the filter method
            const updatedOrderData = Array.isArray(orderData) ? orderData.filter(order => order._id !== orderId) : [];
            alert("Order cancelled!")
            fetchMyOrder()
            setOrderData(updatedOrderData);
    
            setSelectedOrder(null);
        } catch (error) {
            console.error('Cancel Order error:', error.message);
        }
    };
    
    

    const handleUpdateOrder = async (orderId) => {
        console.log(`Update order with ID: ${orderId}`);
    };

    useEffect(() => {
        fetchMyOrder();
    }, []);

    return (
        <div>
            <Navbar /><br /><br />

            <div className='container'>
                {Array.isArray(orderData.order_data) && orderData.order_data.length > 0 && (
                    <div className="row">
                        {orderData.order_data.map((order, index) => (
                            <div key={index} className="col-md-6 mb-3">
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="card-title">{order.Order_date}</h5>
                                        <p className="card-text">Status: {order.status}</p>
                                    </div>
                                    <div className="card-body">
                                        <div className="d-flex">
                                            <div>
                                                <img src={order.img} alt={order.name} style={{ width: '140px', height: '140px' }} />
                                            </div>
                                            <div className="ms-3">
                                                <h6 className="card-subtitle mb-2 text-muted">Name: {order.name}</h6>
                                                <p className="card-text">Quantity: {order.qty}</p>
                                                <p className="card-text">Size: {order.size}</p>
                                                <p className="card-text">Price: ₹{order.price}/-</p>
                                                {order.status === 'pending' && (
                                                    <div className="card-footer">
                                                        <button
                                                            className="btn btn-danger me-2"
                                                            onClick={() => handleCancelOrder(order._id)}
                                                        >
                                                            Cancel Order
                                                        </button>
                                                        {/* <button
                                                            className="btn btn-primary"
                                                            onClick={() => handleUpdateOrder(order._id)}
                                                        >
                                                            Update Order
                                                        </button> */}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
