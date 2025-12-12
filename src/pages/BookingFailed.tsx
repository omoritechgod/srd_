import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, RefreshCw, Home, Phone, Mail, ArrowLeft } from 'lucide-react';

const BookingFailed: React.FC = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking_id');
  const error = searchParams.get('error') || 'Payment was not completed';

  const commonIssues = [
    {
      issue: 'Payment Declined',
      solution: 'Check your card details and ensure you have sufficient funds, then try again.'
    },
    {
      issue: 'Network Timeout',
      solution: 'Your internet connection may have been interrupted. Please try booking again.'
    },
    {
      issue: 'Bank Authorization',
      solution: 'Your bank may have blocked the transaction. Contact your bank or try a different card.'
    },
    {
      issue: 'Session Expired',
      solution: 'Your booking session may have expired. Please start the booking process again.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center"
      >
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <XCircle className="w-12 h-12 text-red-600" />
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            Booking Not Completed
          </h1>
          
          <p className="text-xl text-gray mb-2">
            We're sorry, but there was an issue processing your booking.
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-700 font-medium">
              Error: {error}
            </p>
            {bookingId && (
              <p className="text-red-600 text-sm mt-2">
                Booking ID: {bookingId}
              </p>
            )}
          </div>
        </motion.div>

        {/* Common Issues */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gray-50 rounded-2xl p-6 mb-8 text-left"
        >
          <h3 className="text-lg font-semibold text-dark mb-4 text-center">Common Issues & Solutions</h3>
          
          <div className="space-y-4">
            {commonIssues.map((item, index) => (
              <div key={index} className="border-l-4 border-primary pl-4">
                <h4 className="font-medium text-dark">{item.issue}</h4>
                <p className="text-gray text-sm">{item.solution}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <Link to="/booking" className="btn-primary flex items-center justify-center flex-1">
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Booking Again
          </Link>
          
          <Link to="/" className="btn-secondary flex items-center justify-center flex-1">
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="bg-primary/10 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-dark mb-4">Need Help?</h3>
          <p className="text-gray mb-4">
            If you continue to experience issues, please don't hesitate to contact our support team.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="tel:+2348165045779" 
              className="flex items-center justify-center bg-white hover:bg-gray-50 text-dark px-4 py-2 rounded-lg transition-colors"
            >
              <Phone className="w-4 h-4 mr-2" />
              +234 705 841 2630
            </a>
            
            <a 
              href="mailto:info@srdconsultingltd.com" 
              className="flex items-center justify-center bg-white hover:bg-gray-50 text-dark px-4 py-2 rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4 mr-2" />
              info@srdconsultingltd.com
            </a>
          </div>
        </motion.div>

        {/* Alternative Options */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-8 pt-6 border-t border-gray-200"
        >
          <p className="text-sm text-gray mb-4">
            You can also reach out to us directly to schedule your consultation manually.
          </p>
          
          <Link 
            to="/contact" 
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Contact Us Directly
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BookingFailed;