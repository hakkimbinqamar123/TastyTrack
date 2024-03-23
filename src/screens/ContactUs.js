import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ContactUs() {
    // State variables to store form data
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
        message: ''
    });

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                alert("Message sent successfully!");
                window.location.reload();
                console.log('Message sent successfully');
                // Optionally, you can reset the form fields here
            } else {
                console.error('Failed to send message');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Function to handle input changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <>
            {/* Header Block */}
            <div>
                <Navbar />
                <header id="site-header">
                    <div className="offcanvas offcanvas-top" tabIndex={-1} id="offcanvasTop" aria-labelledby="offcanvasTopLabel">
                        <div className="container pt-5">
                            <div className="offcanvas-header">
                                <h2 className="fw-bold pb-3">Search here</h2>
                                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
                            </div>
                            <div className="offcanvas-body">
                                <form className="position-relative" action="#" method="post">
                                    <input type="tel" className="form-control" id="exampleFormControlInput1" placeholder="Examples: posts, services,.." />
                                    <button className="position-absolute top-0 end-0 border-0 bg-transparent py-2 pe-2 text-secondary" type="submit" name="search"><i className="fa-solid fa-magnifying-glass" /></button>
                                </form>
                            </div>
                        </div>
                    </div>
                </header>
                {/* Breadcrumb Block */}
                <section className="mt-5">
                    <div className="bg-light py-5">
                        <div className="container">
                            <div className="d-flex justify-content-between">
                                <h1 className="fw-bold">Contact us</h1>
                                <nav className="pt-3" style={{'--bsBreadcrumbDivider': 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'8\' height=\'8\'%3E%3Cpath d=\'M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z\' fill=\'%236c757d\'/%3E%3C/svg%3E")'}} aria-label="breadcrumb">
                                    
                                </nav>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <main>
                <div className="container py-5">
                    <div className="row g-5">
                        {/* Contact Information Block */}
                        <div className="col-xl-6">
                            <div className="row row-cols-md-2 g-4">
                                <div className="aos-item" data-aos="fade-up" data-aos-delay={200}>
                                    <div className="aos-item__inner">
                                        <div className="bg-light hvr-shutter-out-horizontal d-block p-3">
                                            <div className="d-flex justify-content-start">
                                                <i className="fa-solid fa-envelope h3 pe-2" />
                                                <span className="h5">Email</span>
                                            </div>
                                            <span>tastytrack@gmail.com</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="aos-item" data-aos="fade-up" data-aos-delay={400}>
                                    <div className="aos-item__inner">
                                        <div className="bg-light hvr-shutter-out-horizontal d-block p-3">
                                            <div className="d-flex justify-content-start">
                                                <i className="fa-solid fa-phone h3 pe-2" />
                                                <span className="h5">Phone</span>
                                            </div>
                                            <span>+0123456789, +9876543210</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="aos-item mt-4" data-aos="fade-up" data-aos-delay={600}>
                                <div className="aos-item__inner">
                                    <div className="bg-light hvr-shutter-out-horizontal d-block p-3">
                                        <div className="d-flex justify-content-start">
                                            <i className="fa-solid fa-location-pin h3 pe-2" />
                                            <span className="h5">Location</span>
                                        </div>
                                        <span>#007, Gandhi street, Kottayam BG23 4YZ, India</span>
                                    </div>
                                </div>
                            </div>
                            <div className="aos-item" data-aos="fade-up" data-aos-delay={800}>
                                <div className="mt-4 w-100 aos-item__inner">
                                    <iframe className="hvr-shadow" width="100%" height={345} frameBorder={0} scrolling="no" marginHeight={0} marginWidth={0} src="https://maps.google.com/maps?width=100%25&height=300&hl=en&q=1%20Grafton%20Street,%20Dublin,%20Ireland+()&t=&z=14&ie=UTF8&iwloc=B&output=embed">&lt;a href="https://www.maps.ie/distance-area-calculator.html"&gt;measure acres/hectares on map&lt;/a&gt;</iframe>
                                </div>
                            </div>
                        </div>
                        {/* Contact Form Block */}
                        <div className="col-xl-6">
                            <h2 className="pb-4">Leave a message</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="row g-4">
                                    <div className="col-6 mb-3">
                                        <label htmlFor="firstName" className="form-label">Fname</label>
                                        <input type="text" className="form-control" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="first name" required />
                                    </div>
                                    <div className="col-6 mb-3">
                                        <label htmlFor="lastName" className="form-label">Lname</label>
                                        <input type="text" className="form-control" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="last name" required />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">Phone</label>
                                    <input type="tel" className="form-control" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder={+1234567890} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="city" className="form-label">City</label>
                                    <select className="form-select" id="city" name="city" value={formData.city} onChange={handleChange} aria-label="Default select example" required>
                                        <option value={1}>Kottayam</option>
                                        <option value={2}>Kochi</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="message" className="form-label">Message</label>
                                    <textarea className="form-control" id="message" name="message" value={formData.message} onChange={handleChange} rows={3} defaultValue={""} required />
                                </div>
                                <button type="submit" className="btn btn-dark">Send Message</button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
