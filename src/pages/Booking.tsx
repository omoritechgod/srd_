import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { Calendar, Clock, Send, Upload, X } from 'lucide-react';
import api from '../services/api';
import 'react-datepicker/dist/react-datepicker.css';

interface BookingForm {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: Date;
  notes?: string;
  file?: FileList;
}

const Booking: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<BookingForm>();

  const services = [
    'Media Relations',
    'Crisis Communication Management',
    'Brand Storytelling',
    'Language Interpretation',
    'Language Translation',
    'Bespoke Consultancy'
  ];

  const onSubmit = async (data: BookingForm) => {
    if (!selectedDate) {
      alert('Please select a date and time');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('service', data.service);

      // ✅ Format date for MySQL
      const formattedDate = selectedDate.toISOString().replace('T', ' ').replace('Z', '').slice(0, 19);
      formData.append('date', formattedDate);

      formData.append('notes', data.notes || '');
      if (uploadedFile) {
        formData.append('file', uploadedFile);
      }

      await api.post('/bookings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSubmitted(true);
      reset();
      setSelectedDate(null);
      setUploadedFile(null);
    } catch (error) {
      console.error('Failed to submit booking:', error);
      alert('Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };


  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setValue('file', undefined);
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
              Ready to transform your communications strategy? Schedule a consultation 
              with our expert team to discuss your unique challenges and goals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-50 rounded-2xl p-8 md:p-12 text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-dark mb-4">Booking Confirmed!</h2>
              <p className="text-xl text-gray mb-8">
                Thank you for booking a consultation with SRD Consulting. 
                We'll be in touch within 24 hours to confirm your appointment details.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-primary"
              >
                Book Another Consultation
              </button>
            </motion.div>
          ) : (
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-dark mb-4">
                  Let's Get Started
                </h2>
                <p className="text-gray">
                  Fill out the form below and we'll schedule your consultation
                </p>
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
                      placeholder="+234 816 504 5779"
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

                {/* Date and Time */}
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Preferred Date & Time *
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={30}
                      dateFormat="MMMM d, yyyy h:mm aa"
                      minDate={new Date()}
                      className="input-field w-full"
                      placeholderText="Select date and time"
                      required
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray w-5 h-5 pointer-events-none" />
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
                    {uploadedFile ? (
                      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <Upload className="w-5 h-5 text-primary mr-3" />
                          <span className="text-sm text-dark">{uploadedFile.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
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
                  disabled={submitting}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Book Consultation
                    </>
                  )}
                </button>
              </form>
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
              What to Expect
            </h2>
            <p className="text-xl text-gray max-w-3xl mx-auto">
              Here's what happens after you book your consultation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Confirmation',
                description: 'We\'ll confirm your appointment within 24 hours and send you a calendar invite.'
              },
              {
                step: '02',
                title: 'Preparation',
                description: 'Our team will review your information and prepare tailored discussion points.'
              },
              {
                step: '03',
                title: 'Consultation',
                description: 'We\'ll discuss your challenges, goals, and how we can help achieve them.'
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