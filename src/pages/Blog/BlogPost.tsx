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
  created_at: string;
}

// Hardcoded blogs
const HARDCODED_BLOGS: Record<string, BlogPost> = {
  'future-of-strategic-communications': {
    id: 'hardcoded-1',
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
    created_at: new Date('2024-01-15').toISOString()
  },
  'crisis-communication-best-practices': {
    id: 'hardcoded-2',
    title: 'Crisis Communication Best Practices',
    slug: 'crisis-communication-best-practices',
    content: `<h2>Understanding Crisis Communication</h2>
    <p>When crisis strikes, having a well-prepared communication strategy is essential for protecting your organization's reputation and maintaining stakeholder trust. Effective crisis communication can make the difference between a temporary setback and a lasting reputational disaster.</p>
    
    <h2>Key Principles of Crisis Communication</h2>
    <ul>
      <li><strong>Speed:</strong> Respond quickly with accurate information. In a crisis, silence creates a vacuum that others will fill with speculation.</li>
      <li><strong>Transparency:</strong> Be honest about what happened and what you're doing to address it. Covering up only makes things worse.</li>
      <li><strong>Consistency:</strong> Ensure all communications align with your core message across all channels and spokespeople.</li>
      <li><strong>Empathy:</strong> Show understanding and concern for those affected. People need to know you care about the impact.</li>
    </ul>
    
    <h2>The Crisis Communication Plan</h2>
    <p>Every organization should have a crisis communication plan that includes:</p>
    <ul>
      <li>Designated crisis response team with clear roles</li>
      <li>Pre-approved messaging templates</li>
      <li>Media contact protocols</li>
      <li>Stakeholder communication channels</li>
      <li>Regular training and simulation exercises</li>
    </ul>
    
    <h2>Preparation is Key</h2>
    <p>Organizations that invest in crisis communication planning before issues arise are better positioned to navigate challenges effectively. Don't wait for a crisis to think about how you'll respond—prepare now.</p>`,
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Crisis', 'Management', 'Strategy'],
    created_at: new Date('2024-02-20').toISOString()
  },
  'building-brand-through-storytelling': {
    id: 'hardcoded-3',
    title: 'Building Your Brand Through Storytelling',
    slug: 'building-brand-through-storytelling',
    content: `<h2>The Power of Stories</h2>
    <p>In today's crowded marketplace, storytelling has become one of the most effective tools for building meaningful connections with your audience. Facts tell, but stories sell—and more importantly, stories create emotional bonds that facts alone cannot achieve.</p>
    
    <h2>Why Storytelling Matters</h2>
    <p>Human beings are wired for stories. From ancient cave paintings to modern social media, we've always used stories to make sense of the world, share experiences, and build communities. When you tell your brand's story effectively, you:</p>
    <ul>
      <li>Create emotional connections with your audience</li>
      <li>Make your brand memorable and distinctive</li>
      <li>Build trust through authenticity</li>
      <li>Inspire action and loyalty</li>
    </ul>
    
    <h2>Elements of Great Brand Stories</h2>
    <ul>
      <li><strong>Authenticity:</strong> Tell true stories that reflect your actual values and experiences. Audiences can detect inauthentic narratives.</li>
      <li><strong>Emotion:</strong> Connect with your audience on a human level. Great stories make people feel something.</li>
      <li><strong>Consistency:</strong> Maintain a coherent narrative across all channels and touchpoints.</li>
      <li><strong>Impact:</strong> Show how your brand makes a difference in people's lives or the world.</li>
      <li><strong>Relatability:</strong> Feature characters and situations your audience can identify with.</li>
    </ul>
    
    <h2>Making It Work</h2>
    <p>Successful brand storytelling requires careful planning, authentic voices, and a commitment to sharing stories that resonate with your target audience. Start by identifying your brand's core narrative—why you exist, what you stand for, and how you make a difference. Then, find ways to tell that story through customer testimonials, behind-the-scenes content, founder stories, and impact narratives.</p>
    
    <h2>The Long Game</h2>
    <p>Remember, brand storytelling is not a one-time campaign—it's an ongoing conversation with your audience. Keep your stories fresh, relevant, and aligned with your brand values, and you'll build the kind of lasting relationships that turn customers into advocates.</p>`,
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Branding', 'Storytelling', 'Marketing'],
    created_at: new Date('2024-03-10').toISOString()
  }
};

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      try {
        // First check if it's a hardcoded blog
        if (HARDCODED_BLOGS[slug]) {
          setPost(HARDCODED_BLOGS[slug]);
          setLoading(false);
          return;
        }

        // If not hardcoded, fetch from API
        const response = await api.get(`/blog/${slug}`);
        
        let data = response.data;
        if (data.success && data.data) {
          data = data.data;
        }
        
        setPost(data);
      } catch (error) {
        console.error('Failed to fetch blog post:', error);
        setPost(null);
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
      }).catch(err => console.log('Share failed:', err));
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
          <p className="text-gray mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog" className="btn-primary">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Unknown date' : format(date, 'MMMM dd, yyyy');
    } catch {
      return 'Unknown date';
    }
  };

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
                {formatDate(post.created_at)}
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
              style={{
                fontSize: '1.125rem',
                lineHeight: '1.75'
              }}
            />
          </motion.div>

          {/* Share Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 pt-8 border-t border-gray-200"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
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
