import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [credentials, setCredentials] = useState({
    email: "", password: ""
  })

  let navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify({ email: credentials.email, password: credentials.password }));
    const response = await fetch("http://localhost:5000/api/loginuser", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: credentials.email, password: credentials.password })
    });

    console.log(response);
    const json = await response.json();
    console.log(json); // Log the response JSON

    if (json.success) {
      localStorage.setItem("userEmail", credentials.email);
      localStorage.setItem("authToken", json.authToken);
      // Accessing userId from the user object in the response
      // localStorage.setItem("userId", json.data.user.id); 
      // console.log(localStorage.getItem("userId")); 
      console.log(localStorage.getItem("authToken"))
      navigate("/");
    }
     else {
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
    <> <br />
      <div className="container d-flex justify-content-center align-items-center">
        <div class="card" style={{ width: '30rem' }}>
          {/* You can replace the image source and alt text accordingly */}
          <img src="https://cdn.wallpapersafari.com/42/55/MDzowJ.jpg" class="card-img-top" alt="Card Image" />
          <div class="card-body">
            <h5 class="card-title">Login</h5>
            <form onSubmit={handleSubmit}>
              <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  class="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  name="email"
                  value={credentials.email}
                  onChange={onChange}
                />
                <div id="emailHelp" class="form-text">
                  We'll never share your email with anyone else.
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
              {/* <Link to="/createuser" class="m-3 btn btn-danger">
          Don't have an account?
        </Link> */}
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
