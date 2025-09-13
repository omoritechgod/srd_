import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  MessageSquare,
  Calendar,
  FileText,
  CreditCard,
  Users,
  BarChart3,
  ReceiptText
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const Dashboard: React.FC = () => {
  const { logout } = useAuth();

  const [metrics, setMetrics] = useState({
    total_posts: 0,
    pending_testimonials: 0,
    new_bookings: 0,
    bookings_this_month: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get('/admin/dashboard-summary');
        console.log('Fetched dashboard summary:', response.data);
        setMetrics(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const menuItems = [
    {
      title: 'Blog Management',
      description: 'Create, edit, and manage blog posts',
      icon: BookOpen,
      href: '/admin/blog',
      color: 'bg-blue-500'
    },
    {
      title: 'Testimonials',
      description: 'Review and approve client testimonials',
      icon: MessageSquare,
      href: '/admin/testimonials',
      color: 'bg-green-500'
    },
    {
      title: 'Bookings',
      description: 'View and manage consultation bookings',
      icon: Calendar,
      href: '/admin/bookings',
      color: 'bg-purple-500'
    },
    {
      title: 'About Page',
      description: 'Update about us content and images',
      icon: FileText,
      href: '/admin/about',
      color: 'bg-orange-500'
    },
    {
      title: 'Payment Links',
      description: 'Generate Paystack payment links',
      icon: CreditCard,
      href: '/admin/payments',
      color: 'bg-pink-500'
    },
    {
      title: 'Analytics',
      description: 'View website analytics and insights',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'bg-indigo-500'
    },
    {
      title: 'Receipt Management',
      description: 'View, manage, create client receipts',
      icon: ReceiptText,
      href: '/admin/receipts',
      color: 'bg-gray-700'
    },
    {
      title: 'Contact Management',
      description: 'Manage client contacts',
      icon: Users,
      href: '/admin/contacts',
      color: 'bg-red-300'
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img
                src="/new_blapng.png"
                alt="SRD Consulting"
                className="h-10 w-auto mr-4"
              />
              <div>
                <h1 className="text-xl font-semibold text-dark">Admin Dashboard</h1>
                <p className="text-sm text-gray">SRD Consulting CMS</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray hover:text-primary">
                View Site
              </Link>
              <button
                onClick={logout}
                className="btn-secondary text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-dark mb-2">Welcome back!</h2>
          <p className="text-gray">Manage your website content and settings from here.</p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { label: 'Total Posts', value: metrics.total_posts, icon: BookOpen },
            { label: 'Pending Testimonials', value: metrics.pending_testimonials, icon: MessageSquare },
            { label: 'New Bookings', value: metrics.new_bookings, icon: Calendar },
            { label: 'This Month', value: metrics.bookings_this_month, icon: Users }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray">{stat.label}</p>
                  <p className="text-2xl font-bold text-dark">
                    {loading ? '...' : stat.value}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Menu Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {menuItems.map((item, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Link
                to={item.href}
                className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className="flex items-start">
                  <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-dark mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray text-sm">{item.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activity - Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-dark mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: 'New testimonial submitted', time: '2 hours ago' },
                { action: 'Blog post "Crisis Communication" published', time: '1 day ago' },
                { action: 'Consultation booked for tomorrow', time: '2 days ago' },
                { action: 'About page content updated', time: '3 days ago' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center py-3 border-b border-gray-100 last:border-b-0">
                  <div className="w-2 h-2 bg-primary rounded-full mr-4"></div>
                  <div className="flex-1">
                    <p className="text-dark">{activity.action}</p>
                    <p className="text-sm text-gray">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
