import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Plus, Edit, Trash2, Save, X, Eye, ArrowLeft, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../../services/api';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  image?: string;
  tags: string[];
  created_at: string;
  isHardcoded?: boolean; // Flag to identify hardcoded posts
}

interface BlogForm {
  title: string;
  content: string;
  image?: FileList;
  tags: string;
}

// Hardcoded blogs that will always be present
const HARDCODED_BLOGS: BlogPost[] = [
  {
    id: 'hardcoded-1',
    title: 'The Future of Strategic Communications',
    slug: 'future-of-strategic-communications',
    content: `<h2>Introduction</h2>
    <p>In an increasingly digital world, strategic communications must evolve to meet new challenges and opportunities. Organizations today face a complex landscape where traditional media, social platforms, and direct communication channels all play crucial roles in shaping public perception.</p>
    
    <h2>The Digital Transformation</h2>
    <p>The digital revolution has fundamentally changed how we communicate. Social media platforms have democratized information sharing, giving every individual and organization a voice in the global conversation.</p>
    
    <h2>Key Trends Shaping the Future</h2>
    <ul>
      <li><strong>Real-time Communication:</strong> Audiences expect immediate responses and updates</li>
      <li><strong>Authenticity:</strong> Genuine, transparent communication builds trust</li>
      <li><strong>Multi-channel Approach:</strong> Integrated campaigns across multiple platforms</li>
      <li><strong>Data-driven Insights:</strong> Analytics inform strategy and measure success</li>
    </ul>`,
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Strategy', 'Digital', 'Future'],
    created_at: new Date('2024-01-15').toISOString(),
    isHardcoded: true
  },
  {
    id: 'hardcoded-2',
    title: 'Crisis Communication Best Practices',
    slug: 'crisis-communication-best-practices',
    content: `<h2>Understanding Crisis Communication</h2>
    <p>When crisis strikes, having a well-prepared communication strategy is essential for protecting your organization's reputation and maintaining stakeholder trust.</p>
    
    <h2>Key Principles</h2>
    <ul>
      <li><strong>Speed:</strong> Respond quickly with accurate information</li>
      <li><strong>Transparency:</strong> Be honest about what happened and what you're doing</li>
      <li><strong>Consistency:</strong> Ensure all communications align with your core message</li>
      <li><strong>Empathy:</strong> Show understanding and concern for those affected</li>
    </ul>
    
    <h2>Preparation is Key</h2>
    <p>Organizations that invest in crisis communication planning before issues arise are better positioned to navigate challenges effectively.</p>`,
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Crisis', 'Management', 'Strategy'],
    created_at: new Date('2024-02-20').toISOString(),
    isHardcoded: true
  },
  {
    id: 'hardcoded-3',
    title: 'Building Your Brand Through Storytelling',
    slug: 'building-brand-through-storytelling',
    content: `<h2>The Power of Stories</h2>
    <p>In today's crowded marketplace, storytelling has become one of the most effective tools for building meaningful connections with your audience.</p>
    
    <h2>Elements of Great Brand Stories</h2>
    <ul>
      <li><strong>Authenticity:</strong> Tell true stories that reflect your values</li>
      <li><strong>Emotion:</strong> Connect with your audience on a human level</li>
      <li><strong>Consistency:</strong> Maintain a coherent narrative across all channels</li>
      <li><strong>Impact:</strong> Show how your brand makes a difference</li>
    </ul>
    
    <h2>Making It Work</h2>
    <p>Successful brand storytelling requires careful planning, authentic voices, and a commitment to sharing stories that resonate with your target audience.</p>`,
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Branding', 'Storytelling', 'Marketing'],
    created_at: new Date('2024-03-10').toISOString(),
    isHardcoded: true
  }
];

const BlogManager: React.FC = () => {
  const [apiPosts, setApiPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<BlogForm>();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/admin/blog-posts');
      
      // Handle response format
      let data = response.data;
      if (data.success && data.data) {
        data = data.data;
      } else if (!Array.isArray(data)) {
        data = [];
      }
      
      setApiPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setApiPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Combine hardcoded and API posts
  const allPosts = [...HARDCODED_BLOGS, ...apiPosts].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const onSubmit = async (data: BlogForm) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', content);

      // Convert comma-separated tags to array
      const tagsArray = data.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      tagsArray.forEach((tag, index) => {
        formData.append(`tags[${index}]`, tag);
      });

      if (data.image && data.image[0]) {
        formData.append('image', data.image[0]);
      }

      if (editingPost && !editingPost.isHardcoded) {
        await api.post(`/admin/blog-posts/${editingPost.id}?_method=PUT`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Blog post updated successfully!');
      } else {
        await api.post('/admin/blog-posts', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Blog post created successfully!');
      }

      await fetchPosts();
      resetForm();
    } catch (error: any) {
      console.error('Failed to save post:', error);
      alert(
        error.response?.data?.message || 
        'Failed to save post. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const deletePost = async (post: BlogPost) => {
    // Prevent deletion of hardcoded posts
    if (post.isHardcoded) {
      alert('This is a default blog post and cannot be deleted.');
      return;
    }

    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`/admin/blog-posts/${post.id}`);
      alert('Blog post deleted successfully!');
      await fetchPosts();
    } catch (error: any) {
      console.error('Failed to delete post:', error);
      alert(
        error.response?.data?.message || 
        'Failed to delete post. Please try again.'
      );
    }
  };

  const editPost = (post: BlogPost) => {
    // Prevent editing of hardcoded posts
    if (post.isHardcoded) {
      alert('This is a default blog post and cannot be edited.');
      return;
    }

    setEditingPost(post);
    setValue('title', post.title);
    setValue('tags', post.tags.join(', '));
    setContent(post.content);
    setShowForm(true);
  };

  const resetForm = () => {
    reset();
    setContent('');
    setEditingPost(null);
    setShowForm(false);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Unknown date' : format(date, 'MMM dd, yyyy');
    } catch {
      return 'Unknown date';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <Link 
                to="/admin/dashboard"
                className="inline-flex items-center text-gray hover:text-primary mb-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-dark">Blog Management</h1>
              <p className="text-gray">Create and manage blog posts</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary inline-flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Post
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray">Total Posts</p>
                <p className="text-2xl font-bold text-dark">{allPosts.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray">Default Posts</p>
                <p className="text-2xl font-bold text-green-500">{HARDCODED_BLOGS.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray">Custom Posts</p>
                <p className="text-2xl font-bold text-primary">{apiPosts.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
          </div>
        </motion.div>

        {/* Form Modal */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-dark">
                    {editingPost ? 'Edit Post' : 'Create New Post'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray hover:text-dark"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Title *
                  </label>
                  <input
                    {...register('title', { required: 'Title is required' })}
                    className="input-field"
                    placeholder="Enter post title"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Content *
                  </label>
                  <ReactQuill
                    value={content}
                    onChange={setContent}
                    className="bg-white"
                    style={{ height: '300px', marginBottom: '50px' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Cover Image
                  </label>
                  <input
                    {...register('image')}
                    type="file"
                    accept="image/*"
                    className="input-field"
                  />
                  <p className="text-sm text-gray mt-1">
                    Recommended: 800x600px, JPG or PNG format
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Tags
                  </label>
                  <input
                    {...register('tags')}
                    className="input-field"
                    placeholder="Enter tags separated by commas"
                  />
                  <p className="text-sm text-gray mt-1">
                    Example: Strategy, Digital, Communications
                  </p>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        {editingPost ? 'Update' : 'Publish'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Posts List */}
        <div className="space-y-6">
          {allPosts.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark mb-2">No posts yet</h3>
              <p className="text-gray mb-6">Create your first blog post to get started</p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary"
              >
                Create First Post
              </button>
            </div>
          ) : (
            allPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-dark">{post.title}</h3>
                      {post.isHardcoded && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                          Default Post
                        </span>
                      )}
                    </div>
                    <p className="text-gray mb-3">
                      Slug: <code className="bg-gray-100 px-2 py-1 rounded">{post.slug}</code>
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map(tag => (
                        <span 
                          key={tag}
                          className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray">
                      Created: {formatDate(post.created_at)}
                    </p>
                  </div>
                  
                  {post.image && (
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-24 h-24 object-cover rounded-lg ml-4"
                    />
                  )}
                </div>

                <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-sm inline-flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </a>
                  {!post.isHardcoded && (
                    <>
                      <button
                        onClick={() => editPost(post)}
                        className="btn-secondary text-sm inline-flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => deletePost(post)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm inline-flex items-center transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default BlogManager;
