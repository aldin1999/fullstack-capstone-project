import React, { useState, useEffect } from 'react';
// Task 1: Import urlConfig
import { urlConfig } from '../../config';
// Task 2: Import useAppContext
import { useAppContext } from '../../context/AuthContext';
// Task 3: Import useNavigate from react-router-dom
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Task 4: Include a state for incorrect password/error message
    const [incorrect, setIncorrect] = useState('');

    // Task 5: Create local variables
    const navigate = useNavigate();
    const bearerToken = sessionStorage.getItem('auth-token'); 
    const { setIsLoggedIn } = useAppContext();

    // Task 6: If already logged in, redirect to main page (e.g., /app)
    useEffect(() => {
        if (bearerToken) {
            navigate('/app');
        }
    }, [bearerToken, navigate]);

    const handleLogin = async () => {
        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': bearerToken ? `Bearer ${bearerToken}` : '',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            const json = await response.json(); // Task 1: Access data from backend

            if (json.authtoken) {
                // Task 2: Set user details in session storage
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', json.userName);
                sessionStorage.setItem('email', json.userEmail);

                // Task 3: Set the user's state to logged in
                setIsLoggedIn(true);

                // Task 4: Navigate to MainPage
                navigate('/app');

            } else {
                // Task 5: Clear inputs and set error message if password is incorrect
                setEmail('');
                setPassword('');
                setIncorrect("Wrong password. Try again.");

             
                setTimeout(() => {
                    setIncorrect('');
                }, 2000);
            }
        } catch (e) {
            console.error("Error fetching details: " + e.message);
            setIncorrect('An error occurred. Please try again.');
        }
    };
        return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="login-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Login</h2>

                        {/* Email Input */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                type="text"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Display error message */}
                        <span style={{color:'red', height:'.5cm', display:'block', fontStyle:'italic', fontSize:'12px'}}>
                            {incorrect}
                        </span>

                        {/* Login Button */}
                        <button className="btn btn-primary w-100 mb-3" onClick={handleLogin}>
                            Login
                        </button>

                        {/* Register Link */}
                        <p className="mt-4 text-center">
                            New here? <a href="/app/register" className="text-primary">Register Here</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;