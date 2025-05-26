import React, { useState, useContext } from 'react';
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

const AddCommentForm = ({ movieId, onCommentAdded }) => {
    const [commentText, setCommentText] = useState('');
    const { user } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) {
            notyf.error('Comment cannot be empty.');
            return;
        }
        if (!user.token) {
            notyf.error('You must be logged in to add a comment.');
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/addComment/${movieId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify({ comment: commentText }),
            });
            const data = await response.json();
            if (response.ok) {
                setCommentText('');
                onCommentAdded();
                notyf.success('Comment added successfully!');
            } else {
                notyf.error(data.message || 'Failed to add comment.');
            }
        } catch (err) {
            console.error('Add comment error:', err);
            notyf.error('Network error or server unavailable.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <h4 className="mb-3">Add a Comment</h4>
            <div className="mb-3">
                <textarea
                    className="form-control"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write your comment here..."
                    required
                    rows="3"
                ></textarea>
            </div>
            <button type="submit" id="addComment" className="btn btn-warning w-100">Add Comment</button>
        </form>
    );
};

export default AddCommentForm;