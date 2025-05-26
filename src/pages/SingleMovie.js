import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import UserContext from '../UserContext';
import AddCommentForm from '../components/AddCommentForm';
import { Notyf } from 'notyf';

const notyf = new Notyf({
    duration: 3000,
    position: {
        x: 'right',
        y: 'top',
    },
    dismissible: true
});

const SingleMovie = () => {
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(UserContext);

    const fetchComments = useCallback(async () => {
        if (!user.token) return;

        try {
            const commentsResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/getComments/${movieId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const commentsData = await commentsResponse.json();
            if (commentsResponse.ok) {
                setComments(commentsData);
            } else {
                console.error('Failed to fetch comments:', commentsData.message);
                setComments([]);
            }
        } catch (err) {
            console.error('Fetch comments error:', err);
            setComments([]);
        }
    }, [movieId, user.token]);

    const fetchMovieDetails = useCallback(async () => {
        if (!user.token) {
            setLoading(false);
            return;
        }

        try {
            const movieResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/getMovie/${movieId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const movieData = await movieResponse.json();

            if (movieResponse.ok) {
                setMovie(movieData);
                await fetchComments();
            } else {
                notyf.error(movieData.message || 'Failed to fetch movie details.');
            }
        } catch (err) {
            console.error('Fetch movie details error:', err);
            notyf.error('Network error or server unavailable. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [movieId, user.token, fetchComments]);

    useEffect(() => {
        fetchMovieDetails();
    }, [fetchMovieDetails]);

    const handleCommentAdded = useCallback(() => {
        fetchComments(); 
    }, [fetchComments]);

    if (loading) {
        return <p className="text-center my-4">Loading movie details...</p>;
    }

    if (!user.token) {
        return <p className="text-center my-4 text-danger">You must be logged in to view movie details.</p>;
    }

    if (!movie) {
        return <p className="text-center my-4 text-danger">Movie not found.</p>;
    }

    return (
        <div className="container mt-5">
            <div className="single-movie-container">
                <h2 className="text-center mb-4">{movie.title}</h2>
                <div className="single-movie-details">
                    <p><strong>Director:</strong> {movie.director}</p>
                    <p><strong>Year:</strong> {movie.year}</p>
                    <p><strong>Genre:</strong> {movie.genre}</p>
                    <p className="mt-3"><strong>Description:</strong></p>
                    <p>{movie.description}</p>
                </div>

                <div className="comments-section mt-5 border-top pt-4">
                    <h3 className="mb-3">Comments ({comments.length})</h3>
                    {comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <div key={index} className="card card-body text-light bg-dark mb-2">
                                <p className="mb-0">{comment.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p>No comments yet. Be the first to add one!</p>
                    )}
                    {user.id && (
                        <AddCommentForm movieId={movieId} onCommentAdded={handleCommentAdded} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SingleMovie;