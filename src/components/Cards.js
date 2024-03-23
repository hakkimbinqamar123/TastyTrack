import React, { useEffect, useRef, useState } from 'react';
import { useDispatchCart, useCart } from './ContextReducer';

export default function Cards(props) {
    let dispatch = useDispatchCart();
    let data = useCart();
    const priceRef = useRef();
    let options = props.foodItem.options || [];
    let priceOptions = Object.keys(options);
    const [qty, setQty] = useState(1);
    const [size, setSize] = useState(priceOptions[0]); // set default size
    const [rating, setRating] = useState(-1); // Default rating to -1 to indicate unrated
    const [showRatingPopup, setShowRatingPopup] = useState(false); // State for showing rating popup
    const [averageRating, setAverageRating] = useState(null); // State for average rating

    // Fetch average rating when component mounts
    useEffect(() => {
        const fetchAverageRating = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/average-rating/${props.foodItem._id}`);
                if (response.ok) {
                    const data = await response.json();
                    setAverageRating(data.averageRating);
                } else {
                    console.error('Error:', response.statusText);
                }
            } catch (error) {
                console.error('Fetch Error:', error);
            }
        };

        fetchAverageRating();
    }, [props.foodItem._id]);

    const handleAddToCart = async () => {
        // Calculate the final price based on quantity and selected size
        let finalPrice = qty * (priceRef.current?.selectedOptions[0]?.getAttribute('data-price') || 0);

        // Rest of the function remains unchanged
        try {
            let response;
            const existingItem = data.find(item => item.id === props.foodItem._id);

            let requestData; // Variable to store the data being sent to the backend

            if (existingItem) {
                // If the item exists in the cart, update it
                requestData = {
                    id: props.foodItem._id,
                    name: props.foodItem.name,
                    qty: qty,
                    size: size,
                    price: finalPrice,
                    img: props.foodItem.img,
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
                    price: finalPrice,
                    img: props.foodItem.img,
                };

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
                        // Make sure finalPrice is included when adding to the cart
                        dispatch({
                            type: "ADD",
                            name: props.foodItem.name,
                            price: finalPrice,
                            qty: qty,
                            size: size,
                            img: props.foodItem.img,
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

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const submitRating = async () => {
        // Rest of the function remains unchanged
        try {
            let response;
            response = await fetch("http://localhost:5000/api/submit-rating", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    itemId: props.foodItem._id,
                    userEmail: localStorage.getItem('userEmail'),
                    rating: rating
                })
            });
            console.log(JSON.stringify({
                itemId: props.foodItem._id,
                userEmail: localStorage.getItem('userEmail'),
                rating: rating
            }))

            if (response.ok) {
                const responseData = await response.json();
                if (responseData.success) {
                    alert("Rating submitted successfully")
                    console.log("Rating submitted successfully");
                    // Optionally, you can close the rating popup after successful submission
                    setShowRatingPopup(false);
                } else {
                    console.error('Error:', responseData.message);
                    // Handle error in rating submission
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

    const handleRatingPopup = () => {
        setShowRatingPopup(true);
    };

    const closeRatingPopup = () => {
        setShowRatingPopup(false);
    };

    return (
        <div>
            <div>
                <div className="card mt-3" style={{ width: "18rem", maxHeight: "360px" }}>
                    <img src={props.foodItem.img} className="card-img-top" alt="..." style={{ height: "160px", objectFit: "fill" }} />
                    <div className="card-body">
                        <h5 className="card-title">{props.foodItem.name}</h5>
                        {/* Display average rating as stars */}
                        {averageRating !== null && (
                            <div>
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} role="img" aria-label="star" style={{ fontSize: "20px" }}>
                                        {i < averageRating ? "⭐️" : "☆"}
                                    </span>
                                ))}
                            </div>
                        )}
                        <div className='container w-100'>
                            <select className='m-2 h-100 bg-success' onChange={(e) => setQty(e.target.value)}>
                                {Array.from(Array(6), (e, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                            <select className='m-2 h-100 bg-success rounded' ref={priceRef} onChange={(e) => setSize(e.target.value)}>
                                {options.map((data) => {
                                    return <option key={data._id} value={data.type} data-price={data.price}>{data.type}</option>
                                })}
                            </select>
                            
                            <div className='d-inline h-100 fs-5'>
                                Rs:{qty * parseFloat(priceRef.current?.selectedOptions[0]?.getAttribute('data-price') || 0).toFixed(2)}/-
                            </div>
                        </div>
                        <hr></hr>
                        <button className={'btn btn-success justify-center ms-2'} onClick={handleAddToCart}>Add to Cart</button>
                        {/* Add Rating Button */}
                        <button   className="btn btn-success justify-center ms-2" onClick={handleRatingPopup}>Add Rating</button>
                    </div>
                </div>
            </div>
            {showRatingPopup && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)', maxWidth: '80%' }}>
                        <button style={{ position: 'absolute', top: '10px', right: '10px', padding: '5px 10px', cursor: 'pointer', border: 'none', backgroundColor: 'transparent' }} onClick={closeRatingPopup}>Close</button>
                        <h2 style={{ marginBottom: '20px' }}>Rate {props.foodItem.name}</h2>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            {[...Array(5)].map((_, i) => (
                                <span key={i} role="img" aria-label="star" style={{ fontSize: "36px", cursor: 'pointer' }} onClick={() => handleRatingChange(i + 1)}>
                                    {i < rating ? "⭐️" : "☆"}
                                </span>
                            ))}
                        </div>
                        <button style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer', border: 'none', backgroundColor: 'green', color: 'white', borderRadius: '4px' }} onClick={submitRating}>Submit Rating</button>
                    </div>
                </div>
            )}
        </div>
    );
}
