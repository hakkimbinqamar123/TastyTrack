import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Signup() {

    const [credentials, setCredentials] = useState({
        name: "", email: "", password: "", geolocation: ""
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        console.log("URL:", "http://localhost:5000/api/createuser");
        console.log("Payload:", JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password, location: credentials.geolocation }));
        
        const response = await fetch("http://localhost:5000/api/createuser", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password, location: credentials.geolocation })
        });
    
        const json = await response.json();
        console.log(json);
    
        if (!json.success) {
            if (json.message === 'Email already exists') {
                alert("Email already exists. Please use a different email.");
            } else {
                alert("Enter Valid Credentials");
            }
        } else {
            alert("Registration successful!!");
        }
    };
    
    

    const onChange = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value });
    }

    return (
        <>
            <div class="container">
                <form onSubmit={handleSubmit}>
                    <div class="mb-3">
                        <label for="name" class="form-label">Name</label>
                        <input type="text" class="form-control" name='name' value={credentials.name} onChange={onChange} />
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Email address</label>
                        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name='email' value={credentials.email} onChange={onChange} />
                        <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPassword1" class="form-label">Password</label>
                        <input type="password" class="form-control" id="exampleInputPassword1" name='password' value={credentials.password} onChange={onChange} />
                    </div>
                    <div class="mb-3">
                        <label for="text" class="form-label">Address</label>
                        <input type="password" class="form-control" id="exampleInputPassword1" name='geolocation' value={credentials.geolocation} onChange={onChange} />
                    </div>
                    <button type="submit" class="m-3 btn btn-success">Submit</button>
                    <Link to="/login" class="m-3 btn btn-danger">Already a user</Link>
                    <Link to="/" class="m-3 btn btn-dark">Home</Link>
                </form>
            </div>
        </>
    )
}

