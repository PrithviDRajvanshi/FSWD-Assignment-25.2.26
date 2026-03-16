import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { toast } from 'react-toastify';
import hotToast from 'react-hot-toast';
import PostCard from '../components/PostCard';
import Pagination from '../components/Pagination';
import socket from '../services/socket';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, logout, isAuthenticated } = useAuth();

  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    postsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [postsLoading, setPostsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If loading is complete and user is not authenticated, redirect to login
    if (!loading && !isAuthenticated()) {
      navigate('/login');
    }
  }, [loading, navigate, isAuthenticated]);

  // establish socket connection when dashboard mounts for authenticated user
  useEffect(() => {
    if (!loading && isAuthenticated()) {
      // ensure token is sent with handshake
      socket.auth = { token: localStorage.getItem('token') };
      socket.connect();

      socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
      });

      socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });

      socket.on('connect_error', (err) => {
        console.error('Socket connect error:', err);
      });

      socket.on('newPost', (data) => {
        console.log('received newPost event', data);
        hotToast.success('A new post was created by another user');
      });
    }

    return () => {
      // cleanup listeners and disconnect when component unmounts
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('newPost');
      socket.disconnect();
    };
  }, [loading, isAuthenticated]);

  // Fetch user's posts
  const fetchUserPosts = async (page = 1) => {
    try {
      setPostsLoading(true);
      setError(null);
      const response = await api.get(`/posts/user/my-posts?page=${page}&limit=10`);
      
      if (response.data.success) {
        setPosts(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch posts';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setPostsLoading(false);
    }
  };

  // Handle post deletion with optimistic updates
  const handleDeletePost = async (postId) => {
    try {
      // Optimistic update: remove post from UI immediately
      const updatedPosts = posts.filter(post => post._id !== postId);
      setPosts(updatedPosts);

      // Update pagination if needed
      const newTotalPosts = pagination.totalPosts - 1;
      const newTotalPages = Math.ceil(newTotalPosts / pagination.postsPerPage);
      
      if (pagination.currentPage > newTotalPages && newTotalPages > 0) {
        // If we're on a page that no longer exists, go to the last page
        fetchUserPosts(newTotalPages);
        return;
      }

      // Update pagination metadata
      setPagination(prev => ({
        ...prev,
        totalPosts: newTotalPosts,
        totalPages: newTotalPages,
        hasNextPage: pagination.currentPage < newTotalPages,
      }));

      // Make API call
      await api.delete(`/posts/${postId}`);
      
    } catch (err) {
      // Revert optimistic update on error
      fetchUserPosts(pagination.currentPage);
      
      const errorMessage = err.response?.data?.message || 'Failed to delete post';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Handle post edit
  const handleEditPost = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  useEffect(() => {
    if (!loading && isAuthenticated()) {
      fetchUserPosts(1);
    }
  }, [loading, isAuthenticated]);

  const handlePreviousPage = () => {
    if (pagination.hasPrevPage) {
      fetchUserPosts(pagination.currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      fetchUserPosts(pagination.currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePageChange = (page) => {
    fetchUserPosts(page);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Show loading state while context is initializing
  if (loading) {
    return <div className="dashboard-container" style={{ textAlign: 'center' }}>Loading...</div>;
  }

  // If not authenticated, show nothing (redirect will happen in useEffect)
  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="user-info">
          <h1>Dashboard</h1>
          {user ? (
            <div className="user-details">
              <p>Welcome, <strong>{user.name}</strong></p>
              <p>Email: {user.email}</p>
              <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          ) : (
            <p>No user information available.</p>
          )}
        </div>

        <div className="dashboard-actions">
          <button className="btn btn-primary" onClick={() => navigate('/create-post')}>
            + Create New Post
          </button>
          <button className="btn btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="posts-section">
        <h2>Your Posts</h2>

        {error && <div className="alert alert-error">{error}</div>}

        {postsLoading ? (
          <div className="loading-state">Loading your posts...</div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <p>You haven't created any posts yet.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/create-post')}
            >
              Create Your First Post
            </button>
          </div>
        ) : (
          <>
            <div className="posts-info">
              <p>
                Showing {pagination.currentPage === 1 ? 1 : (pagination.currentPage - 1) * pagination.postsPerPage + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.postsPerPage, pagination.totalPosts)} of{' '}
                {pagination.totalPosts} posts
              </p>
            </div>

            <div className="posts-list">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUser={user}
                  onDelete={handleDeletePost}
                  onEdit={handleEditPost}
                />
              ))}
            </div>

            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage}
              onPrevious={handlePreviousPage}
              onNext={handleNextPage}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
