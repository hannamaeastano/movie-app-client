import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';
import { Notyf } from 'notyf'; 
const notyf = new Notyf({
    duration: 3000,
    position: {
        x: 'right',
        y: 'top',
    },
    dismissible: true
});

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { retrieveUserDetails } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.access);
                await retrieveUserDetails();
                notyf.success('Login successful!');
                navigate('/movies');
            } else {
                notyf.error(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            console.error('Login error:', err);
            notyf.error('Network error or server unavailable. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="form-container col-md-6 offset-md-3">
                <h2 className="form-heading text-center text-white mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="form-label">Password:</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn w-100" style={{ backgroundColor: "#1b263b", color: "white" }}>Login</button>
                    <div className="text-center mt-4">
                        <p className="text-white mb-0">
                            Don't have an account?{' '}
                            <a href="/register" className="text-decoration-none">
                            Register here
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;