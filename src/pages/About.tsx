```typescript
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Heart } from 'lucide-react';
import api from '../services/api';

interface AboutContent {
  content: string;
  image?: string;
}

const About: React.FC = () => {
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    content: 'Loading...'
  });

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const response = await api.get('/about');
        setAboutContent(response.data);
      } catch (error) {
        console.error('Failed to fetch about content:', error);
        // Fallback content
        setAboutContent({
          content: `SRD Consulting Ltd is a premier communications and public relations firm dedicated to helping organizations navigate the complex landscape of modern communication. 

Founded on the principles of strategic thinking, creative execution, and measurable results, we provide tailored solutions that drive meaningful engagement and business growth.

Our team of seasoned professionals brings together decades of experience in media relations, crisis communication, brand storytelling, and strategic consultancy. We understand that every organization has a unique story to tell, and we're here to help you tell it effectively.

Whether you're looking to build brand awareness, manage a crisis, or develop a comprehensive communication strategy, SRD Consulting is your trusted partner in achieving communication excellence.`,
          image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800'
        });
      }
    };

    fetchAboutContent();
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const values = [
    {
      icon: Target,
      title: 'Mission',
      description: 'To empower organizations with strategic communications that drive meaningful connections and measurable results.'
    },
    {
      icon: Eye,
      title: 'Vision',
      description: 'To be the leading communications consultancy that transforms how organizations connect with their audiences.'
    },
    {
      icon: Heart,
      title: 'Values',
      description: 'Integrity, Excellence, Innovation, and Client-Centricity guide everything we do.'
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">
              About <span className="text-primary">SRD Consulting</span>
            </h1>
            <p className="text-xl text-gray max-w-3xl mx-auto">
              Strategic communications experts dedicated to helping organizations 
              tell their stories and build meaningful connections.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="prose prose-lg max-w-none">
                {aboutContent.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative z-10">
                <img 
                  src={aboutContent.image || 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800'} 
                  alt="About SRD Consulting" 
                  className="rounded-2xl shadow-2xl w-full"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-full h-full bg-primary/20 rounded-2xl -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              Our Foundation
            </h2>
            <p className="text-xl text-gray max-w-3xl mx-auto">
              Built on strong principles that guide our approach to every client relationship and project.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {values.map((value, index) => (
              <motion.div key={index} variants={fadeInUp} className="card p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-dark mb-4">{value.title}</h3>
                <p className="text-gray">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section (Placeholder for future) */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
              Expert Team
            </h2>
            <p className="text-xl text-gray mb-8 max-w-3xl mx-auto">
              Our diverse team of communications professionals brings together decades of experience 
              across various industries and specializations.
            </p>
            <div className="bg-white rounded-2xl p-12 shadow-lg">
              <p className="text-lg text-gray italic">
                "Team profiles and detailed bios will be added here as the organization grows. 
                Our current focus is on delivering exceptional results for our clients."
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
```