import React from 'react';
import { Link } from 'react-router-dom';


const MovieCard = ({ movie }) => {
    return ( 
        <div className="movie-card card h-100"> {/* h-100 makes cards equal height */}
            <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text mb-1"><strong>Director:</strong> {movie.director}</p>
                <p className="card-text mb-1"><strong>Year:</strong> {movie.year}</p>
                <p className="card-text"><strong>Genre:</strong> {movie.genre}</p>
            </div>
            <div className="card-footer bg-transparent border-top-0">
                <Link to={`/movies/${movie._id}`} className="btn view-button w-100" style={{ backgroundColor: "#1b263b", color: "white" }}>
                    View Movie
                </Link>
            </div>
        </div>
    );
};

export default MovieCard;