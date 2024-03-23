import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap JS
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Profile = () => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [editedLocation, setEditedLocation] = useState('');
    const [userData, setUserData] = useState({});

    const handleEditProfileClick = () => {
        setShowEditModal(true);
        setEditedName(userData.name);
        setEditedLocation(userData.location);
    };

    const handleNameChange = (event) => {
        setEditedName(event.target.value);
    };

    const handleLocationChange = (event) => {
        setEditedLocation(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/editprofile", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: userData._id,
                    name: editedName,
                    email: userData.email,
                    location: editedLocation
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log('Profile updated successfully:', responseData);

            // Update userData with new values
            setUserData({ ...userData, name: editedName, location: editedLocation });
            alert("profile updated")
            setShowEditModal(false);
        } catch (error) {
            console.error('Edit profile error:', error.message);
        }
    };

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
            console.log('User data fetched:', responseData);

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
        <div>
            <Navbar />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                <h2>Profile</h2>
                            </div>

                            <div className="card-body" key={userData._id}>
                                <div className="mb-3">
                                    <label className="form-label">Name: {userData.name}</label>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email: {userData.email}</label>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Address: {userData.location}</label>
                                </div>
                                <button className="btn btn-primary" onClick={handleEditProfileClick}>
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Profile</h5>
                                <button type="button" className="close" onClick={() => setShowEditModal(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Name:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editedName}
                                        onChange={handleNameChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Location:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editedLocation}
                                        onChange={handleLocationChange}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={handleSubmit}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div> 
        <Footer/>
        </> 
    );
};

export default Profile;
