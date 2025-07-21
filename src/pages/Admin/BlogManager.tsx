import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Plus, Edit, Trash2, Save, X, Eye } from 'lucide-react';
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
  createdAt: string;
}

interface BlogForm {
  title: string;
  content: string;
  image?: FileList;
  tags: string;
}

const BlogManager: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
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
      const response = await api.get('/blog');
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: BlogForm) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', content);
      formData.append('tags', data.tags);
      
      if (data.image && data.image[0]) {
        formData.append('image', data.image[0]);
      }

      if (editingPost) {
        await api.put(`/blog/${editingPost.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/blog', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      await fetchPosts();
      resetForm();
    } catch (error) {
      console.error('Failed to save post:', error);
      alert('Failed to save post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`/blog/${id}`);
      await fetchPosts();
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  const editPost = (post: BlogPost) => {
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

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
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
          {posts.length === 0 ? (
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
            posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-dark mb-2">{post.title}</h3>
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
                      Created: {format(new Date(post.createdAt), 'MMM dd, yyyy')}
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
                  <button
                    onClick={() => editPost(post)}
                    className="btn-secondary text-sm inline-flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm inline-flex items-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
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