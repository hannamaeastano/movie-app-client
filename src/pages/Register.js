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
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.email.includes('@')) {
            newErrors.email = 'Invalid email format';
        }
        
        if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
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
                // Handle specific backend validation errors
                if (response.status === 400 && data.errors) {
                    setErrors(data.errors);
                    throw new Error('Validation failed');
                }
                throw new Error(data.message || 'Registration failed');
            }

            // If registration includes automatic login
            if (data.token) {
                setUser({ token: data.token });
                notyf.success('Registration successful! You are now logged in.');
                navigate('/');
            } else {
                notyf.success('Registration successful! Please login.');
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
                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="6"
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            minLength="6"
                        />
                        {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                    </div>
                    <button 
                        type="submit" 
                        className="btn w-100" 
                        style={{ backgroundColor: "#1b263b", color: "white" }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Registering...
                            </>
                        ) : 'Register'}
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