import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../services/api';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  image?: string;
  tags: string[];
  createdAt: string;
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      try {
        const response = await api.get(`/blog/${slug}`);
        setPost(response.data);
      } catch (error) {
        console.error('Failed to fetch blog post:', error);
        // Fallback demo post
        setPost({
          id: '1',
          title: 'The Future of Strategic Communications',
          slug: 'future-of-strategic-communications',
          content: `<h2>Introduction</h2>
          <p>In an increasingly digital world, strategic communications must evolve to meet new challenges and opportunities. Organizations today face a complex landscape where traditional media, social platforms, and direct communication channels all play crucial roles in shaping public perception.</p>
          
          <h2>The Digital Transformation</h2>
          <p>The digital revolution has fundamentally changed how we communicate. Social media platforms have democratized information sharing, giving every individual and organization a voice in the global conversation. This shift requires communications professionals to be more agile, responsive, and strategic than ever before.</p>
          
          <h2>Key Trends Shaping the Future</h2>
          <p>Several key trends are reshaping the communications landscape:</p>
          <ul>
            <li><strong>Real-time Communication:</strong> Audiences expect immediate responses and updates</li>
            <li><strong>Authenticity:</strong> Genuine, transparent communication builds trust</li>
            <li><strong>Multi-channel Approach:</strong> Integrated campaigns across multiple platforms</li>
            <li><strong>Data-driven Insights:</strong> Analytics inform strategy and measure success</li>
          </ul>
          
          <h2>Preparing for Tomorrow</h2>
          <p>Organizations that want to thrive in this new environment must invest in strategic communications that are flexible, authentic, and data-driven. The future belongs to those who can adapt quickly while maintaining their core message and values.</p>`,
          image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
          tags: ['Strategy', 'Digital', 'Future'],
          createdAt: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-dark mb-4">Post Not Found</h1>
          <Link to="/blog" className="btn-primary">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-96 overflow-hidden">
          <img 
            src={post.image || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200'} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        </div>
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto section-padding text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Link 
                to="/blog" 
                className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
              
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                {post.title}
              </h1>
              
              <div className="flex items-center text-white/80 mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                {format(new Date(post.createdAt), 'MMMM dd, yyyy')}
                <User className="w-4 h-4 ml-6 mr-2" />
                SRD Team
              </div>
              
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span 
                    key={tag}
                    className="px-3 py-1 bg-white/20 text-white text-sm rounded-full backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            <div 
              dangerouslySetInnerHTML={{ __html: post.content }}
              className="text-gray leading-relaxed"
            />
          </motion.div>

          {/* Share Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 pt-8 border-t border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-dark mb-2">Share this article</h3>
                <p className="text-gray">Help others discover this content</p>
              </div>
              <button
                onClick={handleShare}
                className="btn-primary inline-flex items-center"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>
          </motion.div>

          {/* Related Articles CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 bg-gray-50 rounded-2xl p-8 text-center"
          >
            <h3 className="text-2xl font-bold text-dark mb-4">
              Explore More Insights
            </h3>
            <p className="text-gray mb-6">
              Discover more articles and thought leadership from our team
            </p>
            <Link to="/blog" className="btn-primary">
              View All Articles
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;