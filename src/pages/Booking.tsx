import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { Calendar, Clock, Send, Upload, X, ArrowLeft, ArrowRight, CheckCircle, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import api from '../services/api';
import 'react-datepicker/dist/react-datepicker.css';
import { uploadToCloudinary, SRD_CLOUDINARY_CONFIG } from '../utils/cloudinaryUpload';

interface BookingForm {
  name: string;
  email: string;
  phone: string;
  service: string;
  notes?: string;
}

interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

interface AvailabilityResponse {
  date: string;
  slots: TimeSlot[];
}

interface BookingResponse {
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    phone: string;
    service: string;
    date: string;
    status: string;
    notes?: string;
    created_at: string;
    updated_at: string;
  };
  payment_link: string;
}

interface PaymentInitResponse {
  payment_url: string;
  reference: string;
}

interface BookingError {
  message: string;
  suggestions?: TimeSlot[];
}

type BookingStep = 'date' | 'time' | 'details' | 'processing' | 'payment-init';

const Booking: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<BookingStep>('date');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [error, setError] = useState<string>('');
  const [bookingError, setBookingError] = useState<BookingError | null>(null);
  const [processingMessage, setProcessingMessage] = useState<string>('');

  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<BookingForm>();

  const services = [
    'Media Relations',
    'Crisis Communication Management',
    'Brand Storytelling',
    'Language Interpretation',
    'Language Translation',
    'Bespoke Consultancy'
  ];

  const checkAvailability = async (date: Date) => {
    setLoadingSlots(true);
    setError('');
    setBookingError(null);
    
    try {
      const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      console.log('Checking availability for date:', formattedDate);
      
      const response = await api.get<AvailabilityResponse>(`/availability?date=${formattedDate}`);
      console.log('Availability response:', response.data);
      
      setAvailableSlots(response.data.slots);
      setCurrentStep('time');
    } catch (error: any) {
      console.error('Failed to check availability:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to check availability. Please try again.');
      }
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateSelect = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setSelectedTimeSlot(null);
      checkAvailability(date);
    }
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedTimeSlot(slot);
      setCurrentStep('details');
      setBookingError(null);
    }
  };

  const handleSuggestionSelect = (suggestion: TimeSlot) => {
    // Parse the suggestion date to set the new selected date
    const suggestionDate = new Date(suggestion.start);
    setSelectedDate(suggestionDate);
    setSelectedTimeSlot(suggestion);
    setCurrentStep('details');
    setBookingError(null);
  };

  const onSubmit = async (data: BookingForm) => {
    if (!selectedDate || !selectedTimeSlot) {
      setError('Please select a date and time slot');
      return;
    }

    setSubmitting(true);
    setCurrentStep('processing');
    setError('');
    setBookingError(null);
    
    try {
      setProcessingMessage('Agent Checking slot availability...');
      
      // First, let's double-check availability for the selected slot
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const availabilityCheck = await api.get<AvailabilityResponse>(`/availability?date=${formattedDate}`);
      
      // Find the selected slot in the current availability
      const currentSlot = availabilityCheck.data.slots.find(slot => 
        slot.start === selectedTimeSlot.start && slot.end === selectedTimeSlot.end
      );
      
      if (!currentSlot || !currentSlot.available) {
        // Slot is no longer available, show suggestions
        const availableAlternatives = availabilityCheck.data.slots.filter(slot => slot.available);
        setBookingError({
          message: 'The selected slot is no longer available. Please choose another time.',
          suggestions: availableAlternatives
        });
        setCurrentStep('details');
        return;
      }

      setProcessingMessage('Submitting your booking request our agent is on it ...');
      console.log('Submitting booking with data:', {
        ...data,
        date: selectedTimeSlot.start,
        file_url: uploadedFileUrl
      });

      const bookingData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        service: data.service,
        date: selectedTimeSlot.start, // Already in YYYY-MM-DD HH:mm:ss format
        notes: data.notes || '',
        ...(uploadedFileUrl && { file_url: uploadedFileUrl })
      };

      const response = await api.post<BookingResponse>('/bookings', bookingData);

      console.log('Booking response:', response.data);

      // Extract booking ID from response
      const bookingId = response.data.data.id;
      
      setProcessingMessage('Initializing secure payment...');
      setCurrentStep('payment-init');

      // Initialize payment with the booking ID
      const paymentResponse = await api.post<PaymentInitResponse>(`/payment/initialize/${bookingId}`);
      console.log('Payment initialization response:', paymentResponse.data);

      // Redirect to Paystack payment URL
      if (paymentResponse.data.payment_url) {
        setProcessingMessage('Redirecting to secure payment...');
        setTimeout(() => {
          window.location.href = paymentResponse.data.payment_url;
        }, 1500);
      } else {
        throw new Error('No payment URL received from payment initialization');
      }

    } catch (error: any) {
      console.error('Failed to submit booking:', error);
      
      // Handle slot occupation error with suggestions
      if (error.response?.status === 422 && error.response?.data?.suggestions) {
        setBookingError({
          message: error.response.data.message,
          suggestions: error.response.data.suggestions
        });
        setCurrentStep('details'); // Stay on details step to show suggestions
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
        setCurrentStep('details');
      } else {
        setError('Failed to submit booking. Please try again.');
        setCurrentStep('details');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      // Check file type
      const allowedTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/jpg',
        'image/png'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a valid file type (PDF, DOC, DOCX, TXT, JPG, PNG)');
        return;
      }
      
      setUploadedFile(file);
      setUploadingFile(true);
      setError(''); // Clear any previous error
      
      try {
        const result = await uploadToCloudinary(file, SRD_CLOUDINARY_CONFIG);
        
        if (result.success && result.url) {
          setUploadedFileUrl(result.url);
          console.log('File uploaded to Cloudinary:', result.url);
        } else {
          throw new Error(result.error || 'Upload failed');
        }
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        setError('Upload failed. Please try again.');
        setUploadedFile(null);
      } finally {
        setUploadingFile(false);
      }
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadedFileUrl('');
  };

  const goBack = () => {
    setBookingError(null);
    setError('');
    switch (currentStep) {
      case 'time':
        setCurrentStep('date');
        setSelectedDate(null);
        setAvailableSlots([]);
        break;
      case 'details':
        setCurrentStep('time');
        setSelectedTimeSlot(null);
        break;
    }
  };

  const formatTimeSlot = (start: string, end: string) => {
    const startTime = new Date(start).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    const endTime = new Date(end).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    return `${startTime} - ${endTime}`;
  };

  const formatSuggestionDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">
              Book Your <span className="text-primary">Consultation</span>
            </h1>
            <p className="text-xl text-gray max-w-3xl mx-auto">
              Ready to transform your communications strategy? Follow our simple 3-step process 
              to schedule and secure your consultation with our expert team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Progress Indicator */}
      <section className="bg-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 'date', label: 'Select Date', icon: Calendar },
              { step: 'time', label: 'Choose Time', icon: Clock },
              { step: 'details', label: 'Your Details', icon: Send }
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                  currentStep === item.step || 
                  (currentStep === 'time' && item.step === 'date') ||
                  (currentStep === 'details' && (item.step === 'date' || item.step === 'time')) ||
                  (currentStep === 'processing' && item.step !== 'processing') ||
                  (currentStep === 'payment-init' && item.step !== 'payment-init')
                    ? 'bg-primary border-primary text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className={`ml-3 font-medium ${
                  currentStep === item.step ? 'text-primary' : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
                {index < 2 && (
                  <ArrowRight className="w-5 h-5 text-gray-300 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Error Display */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => setError('')}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Booking Error with Suggestions */}
      {bookingError && (
        <div className="max-w-4xl mx-auto px-4 mb-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-5 h-5 text-orange-500 mr-3" />
              <h3 className="text-lg font-semibold text-orange-800">Slot No Longer Available</h3>
            </div>
            <p className="text-orange-700 mb-4">{bookingError.message}</p>
            
            {bookingError.suggestions && bookingError.suggestions.length > 0 && (
              <div>
                <h4 className="font-medium text-orange-800 mb-3">Available Alternative Slots:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {bookingError.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionSelect(suggestion)}
                      className="bg-white border border-orange-200 rounded-lg p-4 text-left hover:bg-orange-50 transition-colors"
                    >
                      <div className="font-medium text-dark">
                        {formatSuggestionDate(suggestion.start)}
                      </div>
                      <div className="text-primary">
                        {formatTimeSlot(suggestion.start, suggestion.end)}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => setBookingError(null)}
                    className="btn-secondary"
                  >
                    Choose Different Date
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Booking Steps */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Step 1: Date Selection */}
          {currentStep === 'date' && (
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-dark mb-4">
                  Select Your Preferred Date
                </h2>
                <p className="text-gray">
                  Choose a date to see available consultation slots (3 slots per day)
                </p>
              </div>

              <div className="flex justify-center">
                <div className="relative">
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateSelect}
                    minDate={new Date()}
                    maxDate={new Date(Date.now() + 120 * 24 * 60 * 60 * 1000)} // 4 months ahead
                    inline
                    className="border-0"
                    calendarClassName="shadow-lg border-0"
                  />
                  {loadingSlots && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="text-primary font-medium">Checking availability...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Time Slot Selection */}
          {currentStep === 'time' && (
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
            >
              <div className="text-center mb-8">
                <button
                  onClick={goBack}
                  className="inline-flex items-center text-gray hover:text-primary mb-4 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Change Date
                </button>
                <h2 className="text-2xl md:text-3xl font-bold text-dark mb-4">
                  Available Time Slots
                </h2>
                <p className="text-gray">
                  {selectedDate && `Available slots for ${selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}`}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {availableSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => handleTimeSlotSelect(slot)}
                    disabled={!slot.available}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      slot.available
                        ? selectedTimeSlot === slot
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 hover:border-primary hover:bg-primary/5'
                        : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {formatTimeSlot(slot.start, slot.end)}
                    </div>
                    {!slot.available && (
                      <div className="text-xs mt-1">Not Available</div>
                    )}
                  </button>
                ))}
              </div>

              {availableSlots.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray text-lg">No available slots for this date.</p>
                  <button
                    onClick={goBack}
                    className="btn-secondary mt-4"
                  >
                    Choose Another Date
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 3: Details Form */}
          {currentStep === 'details' && (
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
            >
              <div className="text-center mb-8">
                <button
                  onClick={goBack}
                  className="inline-flex items-center text-gray hover:text-primary mb-4 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Change Time
                </button>
                <h2 className="text-2xl md:text-3xl font-bold text-dark mb-4">
                  Your Details
                </h2>
                <div className="bg-primary/10 rounded-lg p-4 mb-6">
                  <p className="text-primary font-medium">
                    Selected: {selectedDate?.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} at {selectedTimeSlot && formatTimeSlot(selectedTimeSlot.start, selectedTimeSlot.end)}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Full Name *
                    </label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      className="input-field"
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Email Address *
                    </label>
                    <input
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      type="email"
                      className="input-field"
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Phone Number *
                    </label>
                    <input
                      {...register('phone', { required: 'Phone number is required' })}
                      type="tel"
                      className="input-field"
                      placeholder="08101234567"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Service Interested In *
                    </label>
                    <select
                      {...register('service', { required: 'Please select a service' })}
                      className="input-field"
                    >
                      <option value="">Select a service</option>
                      {services.map(service => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                    {errors.service && (
                      <p className="text-red-500 text-sm mt-1">{errors.service.message}</p>
                    )}
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={4}
                    className="input-field resize-none"
                    placeholder="Tell us more about your project, goals, or any specific requirements..."
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Attach Files (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                    {uploadedFile && !uploadingFile ? (
                      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-green-500 mr-3" />
                          <span className="text-sm text-dark">{uploadedFile.name}</span>
                          {uploadedFileUrl && (
                            <span className="ml-2 text-xs text-green-600">✓ Uploaded</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : uploadingFile ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
                        <span className="text-primary">Uploading file...</span>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-8 h-8 text-gray mx-auto mb-2" />
                        <p className="text-gray mb-2">
                          Upload project briefs, drafts, or relevant documents
                        </p>
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                        />
                        <label
                          htmlFor="file-upload"
                          className="btn-secondary cursor-pointer inline-block"
                        >
                          Choose File
                        </label>
                        <p className="text-xs text-gray mt-2">
                          Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || uploadingFile}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Send className="w-5 h-5 mr-2" />
                  {uploadingFile ? 'Uploading File...' : 'Proceed to Payment'}
                </button>
              </form>
            </motion.div>
          )}

          {/* Processing State */}
          {(currentStep === 'processing' || currentStep === 'payment-init') && (
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center"
            >
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold text-dark mb-4">
                {currentStep === 'processing' ? 'Processing Your Booking' : 'Initializing Payment'}
              </h2>
              <p className="text-gray mb-4">
                {processingMessage || 'Please wait while we process your request...'}
              </p>
              <div className="bg-primary/10 rounded-lg p-4">
                <p className="text-primary text-sm">
                  🔒 Your information is secure and encrypted. Please do not close this window.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* What to Expect */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              What Happens Next?
            </h2>
            <p className="text-xl text-gray max-w-3xl mx-auto">
              Here's what you can expect after completing your booking and payment
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Secure Payment',
                description: 'Complete your payment securely through Paystack to confirm your consultation slot.'
              },
              {
                step: '02',
                title: 'Instant Confirmation',
                description: 'Receive immediate email confirmation with your booking details and next steps.'
              },
              {
                step: '03',
                title: 'Meeting Link',
                description: 'Our team will send you the meeting link and any preparation materials before your consultation.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-dark mb-3">{item.title}</h3>
                <p className="text-gray">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Booking;
