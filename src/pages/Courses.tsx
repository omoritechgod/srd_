import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Bell } from 'lucide-react';

const Courses: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full animate-bounce-slow"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-primary/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-primary/15 rounded-full animate-ping"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl"
        >
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <BookOpen className="w-12 h-12 text-primary" />
          </motion.div>

          {/* Coming Soon Text */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl md:text-6xl font-bold text-dark mb-6"
          >
            <span className="text-primary">Courses</span> & Language Materials
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center bg-primary/10 text-primary px-6 py-3 rounded-full text-lg font-semibold mb-6">
              <Clock className="w-5 h-5 mr-2" />
              Coming Soon
            </div>
            
            <p className="text-xl text-gray mb-8 leading-relaxed">
              We're developing comprehensive courses and language materials to help you 
              master strategic communications. Our upcoming offerings will include:
            </p>
          </motion.div>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          >
            {[
              'Strategic Communication Masterclass',
              'Crisis Communication Toolkit',
              'Brand Storytelling Workshop',
              'Media Relations Training',
              'Language Learning Resources',
              'Professional Development Courses'
            ].map((item, index) => (
              <div key={index} className="flex items-center text-left">
                <div className="w-3 h-3 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                <span className="text-gray font-medium">{item}</span>
              </div>
            ))}
          </motion.div>

          {/* Notification Signup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="bg-gray-50 rounded-2xl p-8"
          >
            <div className="flex items-center justify-center mb-4">
              <Bell className="w-6 h-6 text-primary mr-2" />
              <h3 className="text-xl font-semibold text-dark">Get Notified</h3>
            </div>
            <p className="text-gray mb-6">
              Be the first to know when our courses and materials are available
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="input-field flex-1"
              />
              <button className="btn-primary whitespace-nowrap">
                Notify Me
              </button>
            </div>
          </motion.div>

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-8"
          >
            <a href="/" className="text-primary hover:text-primary/80 font-medium">
              ← Back to Home
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Courses;