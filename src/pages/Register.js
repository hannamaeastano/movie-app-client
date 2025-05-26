import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Notyf } from 'notyf'; 

const notyf = new Notyf({
    duration: 3000,
    position: {
        x: 'right',
        y: 'top',
    },
    dismissible: true
});

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            notyf.error('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                notyf.success(data.message);
                navigate('/login');
            } else {
                notyf.error(data.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('Registration error:', err);
            notyf.error('Network error or server unavailable. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="form-container col-md-6 offset-md-3">
                <h2 className="form-heading text-center text-white mb-4">Register</h2>
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
                    <div className="mb-3">
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
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn w-100" style={{ backgroundColor: "#1b263b", color: "white" }}>Register</button>
                    <div className="text-center mt-3">
                        <p className="text-white mb-0">
                            Already have an account?{' '}
                            <a href="/login" className="text-decoration-none">
                            Log in here
                            </a>
                        </p>
                </div>
                </form>
            </div>
        </div>
    );
};

export default Register;