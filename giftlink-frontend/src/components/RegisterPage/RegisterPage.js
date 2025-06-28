import React, { useState } from 'react';
import { urlConfig } from '../../config'; 
import { useAppContext } from '../../context/AuthContext'; 
import { useNavigate } from 'react-router-dom'; 
import './RegisterPage.css';
function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showerr, setShowerr] = useState('');
    const navigate = useNavigate();
    const { setIsLoggedIn } = useAppContext();
    const handleRegister = async () => {
        try {
          const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              firstName,
              lastName,
              email,
              password,
            }),
          });
      
          if (!response.ok) {
            // Try to parse JSON error message
            let errorMsg = 'Registration failed';
            try {
              const errorData = await response.json();
              errorMsg = errorData.error || errorMsg;
            } catch {
              // If not JSON, try plain text
              const text = await response.text();
              errorMsg = text || errorMsg;
            }
            setShowerr(errorMsg);
            return;
          }
      
          // If response is OK, parse JSON normally
          const data = await response.json();
      
          if (data.authtoken) {
            sessionStorage.setItem('auth-token', data.authtoken);
            sessionStorage.setItem('name', firstName);
            sessionStorage.setItem('email', data.email);
      
            setIsLoggedIn(true);
            navigate('/app');
          } else {
            setShowerr('Registration failed');
          }
        } catch (e) {
          console.error('Error during registration:', e.message);
          setShowerr('Server error. Please try again.');
        }
      };

 
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="register-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Register</h2>

                        {/* First Name */}
                        <div className="mb-4">
                            <label htmlFor="firstName" className="form-label">First Name</label>
                            <input
                                id="firstName"
                                type="text"
                                className="form-control"
                                placeholder="Enter your first name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>

                        {/* Last Name */}
                        <div className="mb-4">
                            <label htmlFor="lastName" className="form-label">Last Name</label>
                            <input
                                id="lastName"
                                type="text"
                                className="form-control"
                                placeholder="Enter your last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                type="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-4">
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

                        {/* Register Button */}
                        <button className="btn btn-primary w-100 mb-3" onClick={handleRegister}>
                            Register
                        </button>

                        {/* Error Message */}
                        {showerr && (
                            <div className="alert alert-danger text-center" role="alert">
                                {showerr}
                            </div>
                        )}

                        {/* Already a member */}
                        <p className="mt-4 text-center">
                            Already a member? <a href="/app/login" className="text-primary">Login</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;