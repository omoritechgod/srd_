```typescript
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  AlertTriangle, 
  BookOpen, 
  Globe, 
  Languages, 
  Users,
  X,
  ArrowRight
} from 'lucide-react';

interface Solution {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  image: string;
}

const Solutions: React.FC = () => {
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);

  const solutions: Solution[] = [
    {
      id: 'media-relations',
      icon: MessageSquare,
      title: 'Media Relations',
      description: 'Build strong relationships with media outlets and secure strategic coverage that amplifies your message.',
      features: [
        'Press release writing and distribution',
        'Media list building and outreach',
        'Interview preparation and training',
        'Media monitoring and analysis',
        'Relationship management with key journalists'
      ],
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 'crisis-communication',
      icon: AlertTriangle,
      title: 'Crisis Communication Management',
      description: 'Navigate challenging situations with strategic crisis communication that protects and rebuilds your reputation.',
      features: [
        'Crisis communication planning',
        'Rapid response strategies',
        'Stakeholder communication',
        'Reputation management',
        'Post-crisis analysis and improvement'
      ],
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 'brand-storytelling',
      icon: BookOpen,
      title: 'Brand Storytelling',
      description: 'Craft compelling narratives that resonate with your audience and differentiate your brand in the marketplace.',
      features: [
        'Brand narrative development',
        'Content strategy and creation',
        'Storytelling workshops',
        'Brand voice and messaging',
        'Multi-channel content distribution'
      ],
      image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 'language-interpretation',
      icon: Globe,
      title: 'Language Interpretation',
      description: 'Professional interpretation services that break down language barriers and facilitate clear communication.',
      features: [
        'Simultaneous interpretation',
        'Consecutive interpretation',
        'Conference and event interpretation',
        'Business meeting interpretation',
        'Technical and specialized interpretation'
      ],
      image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 'language-translation',
      icon: Languages,
      title: 'Language Translation',
      description: 'Accurate and culturally sensitive translation services that preserve meaning and intent across languages.',
      features: [
        'Document translation',
        'Website localization',
        'Marketing material translation',
        'Technical translation',
        'Certified translation services'
      ],
      image: 'https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 'bespoke-consultancy',
      icon: Users,
      title: 'Bespoke Consultancy',
      description: 'Customized consulting solutions tailored to your unique challenges and organizational needs.',
      features: [
        'Strategic communication planning',
        'Organizational communication audits',
        'Training and capacity building',
        'Change communication strategies',
        'Executive communication coaching'
      ],
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
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
              Our <span className="text-primary">Solutions</span>
            </h1>
            <p className="text-xl text-gray max-w-3xl mx-auto">
              Comprehensive communications services designed to help your organization 
              connect, engage, and succeed in today's dynamic landscape.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {solutions.map((solution) => (
              <motion.div
                key={solution.id}
                variants={cardVariants}
                whileHover={{ y: -10 }}
                className="card p-6 cursor-pointer group"
                onClick={() => setSelectedSolution(solution)}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <solution.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-dark mb-3 group-hover:text-primary transition-colors duration-300">
                  {solution.title}
                </h3>
                <p className="text-gray mb-4">{solution.description}</p>
                <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Solution Modal */}
      <AnimatePresence>
        {selectedSolution && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedSolution(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img 
                  src={selectedSolution.image} 
                  alt={selectedSolution.title}
                  className="w-full h-64 object-cover rounded-t-2xl"
                />
                <button
                  onClick={() => setSelectedSolution(null)}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <selectedSolution.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold text-dark">{selectedSolution.title}</h2>
                </div>
                
                <p className="text-lg text-gray mb-8">{selectedSolution.description}</p>
                
                <h3 className="text-xl font-semibold text-dark mb-4">What We Offer:</h3>
                <ul className="space-y-3 mb-8">
                  {selectedSolution.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="btn-primary flex-1">
                    Get Started
                  </button>
                  <button 
                    onClick={() => setSelectedSolution(null)}
                    className="btn-secondary flex-1"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Solutions;
```