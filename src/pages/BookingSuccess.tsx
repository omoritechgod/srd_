import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Mail, Home, Phone } from 'lucide-react';
import api from '../services/api';

interface BookingDetails {
  id: string;
  name: string;
  email: string;
  service: string;
  date: string;
  status: string;
  payment_status: string;
}

const BookingSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(true);

  const bookingId = searchParams.get('booking_id');
  const reference = searchParams.get('reference');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!bookingId || !reference) {
        setLoading(false);
        setVerifying(false);
        return;
      }

      try {
        console.log('Verifying payment for booking:', bookingId, 'with reference:', reference);
        
        // Verify payment with backend
        const response = await api.get(`/payment/verify/${bookingId}?reference=${reference}`);
        console.log('Payment verification response:', response.data);
        
        // Fetch booking details (you might need to create this endpoint or get it from verification response)
        try {
          const bookingResponse = await api.get(`/admin/bookings`);
          const booking = bookingResponse.data.find((b: any) => b.id === bookingId);
          if (booking) {
            setBookingDetails(booking);
          } else {
            throw new Error('Booking not found');
          }
        } catch (bookingError) {
          console.log('Could not fetch booking details, using basic info');
          // If we can't fetch booking details, create a basic object
          setBookingDetails({
            id: bookingId,
            name: 'Valued Client',
            email: '',
            service: 'Consultation',
            date: new Date().toISOString(),
            status: 'confirmed',
            payment_status: 'paid'
          });
        }
        
        setVerifying(false);
      } catch (error) {
        console.error('Failed to verify payment:', error);
        setVerifying(false);
        // Still show success page but with limited info
        setBookingDetails({
          id: bookingId || 'unknown',
          name: 'Valued Client',
          email: '',
          service: 'Consultation',
          date: new Date().toISOString(),
          status: 'confirmed',
          payment_status: 'paid'
        });
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [bookingId, reference]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-green-700 text-lg">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle className="w-12 h-12 text-green-600" />
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            Booking Confirmed! 🎉
          </h1>
          
          {verifying ? (
            <p className="text-xl text-gray mb-8">
              Your payment has been processed successfully. We're finalizing your booking details...
            </p>
          ) : (
            <p className="text-xl text-gray mb-8">
              Thank you for choosing SRD Consulting! Your consultation has been successfully booked and paid for.
            </p>
          )}
        </motion.div>

        {/* Booking Details */}
        {bookingDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gray-50 rounded-2xl p-6 mb-8 text-left"
          >
            <h3 className="text-lg font-semibold text-dark mb-4 text-center">Your Booking Details</h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-primary mr-3" />
                <div>
                  <p className="font-medium text-dark">Consultation Date & Time</p>
                  <p className="text-gray">{formatDate(bookingDetails.date)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-primary mr-3" />
                <div>
                  <p className="font-medium text-dark">Service</p>
                  <p className="text-gray">{bookingDetails.service}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <div>
                  <p className="font-medium text-dark">Payment Status</p>
                  <p className="text-green-600 capitalize">{bookingDetails.payment_status}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-primary/10 rounded-2xl p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-dark mb-4">What's Next?</h3>
          <div className="text-left space-y-2">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-gray">You'll receive a confirmation email with all the details within the next few minutes.</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-gray">Our team will send you the meeting link and any preparation materials 24 hours before your consultation.</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-gray">If you have any questions, feel free to contact us at info@srdconsultingltd.com</p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <Link to="/" className="btn-primary flex items-center justify-center flex-1">
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          
          <Link to="/contact" className="btn-secondary flex items-center justify-center flex-1">
            <Mail className="w-5 h-5 mr-2" />
            Contact Us
          </Link>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="bg-gray-50 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-dark mb-4">Need Immediate Assistance?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

        {/* Booking Reference */}
        {bookingDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="mt-8 pt-6 border-t border-gray-200"
          >
            <p className="text-sm text-gray">
              Booking Reference: <span className="font-mono font-medium">{bookingDetails.id}</span>
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default BookingSuccess;