import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Profile() {
    const [userData, setUserData] = useState({});

    const fetchUserData = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/customerprofile", {
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
            console.log(responseData);

            setUserData(responseData);
        } catch (error) {
            console.error('Fetch error:', error.message);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">
                                <h2>Profile</h2>
                            </div>

                            <div className="card-body" key={userData._id}>
                                <div className="mb-3">
                                    <label className="form-label">Name:</label>
                                    <p>{userData.name}</p>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email:</label>
                                    <p>{userData.email}</p>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Address:</label>
                                    <p>{userData.location}</p>
                                </div>
                                <Link to="/edit-profile" className="btn btn-primary">
                                    Edit Profile
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
