import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Solutions from './pages/Solutions';
import Blog from './pages/Blog';
import BlogPost from './pages/Blog/BlogPost';
import Testimonials from './pages/Testimonials';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import Courses from './pages/Courses';

// Admin Pages
import Login from './pages/Admin/Login';
import Dashboard from './pages/Admin/Dashboard';
import BlogManager from './pages/Admin/BlogManager';
import TestimonialManager from './pages/Admin/TestimonialManager';
import BookingManager from './pages/Admin/BookingManager';
import AboutManager from './pages/Admin/AboutManager';
import PaymentLink from './pages/Admin/PaymentLink';
import ReceiptManager from './pages/Admin/RecieptManager';
import ContactManager from './pages/Admin/ContactManager';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <Layout>
              <Home />
            </Layout>
          } />
          <Route path="/about" element={
            <Layout>
              <About />
            </Layout>
          } />
          <Route path="/solutions" element={
            <Layout>
              <Solutions />
            </Layout>
          } />
          <Route path="/blog" element={
            <Layout>
              <Blog />
            </Layout>
          } />
          <Route path="/blog/:slug" element={
            <Layout>
              <BlogPost />
            </Layout>
          } />
          <Route path="/testimonials" element={
            <Layout>
              <Testimonials />
            </Layout>
          } />
          <Route path="/booking" element={
            <Layout>
              <Booking />
            </Layout>
          } />
          <Route path="/contact" element={
            <Layout>
              <Contact />
            </Layout>
          } />
          <Route path="/courses" element={<Courses />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/blog" element={
            <ProtectedRoute>
              <BlogManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/testimonials" element={
            <ProtectedRoute>
              <TestimonialManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/bookings" element={
            <ProtectedRoute>
              <BookingManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/about" element={
            <ProtectedRoute>
              <AboutManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/payments" element={
            <ProtectedRoute>
              <PaymentLink />
            </ProtectedRoute>
          } />
          <Route path="/admin/receipts" element={
            <ProtectedRoute>
              <ReceiptManager/>
            </ProtectedRoute>
          } />
          <Route path="/admin/contacts" element={
            <ProtectedRoute>
              <ContactManager />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;