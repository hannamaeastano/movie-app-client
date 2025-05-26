// src/pages/AdminDashboard.js
import React, { useState, useEffect, useContext, useCallback } from 'react';
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

const AdminDashboard = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [movieToDelete, setMovieToDelete] = useState(null);
    const [currentMovie, setCurrentMovie] = useState(null);
    const [formMovie, setFormMovie] = useState({ 
        title: '', 
        director: '', 
        year: '', 
        description: '', 
        genre: '' 
    });

    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const fetchMovies = useCallback(async () => {
        if (!user.token) {
            notyf.error('Authentication required. Redirecting to login.');
            navigate('/login');
            setLoading(false);
            return;
        }
        if (!user.isAdmin) {
            notyf.error('Access Denied. You are not an administrator. Redirecting to movies.');
            navigate('/movies');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/getMovies`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setMovies(data);
            } else {
                notyf.error(data.message || 'Failed to fetch movies for admin.');
            }
        } catch (err) {
            console.error('Admin fetch movies error:', err);
            notyf.error('Network error or server unavailable. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [user.token, user.isAdmin, navigate]);

    const handleAddMovieClick = () => {
        setCurrentMovie(null);
        setFormMovie({ title: '', director: '', year: '', description: '', genre: '' });
        setShowModal(true);
    };

    const handleEditMovieClick = (movie) => {
        setCurrentMovie(movie);
        setFormMovie({
            title: movie.title,
            director: movie.director,
            year: movie.year,
            description: movie.description,
            genre: movie.genre
        });
        setShowModal(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormMovie(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const method = currentMovie ? 'PATCH' : 'POST';
        const url = currentMovie
            ? `${process.env.REACT_APP_API_BASE_URL}/movies/updateMovie/${currentMovie._id}`
            : `${process.env.REACT_APP_API_BASE_URL}/movies/addMovie`;

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify(formMovie),
            });
            const data = await response.json();
            if (response.ok) {
                notyf.success(data.message);
                setShowModal(false);
                fetchMovies();
            } else {
                notyf.error(data.message || 'Operation failed.');
            }
        } catch (err) {
            console.error('Movie form submit error:', err);
            notyf.error('Network error or server unavailable.');
        }
    };

    const handleDeleteClick = (movieId) => {
        setMovieToDelete(movieId);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!movieToDelete) return;
        
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/deleteMovie/${movieToDelete}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                notyf.success(data.message);
                fetchMovies();
            } else {
                notyf.error(data.message || 'Failed to delete movie.');
            }
        } catch (err) {
            console.error('Delete movie error:', err);
            notyf.error('Network error or server unavailable.');
        } finally {
            setShowDeleteModal(false);
            setMovieToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setMovieToDelete(null);
    };

    useEffect(() => {
        if (user.id && !user.isAdmin) {
            notyf.error('Access Denied. You are not authorized to view the admin dashboard.');
            navigate('/movies');
            return;
        }
        if (!user.id) {
            notyf.error('Please log in to access the admin dashboard.');
            navigate('/login');
            return;
        }

        fetchMovies();
    }, [user.id, user.isAdmin, user.token, navigate, fetchMovies]);

    if (loading) {
        return <p className="text-center my-4">Loading admin dashboard...</p>;
    }

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Admin Dashboard</h2>
            <button id="addMovie" className="btn admin-dashboard-add-button mb-4" onClick={handleAddMovieClick}>
                Add Movie
            </button>

            {movies.length === 0 ? (
                <p className="text-center text-muted">No movies to display. Add one!</p>
            ) : (
                <div className="table-responsive">
                   <table className="admin-movie-table">
                        <thead>
                            <tr>
                            <th>Title</th>
                            <th>Director</th>
                            <th>Year</th>
                            <th>Genre</th>
                            <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movies.map((movie) => (
                            <tr key={movie._id}>
                                <td>{movie.title}</td>
                                <td>{movie.director}</td>
                                <td>{movie.year}</td>
                                <td>
                                {movie.genre.split(',').map((genre, i) => (
                                    <span key={i} className="genre-tag">{genre.trim()}</span>
                                ))}
                                </td>
                                <td>
                                <div className="action-buttons">
                                    <button 
                                    className="btn-action btn-update" 
                                    onClick={() => handleEditMovieClick(movie)}
                                    >
                                    Update
                                    </button>
                                    <button 
                                    className="btn-action btn-delete" 
                                    onClick={() => handleDeleteClick(movie._id)}
                                    >
                                    Delete
                                    </button>
                                </div>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content-custom">
                        <button className="modal-close-button" onClick={() => setShowModal(false)}>&times;</button>
                        <h3 className="text-center mb-4">{currentMovie ? 'Edit Movie' : 'Add New Movie'}</h3>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="title">Title:</label>
                                <input className="form-control" type="text" id="title" name="title" value={formMovie.title} onChange={handleFormChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="director">Director:</label>
                                <input className="form-control" type="text" id="director" name="director" value={formMovie.director} onChange={handleFormChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="year">Year:</label>
                                <input className="form-control" type="number" id="year" name="year" value={formMovie.year} onChange={handleFormChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="description">Description:</label>
                                <textarea className="form-control" id="description" name="description" value={formMovie.description} onChange={handleFormChange} required rows="4"></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="form-label" htmlFor="genre">Genre:</label>
                                <input className="form-control" type="text" id="genre" name="genre" value={formMovie.genre} onChange={handleFormChange} required />
                            </div>
                            <button type="submit" className="btn w-100" style={{ backgroundColor: "#ffbe0b" }}>{currentMovie ? 'Update Movie' : 'Add Movie'}</button>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content-custom" style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h5 className="modal-title">Confirm Deletion</h5>
                            <button type="button" className="modal-close-button" onClick={handleDeleteCancel}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this movie?</p>
                        </div>
                        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button className="btn btn-secondary" onClick={handleDeleteCancel}>Cancel</button>
                            <button className="btn btn-danger" onClick={handleDeleteConfirm}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;