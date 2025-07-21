```typescript
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Trash2, Star, User } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../services/api';

interface Testimonial {
  id: string;
  name: string;
  org?: string;
  rating?: number;
  text: string;
  photo?: string;
  approved: boolean;
  createdAt: string;
}

const TestimonialManager: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await api.get('/testimonials/admin');
      setTestimonials(response.data);
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveTestimonial = async (id: string) => {
    try {
      await api.post(`/testimonials/${id}/approve`);
      await fetchTestimonials();
    } catch (error) {
      console.error('Failed to approve testimonial:', error);
      alert('Failed to approve testimonial. Please try again.');
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      await api.delete(`/testimonials/${id}/delete`);
      await fetchTestimonials();
    } catch (error) {
      console.error('Failed to delete testimonial:', error);
      alert('Failed to delete testimonial. Please try again.');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const filteredTestimonials = testimonials.filter(testimonial => {
    if (filter === 'pending') return !testimonial.approved;
    if (filter === 'approved') return testimonial.approved;
    return true;
  });

  const stats = {
    total: testimonials.length,
    pending: testimonials.filter(t => !t.approved).length,
    approved: testimonials.filter(t => t.approved).length
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
              <h1 className="text-2xl font-bold text-dark">Testimonial Management</h1>
              <p className="text-gray">Review and approve client testimonials</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray">Total Testimonials</p>
                <p className="text-2xl font-bold text-dark">{stats.total}</p>
              </div>
              <User className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray">Pending Review</p>
                <p className="text-2xl font-bold text-orange-500">{stats.pending}</p>
              </div>
              <X className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray">Approved</p>
                <p className="text-2xl font-bold text-green-500">{stats.approved}</p>
              </div>
              <Check className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            {[
              { key: 'all', label: 'All Testimonials' },
              { key: 'pending', label: 'Pending Review' },
              { key: 'approved', label: 'Approved' }
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
        </motion.div>

        {/* Testimonials List */}
        <div className="space-y-6">
          {filteredTestimonials.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark mb-2">
                No testimonials found
              </h3>
              <p className="text-gray">
                {filter === 'pending' 
                  ? 'No testimonials are pending review'
                  : filter === 'approved'
                  ? 'No testimonials have been approved yet'
                  : 'No testimonials have been submitted yet'
                }
              </p>
            </div>
          ) : (
            filteredTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl shadow-sm p-6 ${
                  !testimonial.approved ? 'border-l-4 border-orange-500' : 'border-l-4 border-green-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      {testimonial.photo ? (
                        <img 
                          src={testimonial.photo} 
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover mr-4"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                          <User className="w-6 h-6 text-gray" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-dark">{testimonial.name}</h3>
                        {testimonial.org && (
                          <p className="text-gray">{testimonial.org}</p>
                        )}
                      </div>
                    </div>

                    {testimonial.rating && (
                      <div className="flex items-center mb-3">
                        {renderStars(testimonial.rating)}
                        <span className="ml-2 text-sm text-gray">
                          {testimonial.rating}/5 stars
                        </span>
                      </div>
                    )}

                    <p className="text-dark mb-4 leading-relaxed">
                      "{testimonial.text}"
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          testimonial.approved 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {testimonial.approved ? 'Approved' : 'Pending Review'}
                        </span>
                        <span className="text-sm text-gray">
                          Submitted: {format(new Date(testimonial.createdAt), 'MMM dd, yyyy')}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        {!testimonial.approved && (
                          <button
                            onClick={() => approveTestimonial(testimonial.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm inline-flex items-center transition-colors"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => deleteTestimonial(testimonial.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm inline-flex items-center transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default TestimonialManager;
```