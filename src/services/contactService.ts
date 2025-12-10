import api from './api';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// Public - Submit contact form
export const submitContactForm = async (data: ContactSubmission): Promise<boolean> => {
  try {
    const response = await api.post('/contact', data);
    return response.status === 201 || response.data.success;
  } catch (error) {
    console.error('Failed to submit contact form:', error);
    throw error;
  }
};

// Admin - Get all contact messages
export const getContactMessages = async (): Promise<ContactMessage[]> => {
  try {
    const response = await api.get('/admin/contact-messages');
    
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data.data) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch contact messages:', error);
    return [];
  }
};

// Admin - Get single message
export const getContactMessage = async (id: string): Promise<ContactMessage | null> => {
  try {
    const response = await api.get(`/admin/contact-messages/${id}`);
    
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    console.error('Failed to fetch contact message:', error);
    return null;
  }
};

// Admin - Delete message
export const deleteContactMessage = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`/admin/contact-messages/${id}`);
    return true;
  } catch (error) {
    console.error('Failed to delete message:', error);
    throw error;
  }
};