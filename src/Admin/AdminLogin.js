import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const [credentials, setCredentials] = useState({
        username: "", password: ""
    })

    let navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(JSON.stringify({ username: credentials.username, password: credentials.password }));
        const response = await fetch("http://localhost:5000/api/adminlogin", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "token": sessionStorage.getItem('token'),
                "adminkey": sessionStorage.getItem('adminkey')
            },
            body: JSON.stringify({ username: credentials.username, password: credentials.password })
        });

        console.log(response);
        const json = await response.json();
        console.log(json);

        if (json.status === "Success") {
            sessionStorage.setItem("username", credentials.username);
            sessionStorage.setItem("token", json.token);
            sessionStorage.setItem("adminkey", json.adminkey);
            console.log("adminkey:", json.adminkey);
            console.log("token:", json.token);
            navigate("/admin");
        } else {
            // Handle unsuccessful login
            console.error("Login failed");
            // You might want to display an error message on the page instead of using alert
            alert("Enter Valid Credentials");
        }
    };
    const onChange = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value });
    }
    return (
        <div>
            <div class="container">
                <form onSubmit={handleSubmit}>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Username</label>
                        <input type="text" class="form-control" id="username" name='username' value={credentials.username} onChange={onChange} />
                        <div id="username" class="form-text">We'll never share your username with anyone else.</div>
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPassword1" class="form-label">Password</label>
                        <input type="password" class="form-control" id="exampleInputPassword1" name='password' value={credentials.password} onChange={onChange} />
                    </div>
                    <button type="submit" onClick={handleSubmit} class="m-3 btn btn-success">Login</button>
                </form>
            </div>
        </div>
    )
}
