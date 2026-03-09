import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PostCard.css';

const PostCard = ({ post, currentUser, onDelete, onEdit }) => {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isOwner = currentUser && post.author && post.author._id === currentUser.id;

  const handleEdit = () => {
    if (onEdit) {
      onEdit(post._id);
    } else {
      navigate(`/edit-post/${post._id}`);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      if (onDelete) {
        await onDelete(post._id);
      }
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <h3 className="post-title">{post.title}</h3>
        <span className="post-date">{formatDate(post.createdAt)}</span>
      </div>

      <p className="post-author">
        By <strong>{post.author?.name || 'Unknown'}</strong>
      </p>

      <p className="post-description">{post.description}</p>

      <div className="post-content-preview">
        {post.content.substring(0, 150)}
        {post.content.length > 150 ? '...' : ''}
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="post-tags">
          {post.tags.map((tag, index) => (
            <span key={index} className="tag">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="post-footer">
        <span className="post-likes">👍 {post.likes} likes</span>

        {isOwner && (
          <div className="post-actions">
            <button
              className="btn-action btn-edit"
              onClick={handleEdit}
              title="Edit post"
            >
              ✏️ Edit
            </button>
            <button
              className="btn-action btn-delete"
              onClick={handleDeleteClick}
              title="Delete post"
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3>Delete Post</h3>
            <p>Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="delete-modal-actions">
              <button
                className="btn btn-secondary"
                onClick={handleDeleteCancel}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
