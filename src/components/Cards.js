import React, { useEffect, useRef, useState } from 'react';
import { useDispatchCart, useCart } from './ContextReducer';

export default function Cards(props) {
    let dispatch = useDispatchCart();
    let data = useCart();
    const priceRef = useRef();
    let options = props.options;
    let priceOptions = Object.keys(options);
    const [qty, setQty] = useState(1);
    const [size, setSize] = useState(priceOptions[0]); // set default size

    const handleAddToCart = async () => {
        let finalPrice = qty * parseInt(options[size]); 
        try {
            let response;
            const existingItem = data.find(item => item.id === props.foodItem._id);

            let requestData; // Variable to store the data being sent to the backend

            if (existingItem) {
                // If the item exists in the cart, update it
                requestData = {
                    name: props.foodItem.name,
                    qty: qty,
                    size: size,
                    price: finalPrice
                };

                response = await fetch("http://localhost:5000/api/update-cart-item", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(requestData),
                });
            } else {
                // If the item doesn't exist in the cart, add it
                requestData = {
                    email: localStorage.getItem('userEmail'),
                    name: props.foodItem.name,
                    qty: qty,
                    size: size,
                    price: finalPrice
                };
                console.log(requestData)

                response = await fetch("http://localhost:5000/api/add-to-cart", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(requestData)
                });
            }

            // Log the data being sent to the backend
            console.log("Data sent to backend:", requestData);

            console.log("Response:", response);

            if (response.ok) {
                const responseData = await response.json();
                if (responseData.success) {
                    // Update or add the item in the local context state
                    if (existingItem) {
                        dispatch({ type: "UPDATE", id: props.foodItem._id, qty: qty });
                    } else {
                        dispatch({
                            type: "ADD",
                            name: props.foodItem.name,
                            price: finalPrice,
                            qty: qty,
                            size: size
                        });
                    }
                } else {
                    console.error('Error:', responseData.message);
                    // Handle error message as needed
                }
            } else {
                console.error('Error:', response.statusText);
                // Handle non-200 response status as needed
            }
        } catch (error) {
            console.log("Fetch Error:", error);
            // Handle other fetch errors as needed
        }
    };

    useEffect(() => {
        setSize(priceRef.current.value);
    }, []);

    return (
        <div>
            <div>
                <div className="card mt-3" style={{ width: "18rem", maxHeight: "360px" }}>
                    <img src={props.foodItem.img} className="card-img-top" alt="..." style={{ height: "160px", objectFit: "fill" }} />
                    <div className="card-body">
                        <h5 className="card-title">{props.foodItem.name}</h5>
                        <div className='container w-100'>
                            <select className='m-2 h-100 bg-success' onChange={(e) => setQty(e.target.value)}>
                                {Array.from(Array(6), (e, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>

                            <select className='m-2 h-100 bg-success rounded' ref={priceRef} onChange={(e) => setSize(e.target.value)}>
                                {priceOptions.map(
                                    (data) => {
                                        return <option key={data} value={data}>{data}</option>
                                    }
                                )}
                            </select>
                            <div className='d-inline h-100 fs-5'>
                                Rs:{qty * parseInt(options[size])}/-
                            </div>
                        </div>
                        <hr></hr>
                        <button className={'btn btn-success justify-center ms-2'} onClick={handleAddToCart}>Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
