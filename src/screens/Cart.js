import React, { useEffect, useState } from 'react';
import trash from "../trash.svg";
import { useCart, useDispatchCart } from '../components/ContextReducer';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
    const data = useCart();
    const dispatch = useDispatchCart();
    const [orderData, setOrderData] = useState([]);
    const [isCartEmpty, setIsCartEmpty] = useState(false);
    const [error, setError] = useState(null);
    let globalId;
    let globalEmail;
    const navigate = useNavigate()
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
            globalId = responseData.cart._id;
            globalEmail = responseData.cart.email;

            // Assuming items are nested inside the "cart" property
            setOrderData(responseData.cart.items);
        } catch (error) {
            console.error('Fetch error:', error.message);
        }
    };

    const handleRemoveFromCart = async (food, index) => {
        try {
            const response = await fetch("http://localhost:5000/api/remove-from-cart", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: localStorage.getItem("userEmail"),
                    name: food.name,
                    size: food.size
                })
            });

            if (response.ok) {
                dispatch({ type: "REMOVE", index: index });
            } else {
                console.error('Error removing item from the cart:', response.statusText);
                setError(`Error removing item from the cart: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error removing item from the cart:', error);
            setError(`Error removing item from the cart: ${error.message}`);
        }
    };

    let totalPrice = orderData.reduce((total, food) => total + food.price, 0);

    const checkoutHandler = () => {
        navigate("/checkout")
    };

    useEffect(() => {
        fetchCartData(); // Call fetchCartData when the component mounts or when data changes
        setIsCartEmpty(orderData.length === 0);
    }, [orderData]);


    return (
        <div>
            {isCartEmpty ? (
                <div style={{ color: "white" }} className='m-5 w-100 text-center fs-3'>
                    This Cart is Empty!!
                </div>
            ) : (
                <div className='container m-auto mt-5 table-responsive table-responsive-sm table-responsive-md'>
                    <table className='table table-hover'>
                        <thead className='text-success' fs-4>
                            <tr>
                                <th scope='col'>No.</th>
                                <th scope='col'></th>
                                <th scope='col'>Name</th>
                                <th scope='col'>Quantity</th>
                                <th scope='col'>Option</th>
                                <th scope='col'>Amount</th>
                             
                            </tr>
                        </thead>
                        <tbody>
                            {orderData.map((food, index) => (
                                <tr key={index}>
                                    <th scope='row'>{index + 1}</th>
                                    <td>{food.name}</td>
                                    <td>{food.qty}</td>
                                    <td>{food.size}</td>
                                    <td>{food.price}</td>
                                    <td>
                                        <button type='button' className='btn p-0' onClick={() => handleRemoveFromCart(food, index)}>
                                            <img src={trash} style={{ width: '20px', height: '20px' }} alt="Delete" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div>
                        <h1 className='fs-2' style={{ color: "white" }}>Total Price: {totalPrice}/-</h1>
                    </div>
                    <div>
                        {/* Pass food._id directly to checkoutHandler */}
                        <button className='btn bg-success mt-5' onClick={checkoutHandler}> Check Out </button>
                    </div>
                    {error && <div style={{ color: 'red' }}>Error: {error}</div>}
                </div>
            )}
        </div>
    );
}