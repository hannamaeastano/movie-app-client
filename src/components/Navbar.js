import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';

const Navbar = () => {
    const { user, unsetUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        unsetUser();
        navigate('/login');
        collapseNavbar(); // Collapse on logout
    };

    const collapseNavbar = () => {
        const navbarCollapse = document.getElementById('navbarNav');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            const bsCollapse = new window.bootstrap.Collapse(navbarCollapse, { toggle: false });
            bsCollapse.hide();
        }
    };

    return (
        <nav className="navbar navbar-expand-lg custom-navbar">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand" onClick={collapseNavbar}>MovieMingle</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                    style={{ backgroundColor: "#ffbe0b" }}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {!user.id ? (
                            <>
                                <li className="nav-item">
                                    <Link to="/register" className="nav-link" onClick={collapseNavbar}>
                                        Register
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/login" className="nav-link" onClick={collapseNavbar}>
                                        Login
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link to="/movies" className="nav-link" onClick={collapseNavbar}>
                                        Movies
                                    </Link>
                                </li>
                                {user.isAdmin && (
                                    <li className="nav-item">
                                        <Link to="/admin" className="nav-link" onClick={collapseNavbar}>
                                            Admin Dashboard
                                        </Link>
                                    </li>
                                )}
                                <li className="nav-item">
                                    <button onClick={handleLogout} className="btn logout-button">
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
