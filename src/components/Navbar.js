import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown, Badge } from 'react-bootstrap'; // Import Dropdown from react-bootstrap
import Modal from '../Modal';
import Cart from '../screens/Cart';
import { useCart } from './ContextReducer';

export default function Navbar() {
    const [cartView, setCartView] = useState(false);
    let data = useCart();

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
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
                        </ul>
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
                                        {data.length}
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
        {/* Add profile management options here */}
        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
        <Dropdown.Item as={Link} to='/customerprofile'>Profile</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown>

                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
}