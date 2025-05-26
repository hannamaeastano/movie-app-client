import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import MovieList from './pages/MovieList';
import SingleMovie from './pages/SingleMovie';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';
import HomePage from './pages/HomePage';

function App() {
    return (
        <UserProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/movies" element={<MovieList />} />
                    <Route path="/movies/:movieId" element={<SingleMovie />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;