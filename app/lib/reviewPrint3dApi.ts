import axios from 'axios';

const host = process.env.NEXT_PUBLIC_SERVER;
const api = axios.create({
  baseURL: host, // замените на ваш URL сервера
});

export interface ReviewPrint3d {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  createdAt: Date;
  images?: Image[];
  isPinned?: boolean;
  date?: Date;
}

interface Image {
  id: number;
  url: string;
  reviewId?: number;
}

export const getReviews = async (): Promise<ReviewPrint3d[]> => {
  try {
    const response = await api.get('/review-print3d');
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const createReview = async (data: ReviewPrint3d): Promise<ReviewPrint3d> => {
  const response = await api.post('/review-print3d', { data });
  return response.data;
};

export const updateReview = async (id: number, data: ReviewPrint3d): Promise<ReviewPrint3d> => {
  const response = await api.patch(`/review-print3d/${id}`, data);
  return response.data;
};

export const deleteReview = async (id: number): Promise<void> => {
  await api.delete(`/review-print3d/${id}`);
};