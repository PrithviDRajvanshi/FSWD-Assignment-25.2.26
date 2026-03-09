import React from 'react';
import './PostCard.css';

const PostCard = ({ post }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
      </div>
    </div>
  );
};

export default PostCard;
