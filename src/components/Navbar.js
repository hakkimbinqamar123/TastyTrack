import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown, Badge, Modal as BootstrapModal, Button, Form } from 'react-bootstrap';
import Modal from '../Modal';
import Cart from '../screens/Cart';
import { useCart, useDispatchCart } from './ContextReducer';

export default function Navbar({ search, setSearch, showCarousel, setShowCarousel }) {
    const [cartView, setCartView] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [cartCount, setCartCount] = useState(0);
    const dispatch = useDispatchCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        const isConfirmed = window.confirm('Are you sure you want to logout?');
    
        if (isConfirmed) {
            localStorage.removeItem('authToken');
            navigate('/');
        }
    };
    
    useEffect(() => {
        const fetchCartCount = async () => {
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
                setCartCount(responseData.cart.items.length);
            } catch (error) {
                console.error('Fetch cart count error:', error.message);
            }
        };

        if (localStorage.getItem('authToken')) {
            fetchCartCount();
        }
    }, []);

    const handleShowChangePasswordModal = () => {
        setShowChangePasswordModal(true);
    };

    const handleCloseChangePasswordModal = () => {
        setShowChangePasswordModal(false);
        setOldPassword('');
        setNewPassword('');
    };

    const handleChangePassword = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/changepassword", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem("authToken"),
                },
                body: JSON.stringify({
                    email: localStorage.getItem('userEmail'),
                    oldPassword,
                    newPassword,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();

            if (responseData.success) {
                alert('Password changed successfully!');
                handleCloseChangePasswordModal();
                localStorage.removeItem('authToken');
                navigate('/');
            } else {
                if (responseData.errors) {
                    // Display error message from validation
                    alert(responseData.errors[0].msg);
                } else {
                    alert('Failed to change password. Please check your old password.');
                }
            }
        } catch (error) {
            alert("Something went wrong!")
            console.error('Change password error:', error.message);
        }
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-success">
                <div className="container-fluid">
                    <Link className="navbar-brand fs-1 fst-itali" to="/">
                        TastyTrack
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto mb-2">
                            <li className="nav-item">
                                <Link className="nav-link active fs-5" aria-current="page" to="/">
                                    Home
                                </Link>                             
                            </li>
                            {localStorage.getItem('authToken') && (
                                <li className="nav-item">
                                    <Link className="nav-link active fs-5" aria-current="page" to="/myorder">
                                        My Orders
                                    </Link>
                                </li>
                            )}
                            <li>
                                <Link className="nav-link active fs-5" aria-current="page" to="/contactus">
                                    Contact Us
                                </Link>
                            </li>
                            
                        </ul>
                        <div className="d-flex">
                            <input className="form-control me-1" type="search" placeholder="Search" aria-label="Search" value={search} onChange={(e) => { setSearch(e.target.value); setShowCarousel(e.target.value === ''); }} style={{ width: '200px' }} />
                        </div>
                        {!localStorage.getItem('authToken') ? (
                            <div className="d-flex">
                                <Link className="btn bg-white text-success mx-1" to="/login">
                                    Login
                                </Link>
                                <Link className="btn bg-white text-success mx-1" to="/createuser">
                                    SignUp
                                </Link>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className="btn bg-white text-success mx-2" onClick={() => setCartView(true)}>
                                    My Cart{' '}
                                    <Badge pill bg="danger">
                                        {cartCount}
                                    </Badge>
                                </div>

                                {cartView ? (
                                    <Modal onClose={() => setCartView(false)}>
                                        <Cart />
                                    </Modal>
                                ) : null}

                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        <img
                                            src="https://www.pngkey.com/png/full/115-1150152_default-profile-picture-avatar-png-green.png"
                                            alt="profile"
                                            style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                                        />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                        <Dropdown.Item as={Link} to='/customerprofile'>Profile</Dropdown.Item>
                                        <Dropdown.Item onClick={handleShowChangePasswordModal}>Change Password</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>

                                <BootstrapModal show={showChangePasswordModal} onHide={handleCloseChangePasswordModal}>
                                    <BootstrapModal.Header closeButton>
                                        <BootstrapModal.Title>Change Password</BootstrapModal.Title>
                                    </BootstrapModal.Header>
                                    <BootstrapModal.Body>
                                        <Form>
                                            <Form.Group className="mb-3" controlId="formOldPassword">
                                                <Form.Label>Old Password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    placeholder="Enter your old password"
                                                    value={oldPassword}
                                                    onChange={(e) => setOldPassword(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formNewPassword">
                                                <Form.Label>New Password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    placeholder="Enter your new password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>

                                            <Button variant="primary" onClick={handleChangePassword}>
                                                Save Changes
                                            </Button>

                                        </Form>
                                    </BootstrapModal.Body>
                                </BootstrapModal>

                            </div>
                        )}
                    </div>
                </div>
            </nav>
            {showCarousel && (
                <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner" id='carousel'>
                        <div className="carousel-item active">
                            <img src="https://source.unsplash.com/random/900x700/?burger" className="d-block w-100" alt="Burger" style={{ filter: "brightness(30%)" }} />
                        </div>
                        <div className="carousel-item">
                            <img src="https://source.unsplash.com/random/900x700/?pizza" className="d-block w-100" alt="Pizza" style={{ filter: "brightness(30%)" }} />
                        </div>
                        <div className="carousel-item">
                            <img src="https://source.unsplash.com/random/900x700/?barbeque" className="d-block w-100" alt="Barbeque" style={{ filter: "brightness(30%)" }} />
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            )}
        </div>
    );
}
