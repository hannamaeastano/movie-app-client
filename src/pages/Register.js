import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import UserContext from '../UserContext';

const notyf = new Notyf({
    duration: 3000,
    position: {
        x: 'right',
        y: 'top',
    },
    dismissible: true
});

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (formData.password !== formData.confirmPassword) {
            notyf.error('Passwords do not match.');
            return;
        }

        if (formData.password.length < 6) {
            notyf.error('Password must be at least 6 characters.');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // If registration includes automatic login, handle token
            if (data.token) {
                setUser({ token: data.token }); // This will trigger user details retrieval
                notyf.success('Registration successful! You are now logged in.');
                navigate('/');
            } else {
                notyf.success(data.message || 'Registration successful! Please login.');
                navigate('/login');
            }
        } catch (error) {
            console.error('Registration error:', error);
            notyf.error(error.message || 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
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
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="6"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="form-control"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            minLength="6"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="btn w-100" 
                        style={{ backgroundColor: "#1b263b", color: "white" }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Registering...' : 'Register'}
                    </button>
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