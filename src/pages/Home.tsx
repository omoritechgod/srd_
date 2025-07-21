import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, Users, BookOpen, Star } from 'lucide-react';

const Home: React.FC = () => {
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
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 to-primary/5 min-h-screen flex items-center">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23F58220" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto section-padding relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-dark mb-6 leading-tight">
                Strategic Communications
                <span className="text-primary block">That Matter</span>
              </h1>
              <p className="text-xl text-gray mb-8 leading-relaxed">
                We help organizations tell their stories effectively, build meaningful connections, 
                and navigate complex communication challenges with strategic precision.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/solutions" className="btn-primary inline-flex items-center">
                  Explore Solutions
                  <ArrowRight className="ml-2" size={20} />
                </Link>
                <Link to="/booking" className="btn-secondary">
                  Book Consultation
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <img 
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Strategic Communications" 
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-full h-full bg-primary/20 rounded-2xl -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            {[
              { icon: MessageSquare, title: 'Solutions', desc: 'Strategic PR & Communications', link: '/solutions' },
              { icon: BookOpen, title: 'Book Appointment', desc: 'Schedule Your Consultation', link: '/booking' },
              { icon: Users, title: 'Blog', desc: 'Insights & Thought Leadership', link: '/blog' },
              { icon: Star, title: 'Testimonials', desc: 'Client Success Stories', link: '/testimonials' },
            ].map((item, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Link to={item.link} className="card p-6 block group">
                  <item.icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-semibold text-dark mb-2">{item.title}</h3>
                  <p className="text-gray">{item.desc}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
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
              Why Choose SRD Consulting?
            </h2>
            <p className="text-xl text-gray max-w-3xl mx-auto">
              We combine strategic thinking with creative execution to deliver communications 
              solutions that drive real results for your organization.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'Strategic Approach',
                desc: 'Every campaign is built on deep research and strategic insights tailored to your unique challenges.',
                image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400'
              },
              {
                title: 'Proven Results',
                desc: 'Our track record speaks for itself - measurable outcomes that drive business growth.',
                image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400'
              },
              {
                title: 'Expert Team',
                desc: 'Seasoned professionals with deep industry knowledge and creative problem-solving skills.',
                image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400'
              },
            ].map((item, index) => (
              <motion.div key={index} variants={fadeInUp} className="card overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-dark mb-3">{item.title}</h3>
                  <p className="text-gray">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Communications?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Let's discuss how we can help you achieve your communication goals 
              and build stronger connections with your audience.
            </p>
            <Link to="/booking" className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center">
              Get Started Today
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;