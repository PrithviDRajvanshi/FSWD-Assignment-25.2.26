import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../utils/api';
import { toast } from 'react-toastify';
import ImageUpload from '../components/ImageUpload';
import './CreatePost.css';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    tags: '',
  });
  const [coverImageUrl, setCoverImageUrl] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileSelect = (file) => {
    setSelectedImageFile(file);
  };

  const handleUpload = async (formData) => {
    setUploadLoading(true);
    setUploadError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/upload', formData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          // Do not manually set Content-Type; let browser set boundary
        },
      });

      if (response.data?.success) {
        setCoverImageUrl(response.data.url || response.data.secure_url);
        toast.success('Image uploaded successfully');
      } else {
        throw new Error(response.data?.message || 'Image upload failed');
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Image upload failed';
      setUploadError(message);
      toast.error(message);
    } finally {
      setUploadLoading(false);
    }
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

      // If user selected an image but did not yet upload it manually, upload now
      if (selectedImageFile && !coverImageUrl) {
        const pendingFormData = new FormData();
        pendingFormData.append('image', selectedImageFile);
        await handleUpload(pendingFormData);
      }

      if (uploadError) {
        throw new Error(uploadError);
      }

      // Submit to backend (include coverImage if uploaded)
      const response = await api.post('/posts', {
        title,
        description,
        content,
        tags,
        coverImage: coverImageUrl || null,
      });

      if (response.status === 201) {
        setSuccess(true);
        setFormData({
          title: '',
          description: '',
          content: '',
          tags: '',
        });
        setCoverImageUrl(null);
        setSelectedImageFile(null);
        setUploadError(null);

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create post';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <div className="create-post-card">
        <h1>Create a New Post</h1>

        {error && <div className="alert alert-error">{error}</div>}
        {success && (
          <div className="alert alert-success">
            Post created successfully! Redirecting to dashboard...
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

          <div className="form-group">
            <label>Post Image (optional)</label>
            <ImageUpload onUpload={handleUpload} onFileSelect={handleFileSelect} />
            {uploadLoading && <p className="info-text">Uploading image...</p>}
            {coverImageUrl && !uploadError && (
              <p className="info-text">Image uploaded and ready: {coverImageUrl}</p>
            )}
            {uploadError && <p className="alert alert-error">{uploadError}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
