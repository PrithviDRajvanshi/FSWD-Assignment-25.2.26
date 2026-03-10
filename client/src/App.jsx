// eslint-disable no-unused-vars
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { ToastContainer as ToastComp } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import ConnectionTest from './components/common/ConnectionTest';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-container" style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
          <Header />
          {/* global toast container */}
          {/* eslint-disable-next-line no-unused-vars */}
          <ToastComp position="top-right" autoClose={3000} hideProgressBar={false} />

          <main style={{flex: 1}}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
              <Route path="/edit-post/:id" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
              <Route path="/connection-test" element={<ConnectionTest />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
