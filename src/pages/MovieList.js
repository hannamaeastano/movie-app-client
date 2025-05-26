import React, { useState, useEffect, useContext } from 'react';
import MovieCard from '../components/MovieCard';
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

const MovieList = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchMovies = async () => {
            if (!user.token) {
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
                    notyf.error(data.message || 'Failed to fetch movies.');
                }
            } catch (err) {
                console.error('Fetch movies error:', err);
                notyf.error('Network error or server unavailable. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [user.token]);

    if (loading) {
        return <p className="text-center my-4">Loading movies...</p>;
    }

    if (!user.token) {
        return <p className="text-center my-4 text-danger">You must be logged in to view movies.</p>;
    }

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Movie Catalog</h2>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"> {/* Bootstrap grid */}
                {movies.length > 0 ? (
                    movies.map((movie) => (
                        <div className="col" key={movie._id}>
                            <MovieCard movie={movie} />
                        </div>
                    ))
                ) : (
                    <p className="text-center w-100">No movies found. Add some from the Admin Dashboard!</p>
                )}
            </div>
        </div>
    );
};

export default MovieList;