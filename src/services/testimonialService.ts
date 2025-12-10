import api from './api';

export interface Testimonial {
  id: string;
  name: string;
  org?: string;
  rating?: number;
  text: string;
  photo?: string;
  approved: boolean;
  created_at: string;
}

export interface TestimonialSubmission {
  name: string;
  org?: string;
  rating: number;
  text: string;
  photo?: string;
}

// Public - Get approved testimonials
export const getApprovedTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const response = await api.get('/testimonials');
    
    if (response.data.data) {
      return response.data.data;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch testimonials:', error);
    return [];
  }
};

// Public - Submit testimonial
export const submitTestimonial = async (data: TestimonialSubmission): Promise<boolean> => {
  try {
    const response = await api.post('/testimonials', data);
    return response.status === 201 || response.data.success;
  } catch (error) {
    console.error('Failed to submit testimonial:', error);
    throw error;
  }
};

// Admin - Get all testimonials
export const getAllTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const response = await api.get('/admin/testimonials');
    
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data.data) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch testimonials:', error);
    return [];
  }
};

// Admin - Approve testimonial
export const approveTestimonial = async (id: string): Promise<boolean> => {
  try {
    await api.post(`/admin/testimonials/${id}/approve`);
    return true;
  } catch (error) {
    console.error('Failed to approve testimonial:', error);
    throw error;
  }
};

// Admin - Delete testimonial
export const deleteTestimonial = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`/admin/testimonials/${id}`);
    return true;
  } catch (error) {
    console.error('Failed to delete testimonial:', error);
    throw error;
  }
};