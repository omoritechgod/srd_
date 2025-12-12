import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
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

// Hardcoded blogs that will always be present
const HARDCODED_BLOGS: BlogPost[] = [
  {
    id: 'hardcoded-1',
    title: 'The Future of Strategic Communications',
    slug: 'future-of-strategic-communications',
    content: 'In an increasingly digital world, strategic communications must evolve to meet new challenges and opportunities. Organizations today face a complex landscape where traditional media, social platforms, and direct communication channels all play crucial roles in shaping public perception.',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Strategy', 'Digital', 'Future'],
    created_at: new Date('2024-01-15').toISOString()
  },
  {
    id: 'hardcoded-2',
    title: 'Crisis Communication Best Practices',
    slug: 'crisis-communication-best-practices',
    content: 'When crisis strikes, having a well-prepared communication strategy is essential for protecting your organization\'s reputation and maintaining stakeholder trust. Learn the key principles of effective crisis communication.',
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Crisis', 'Management', 'Strategy'],
    created_at: new Date('2024-02-20').toISOString()
  },
  {
    id: 'hardcoded-3',
    title: 'Building Your Brand Through Storytelling',
    slug: 'building-brand-through-storytelling',
    content: 'In today\'s crowded marketplace, storytelling has become one of the most effective tools for building meaningful connections with your audience. Discover how to craft compelling brand narratives.',
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Branding', 'Storytelling', 'Marketing'],
    created_at: new Date('2024-03-10').toISOString()
  }
];

const Blog: React.FC = () => {
  const [apiPosts, setApiPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // Fetch from Laravel API
      const response = await api.get('/blog');
      
      // Handle response format
      let data = response.data;
      if (data.success && data.data) {
        data = data.data;
      } else if (!Array.isArray(data)) {
        data = [];
      }
      
      setApiPosts(data);
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
      setApiPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Combine hardcoded and API posts, then sort by date
  const allPosts = [...HARDCODED_BLOGS, ...apiPosts].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Unknown date' : format(date, 'MMM dd, yyyy');
    } catch {
      return 'Unknown date';
    }
  };

  const getPostTags = (post: BlogPost): string[] => {
    return Array.isArray(post.tags) ? post.tags : [];
  };

  const filteredPosts = allPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const postTags = getPostTags(post);
    const matchesTag = !selectedTag || postTags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(allPosts.flatMap(post => getPostTags(post))));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

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
              Insights & <span className="text-primary">Thought Leadership</span>
            </h1>
            <p className="text-xl text-gray max-w-3xl mx-auto">
              Stay informed with the latest trends, strategies, and insights in communications and public relations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="input-field md:w-48"
              >
                <option value="">All Categories</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card overflow-hidden group"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={post.image || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'} 
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(post.created_at)}
                    <User className="w-4 h-4 ml-4 mr-2" />
                    SRD Team
                  </div>
                  
                  <h2 className="text-xl font-semibold text-dark mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray mb-4 line-clamp-3">
                    {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {getPostTags(post).map(tag => (
                      <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <Link 
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform"
                  >
                    Read More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray">No articles found matching your criteria.</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTag('');
                }}
                className="btn-primary mt-6"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
              Want to Stay Updated?
            </h2>
            <p className="text-xl text-gray mb-8">
              Get the latest insights and thought leadership delivered to your inbox
            </p>
            <Link to="/contact" className="btn-primary">
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
