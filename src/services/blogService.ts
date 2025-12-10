import api from './api';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  image?: string;
  tags: string[];
  created_at: string;
}

// Public - Get all blog posts
export const getPublicPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await api.get('/blog');
    
    if (response.data.data) {
      return response.data.data;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return [];
  }
};

// Public - Get single post by slug
export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const response = await api.get(`/blog/${slug}`);
    
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    console.error('Failed to fetch blog post:', error);
    return null;
  }
};

// Admin - Get all posts
export const getAdminPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await api.get('/admin/blog-posts');
    
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data.data) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch admin posts:', error);
    return [];
  }
};

// Admin - Create post
export const createPost = async (formData: FormData): Promise<boolean> => {
  try {
    await api.post('/admin/blog-posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return true;
  } catch (error) {
    console.error('Failed to create post:', error);
    throw error;
  }
};

// Admin - Update post
export const updatePost = async (id: string, formData: FormData): Promise<boolean> => {
  try {
    await api.post(`/admin/blog-posts/${id}?_method=PUT`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return true;
  } catch (error) {
    console.error('Failed to update post:', error);
    throw error;
  }
};

// Admin - Delete post
export const deletePost = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`/admin/blog-posts/${id}`);
    return true;
  } catch (error) {
    console.error('Failed to delete post:', error);
    throw error;
  }
};