import React, { useEffect, useState } from 'react';
import trash from "../trash.svg";
import { useCart, useDispatchCart } from '../components/ContextReducer';

export default function Cart() {
    const data = useCart();
    const dispatch = useDispatchCart();
    const [orderData, setOrderData] = useState({});
    const [isCartEmpty, setIsCartEmpty] = useState(false);

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

            setOrderData(responseData);
        } catch (error) {
            console.error('Fetch error:', error.message);
            // Handle error gracefully (e.g., show a user-friendly message)
            // setErrorState(error.message);
        }
    };

    const handleRemoveFromCart = async (food, index) => {
        // Send a request to the server to remove the item from the database
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
                // If the server successfully removes the item, update the local state
                dispatch({ type: "REMOVE", index: index });
            } else {
                console.error('Error removing item from the cart:', response.statusText);
                // Handle non-200 response status as needed
            }
        } catch (error) {
            console.error('Error removing item from the cart:', error);
            // Handle other fetch errors as needed
        }
    };

    const handleCheckOut = async () => {
        try {
            let userEmail = localStorage.getItem("userEmail");
            console.log("email of user: ", userEmail);

            const response = await fetch("http://localhost:5000/api/orderData", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    order_data: data,
                    email: userEmail,
                    order_date: new Date().toDateString()
                })
            });

            if (response.ok) {
                // Assuming your reducer handles the "DROP" action
                dispatch({ type: "DROP" });
                alert("Order placed successfully!");
            } else {
                console.error('Error placing order:', response.statusText);
                // Handle non-200 response status as needed
                alert("Failed to place the order. Please try again.");
            }
        } catch (error) {
            console.error('Error placing order:', error);
            // Handle other fetch errors as needed
            alert("An error occurred while placing the order. Please try again.");
        }
    };

    let totalPrice = data.reduce((total, food) => total + food.price, 0);

    useEffect(() => {
        fetchMyOrder();
        setIsCartEmpty(data.length === 0);
    }, [data]); // Include data as a dependency for the useEffect

    return (
        <div>
            {isCartEmpty ? (
                <div className='m-5 w-100 text-center fs-3'>This Cart is Empty!!</div>
            ) : (
                <div className='container m-auto mt-5 table-responsive table-responsive-sm table-responsive-md'>
                    <table className='table table-hover'>
                        <thead className='text-success' fs-4>
                            <tr>
                                <th scope='col'>#</th>
                                <th scope='col'>Name</th>
                                <th scope='col'>Quantity</th>
                                <th scope='col'>Option</th>
                                <th scope='col'>Amount</th>
                                <th scope='col'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((food, index) => (
                                <tr key={index}>
                                    <th scope='row'>{index + 1}</th>
                                    <td>{food.name}</td>
                                    <td>{food.qty}</td>
                                    <td>{food.size}</td>
                                    <td>{food.price}</td>
                                    <td><button type='button' className='btn p-0'><img src={trash} style={{ width: '20px', height: '20px' }} alt="Delete" onClick={() => handleRemoveFromCart(food, index)} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div><h1 className='fs-2'>Total Price: {totalPrice}/-</h1></div>
                    <div>
                        <button className='btn bg-success mt-5' onClick={handleCheckOut}> Check Out </button>
                    </div>
                </div>
            )}
        </div>
    );
}
