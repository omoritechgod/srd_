import api from './api';

export interface AboutContent {
  id?: string;
  content: string;
  image?: string;
}

// Public - Get about content
export const getAboutContent = async (): Promise<AboutContent | null> => {
  try {
    const response = await api.get('/about');
    
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    console.error('Failed to fetch about content:', error);
    return null;
  }
};

// Admin - Update about content
export const updateAboutContent = async (data: {
  content: string;
  image?: string;
}): Promise<boolean> => {
  try {
    const response = await api.post('/admin/about', data);
    return response.status === 200 || response.data.success;
  } catch (error) {
    console.error('Failed to update about content:', error);
    throw error;
  }
};