import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import './EditPost.css';

const EditPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch post data on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchPost = async () => {
      try {
        setFetchLoading(true);
        setError(null);
        const response = await api.get(`/posts/${id}`);

        if (response.data.success) {
          const post = response.data.data;

          // Check if user is the author
          if (post.author._id !== user.id) {
            setError('You are not authorized to edit this post');
            return;
          }

          // Pre-fill form data
          setFormData({
            title: post.title,
            description: post.description,
            content: post.content,
            tags: post.tags ? post.tags.join(', ') : '',
          });
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to fetch post';
        setError(errorMessage);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchPost();
  }, [id, user, isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Trim all fields and validate
      const title = formData.title.trim();
      const description = formData.description.trim();
      const content = formData.content.trim();

      if (!title || !description || !content) {
        setError('All fields are required');
        setLoading(false);
        return;
      }

      // Parse tags (split by comma and trim)
      const tags = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // Submit to backend
      const response = await api.put(`/posts/${id}`, {
        title,
        description,
        content,
        tags,
      });

      if (response.status === 200) {
        setSuccess(true);

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update post';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  if (fetchLoading) {
    return (
      <div className="edit-post-container">
        <div className="loading-state">Loading post...</div>
      </div>
    );
  }

  if (error && !fetchLoading) {
    return (
      <div className="edit-post-container">
        <div className="alert alert-error">{error}</div>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="edit-post-container">
      <div className="edit-post-card">
        <h1>Edit Post</h1>

        {error && <div className="alert alert-error">{error}</div>}
        {success && (
          <div className="alert alert-success">
            Post updated successfully! Redirecting to dashboard...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title"
              required
              minLength="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Short Description *</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief summary of your post (10+ characters)"
              required
              minLength="10"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your post content here..."
              required
              rows="10"
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., technology, tutorial, web"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Updating...' : 'Update Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
