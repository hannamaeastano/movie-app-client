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
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
        setIsSubmitting(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Use the setUser function from context to handle token and user data
            setUser({ 
                token: data.access,
                id: data.id,         // If backend returns user ID
                isAdmin: data.isAdmin // If backend returns admin status
            });

            notyf.success('Login successful!');
            navigate('/movies');
        } catch (error) {
            console.error('Login error:', error);
            
            // Handle specific error cases
            if (error.message.includes('Failed to fetch')) {
                notyf.error('Cannot connect to server. Please try again later.');
            } else if (error.message.toLowerCase().includes('credentials')) {
                notyf.error('Invalid email or password');
            } else {
                notyf.error(error.message || 'Login failed. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
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
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            autoComplete="username"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="form-label">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="current-password"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="btn w-100" 
                        style={{ backgroundColor: "#1b263b", color: "white" }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
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