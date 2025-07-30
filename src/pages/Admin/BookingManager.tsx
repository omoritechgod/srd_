import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, Phone, Mail, FileText, Download, Filter, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../services/api';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  notes?: string;
  file?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

const BookingManager: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/admin');
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      // Demo data fallback
      setBookings([
        {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@example.com',
          phone: '+234 123 456 7890',
          service: 'Media Relations',
          date: new Date(Date.now() + 86400000).toISOString(),
          notes: 'Looking for help with product launch PR strategy',
          status: 'pending',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah.j@company.com',
          phone: '+234 987 654 3210',
          service: 'Crisis Communication Management',
          date: new Date(Date.now() + 172800000).toISOString(),
          notes: 'Urgent crisis communication support needed',
          status: 'confirmed',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      await fetchBookings();
    } catch (error) {
      console.error('Failed to update booking status:', error);
      alert('Failed to update booking status. Please try again.');
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Service', 'Date', 'Status', 'Notes', 'Created'];
    const csvContent = [
      headers.join(','),
      ...filteredBookings.map(booking => [
        booking.name,
        booking.email,
        booking.phone,
        booking.service,
        format(new Date(booking.date), 'yyyy-MM-dd HH:mm'),
        booking.status || 'pending',
        booking.notes || '',
        format(new Date(booking.createdAt), 'yyyy-MM-dd')
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return (booking.status || 'pending') === filter;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => (b.status || 'pending') === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-orange-100 text-orange-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <Link 
                to="/admin/dashboard"
                className="inline-flex items-center text-gray hover:text-primary mb-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-dark">Booking Management</h1>
              <p className="text-gray">View and manage consultation bookings</p>
            </div>
            <button
              onClick={exportToCSV}
              className="btn-primary inline-flex items-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Export CSV
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray">Total Bookings</p>
                <p className="text-2xl font-bold text-dark">{stats.total}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray">Pending</p>
                <p className="text-2xl font-bold text-orange-500">{stats.pending}</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray">Confirmed</p>
                <p className="text-2xl font-bold text-green-500">{stats.confirmed}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray">Cancelled</p>
                <p className="text-2xl font-bold text-red-500">{stats.cancelled}</p>
              </div>
              <Calendar className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray" />
            <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
              {[
                { key: 'all', label: 'All Bookings' },
                { key: 'pending', label: 'Pending' },
                { key: 'confirmed', label: 'Confirmed' },
                { key: 'cancelled', label: 'Cancelled' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === tab.key
                      ? 'bg-primary text-white'
                      : 'text-gray hover:text-dark'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bookings List */}
        <div className="space-y-6">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark mb-2">
                No bookings found
              </h3>
              <p className="text-gray">
                {filter === 'all' 
                  ? 'No consultation bookings have been submitted yet'
                  : `No ${filter} bookings found`
                }
              </p>
            </div>
          ) : (
            filteredBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-dark mr-3">{booking.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status || 'pending')}`}>
                        {(booking.status || 'pending').charAt(0).toUpperCase() + (booking.status || 'pending').slice(1)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-gray">
                        <Mail className="w-4 h-4 mr-2" />
                        {booking.email}
                      </div>
                      <div className="flex items-center text-gray">
                        <Phone className="w-4 h-4 mr-2" />
                        {booking.phone}
                      </div>
                      <div className="flex items-center text-gray">
                        <Calendar className="w-4 h-4 mr-2" />
                        {format(new Date(booking.date), 'MMM dd, yyyy - h:mm a')}
                      </div>
                      <div className="flex items-center text-gray">
                        <User className="w-4 h-4 mr-2" />
                        {booking.service}
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="mb-4">
                        <div className="flex items-start text-gray">
                          <FileText className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                          <p className="text-sm">{booking.notes}</p>
                        </div>
                      </div>
                    )}

                    {booking.file && (
                      <div className="mb-4">
                        <a 
                          href={booking.file} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 text-sm inline-flex items-center"
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          View Attached File
                        </a>
                      </div>
                    )}

                    <p className="text-xs text-gray">
                      Submitted: {format(new Date(booking.createdAt), 'MMM dd, yyyy - h:mm a')}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t">
                  {booking.status !== 'confirmed' && (
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Confirm
                    </button>
                  )}
                  {booking.status !== 'cancelled' && (
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  {booking.status !== 'pending' && (
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'pending')}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Mark Pending
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default BookingManager;