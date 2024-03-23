import Navbar from '../components/Navbar';
import React, { useEffect, useState } from 'react';
import trash from "../trash.svg";
import { useCart, useDispatchCart } from '../components/ContextReducer';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

export default function Checkout() {
    const data = useCart();
    const dispatch = useDispatchCart();
    const [orderData, setOrderData] = useState([]);
    const [isCartEmpty, setIsCartEmpty] = useState(false);
    const [error, setError] = useState(null);
    const [deliveryAddress, setDeliveryAddress] = useState({
        fullName: '',
        address: '',
        city: '',
        zipCode: '',
        mobile: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartData = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/get-cart", {
                    method: "POST",
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

                if (responseData.success === false) {
                    console.error('Cart not found:', responseData.message);
                } else if (responseData.cart && responseData.cart.items) {
                    setOrderData(responseData.cart.items);
                } else {
                    console.error('Invalid cart data structure:', responseData);
                }
            } catch (error) {
                console.error('Fetch error:', error.message);
            }
        };

        fetchCartData();
    }, []);

    useEffect(() => {
        setIsCartEmpty(orderData.length === 0);
    }, [orderData]);

    const totalPrice = orderData.reduce((total, food) => total + Number(food.price), 0);
    const amount = totalPrice * 100;
    const currency = "INR";
    const receiptId = "qwsaq1";

    const paymentHandler = async (e) => {
        try {
            if (!window.Razorpay) {
                console.error('Razorpay not available');
                return;
            }

            const userEmail = localStorage.getItem("userEmail");

            const response = await fetch("http://localhost:5000/api/payment", {
                method: "POST",
                body: JSON.stringify({
                    amount,
                    currency,
                    receipt: receiptId,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const order = await response.json();
            console.log(order);

            const orderDataForBackend = orderData.map((food) => ({
                name: food.name,
                qty: food.qty,
                size: food.size,
                price: food.price,
                img: food.img,
                _id: food._id,
            }));

            const options = {
                key: "rzp_test_jhVZHMiI19IjHT",
                amount,
                currency,
                name: "TastyTrack",
                description: "Test Transaction",
                image: "https://example.com/your_logo",
                order_id: order.id,
                handler: async function (response) {
                    const body = {
                        ...response,
                        email: userEmail,
                        amount: amount,
                        deliveryAddress: deliveryAddress,
                        order_data: orderDataForBackend,
                    };

                    console.log(body.order_data);

                    const validateRes = await fetch(
                        "http://localhost:5000/api/verify-payment",
                        {
                            method: "POST",
                            body: JSON.stringify(body),
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    const jsonRes = await validateRes.json();
                    console.log(jsonRes);

                    handleCheckOut();
                },
                prefill: {
                    name: "Web Dev Matrix",
                    email: "webdevmatrix@example.com",
                    contact: "9000000000",
                },
                notes: {
                    address: "Razorpay Corporate Office",
                },
                theme: {
                    color: "#3399cc",
                },
            };

            var rzp1 = new window.Razorpay(options);

            rzp1.on("payment.failed", function (response) {
                alert(response.error.code);
                alert(response.error.description);
                alert(response.error.source);
                alert(response.error.step);
                alert(response.error.reason);
                alert(response.error.metadata.order_id);
                alert(response.error.metadata.payment_id);
            });

            rzp1.open();
            e.preventDefault();
        } catch (error) {
            console.error('Error in paymentHandler:', error);
        }
    };

    const handleCheckOut = async () => {
        try {
            let userEmail = localStorage.getItem("userEmail");

            if (!userEmail) {
                console.error('User email not found');
                setError('User email not found');
                return;
            }

            const orderDataForBackend = orderData.map((food) => ({
                name: food.name,
                qty: food.qty,
                size: food.size,
                price: food.price,
                img: food.img,
                _id: food._id,
            }));

            const response = await fetch("http://localhost:5000/api/orderData", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: userEmail,
                    order_data: orderDataForBackend,
                    deliveryAddress: deliveryAddress,
                })
            });

            console.log(JSON.stringify({
                email: userEmail,
                order_data: orderDataForBackend,
                deliveryAddress: deliveryAddress,
            }));

            if (response.ok) {
                dispatch({ type: "DROP" });
                alert("Order placed successfully.");
                navigate("/myorder");
            } else {
                console.error('Error placing order:', response.statusText);
                setError(`Error placing order: ${response.statusText}`);
                alert("Failed to place the order. Please try again.");
            }
        } catch (error) {
            console.error('Error placing order:', error);
            setError(`Error placing order: ${error.message}`);
            alert("An error occurred while placing the order. Please try again.");
        }
    };

    return (
        <div>
            <Navbar />
            <section className="h-100 h-custom" style={{ backgroundColor: '#eee' }}>
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col">
                            <div className="card">
                                <div className="card-body p-4">
                                    <div className="row">
                                        <div className="col-lg-7">
                                            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '16px' }}>Cart Details</p>
                                            <hr />
                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                <div>
                                                    <p className="mb-1">Shopping cart</p>
                                                </div>
                                                <div>
                                                    <p className="mb-0"><span className="text-muted">Total Price: {totalPrice}/-</span> </p>
                                                </div>
                                            </div>

                                            {orderData.map((food, index) => (
                                                <div className="card mb-3" key={index}>
                                                    <div className="card-body">
                                                        <div className="d-flex justify-content-between">
                                                            <div className="d-flex flex-row align-items-center">
                                                                <div>
                                                                    <img src={food.img} className="img-fluid rounded-3" alt="Shopping item" style={{ width: 65 }} />
                                                                </div>
                                                                <div className="ms-3">
                                                                    <h5>Item: {food.name}</h5>
                                                                    <p className="small mb-0">Qty: {food.qty}</p>
                                                                </div>
                                                            </div>
                                                            <div className="d-flex flex-row align-items-center">
                                                                <div style={{ width: 100 }}>
                                                                    <p className="fw-normal mb-0">Size: {food.size}</p>
                                                                    <p className="mb-0">Price : {food.price}</p>
                                                                </div>
                                                                <div style={{ width: 80 }}>
                                                                    <a href="#!" style={{ color: '#cecece' }}><i className="fas fa-trash-alt" /></a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="col-lg-5">
                                            <div className="card bg-white text-white rounded-3">

                                                <div className="card-body">
                                                    <h3 style={{ color: 'black' }}>Delivery Address</h3>
                                                    <form className="mt-4">
                                                        <div className="form-outline form-white mb-4">
                                                            <input
                                                                type="text"
                                                                id="fullName"
                                                                className="form-control form-control-lg"
                                                                placeholder="Full Name"
                                                                value={deliveryAddress.fullName}
                                                                onChange={(e) =>
                                                                    setDeliveryAddress({
                                                                        ...deliveryAddress,
                                                                        fullName: e.target.value,
                                                                    })
                                                                }
                                                                required
                                                            />
                                                        </div>
                                                        <div className="form-outline form-white mb-4">
                                                            <input
                                                                type="text"
                                                                id="address"
                                                                className="form-control form-control-lg"
                                                                placeholder="Address"
                                                                value={deliveryAddress.address}
                                                                onChange={(e) =>
                                                                    setDeliveryAddress({
                                                                        ...deliveryAddress,
                                                                        address: e.target.value,
                                                                    })
                                                                }
                                                                required
                                                            />
                                                        </div>
                                                        <div className="form-outline form-white mb-4">
                                                            {/* ... other address fields ... */}
                                                        </div>
                                                        <div className="form-outline form-white mb-4">
                                                            <input
                                                                type="text"
                                                                id="city"
                                                                className="form-control form-control-lg"
                                                                placeholder="City"
                                                                value={deliveryAddress.city}
                                                                onChange={(e) =>
                                                                    setDeliveryAddress({
                                                                        ...deliveryAddress,
                                                                        city: e.target.value,
                                                                    })
                                                                }
                                                                required
                                                            />
                                                        </div>
                                                        <div className="row mb-4">
                                                            <div className="col-md-6">
                                                                <div className="form-outline form-white">
                                                                    <input
                                                                        type="text"
                                                                        id="zipCode"
                                                                        className="form-control form-control-lg"
                                                                        placeholder="Zip Code"
                                                                        value={deliveryAddress.zipCode}
                                                                        onChange={(e) =>
                                                                            setDeliveryAddress({
                                                                                ...deliveryAddress,
                                                                                zipCode: e.target.value,
                                                                            })
                                                                        }
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-outline form-white">
                                                                    <input
                                                                        type="text"
                                                                        id="mobile"
                                                                        className="form-control form-control-lg"
                                                                        placeholder="Mobile"
                                                                        value={deliveryAddress.mobile}
                                                                        onChange={(e) =>
                                                                            setDeliveryAddress({
                                                                                ...deliveryAddress,
                                                                                mobile: e.target.value,
                                                                            })
                                                                        }
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <hr className="my-4" />
                                                        <button type="button" className="btn bg-white btn-info btn-lg" onClick={paymentHandler}>
                                                            <div className="d-flex justify-content-between">
                                                                <span>Continue to Payment</span>
                                                                <span><i className="fas fa-long-arrow-alt-right ms-2" /></span>
                                                            </div>
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer/>
        </div>
    );
}
