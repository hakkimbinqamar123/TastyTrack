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
        <>
  <br />
  <div className="container d-flex justify-content-center align-items-center">
    <div class="card" style={{ width: '30rem' }}>
      {/* You can replace the image source and alt text accordingly */}
      <img src="https://hdwallpaperim.com/wp-content/uploads/2017/08/31/155931-food.jpg" class="card-img-top" alt="Card Image" />
      <div class="card-body">
        <h5 class="card-title">Login</h5>
        <form onSubmit={handleSubmit}>
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">
              Username
            </label>
            <input
              type="username"
              class="form-control"
              id="username"
              aria-describedby="emailHelp"
              name="username"
              value={credentials.username}
              onChange={onChange}
            />
            <div id="emailHelp" class="form-text">
              We'll never share your details with anyone else.
            </div>
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">
              Password
            </label>
            <input
              type="password"
              class="form-control"
              id="exampleInputPassword1"
              name="password"
              value={credentials.password}
              onChange={onChange}
            />
          </div>
          <button type="submit" class="m-3 btn btn-success">
            Login
          </button>
          <Link to="/" class="m-3 btn btn-dark">
            Home
          </Link>
        </form>
      </div>
    </div>
  </div>
</>

    )
}
