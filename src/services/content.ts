import { contentApi, unwrap } from '@/lib/api';

export interface Category {
  id: number;
  code: string;
  name: string;
}

export interface Article {
  id: number;
  title: string;
  cover_url: string;
  body: string;
  visibility: 'public' | 'member';
  pinned: boolean;
  published_at?: string;
  category?: Category | null;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  location_type: string;
  location_text: string;
  online_url: string;
  status: string;
  sessions?: CourseSession[];
}

export interface CourseSession {
  id: number;
  course_id: number;
  starts_at: string;
  ends_at: string;
  status: string;
  course?: Course | null;
}

export interface CourseRegistration {
  id: number;
  course_id: number;
  user_id: number;
  status: string;
  course?: Course | null;
}

export const contentService = {
  listCategories: () => unwrap<Category[]>(contentApi.get('/api/v1/categories')),
  listArticles: (params?: { pinned?: boolean; category_id?: number }) =>
    unwrap<Article[]>(contentApi.get('/api/v1/articles', { params })),
  getArticle: (id: number) => unwrap<Article>(contentApi.get(`/api/v1/articles/${id}`)),
  listCourses: () => unwrap<Course[]>(contentApi.get('/api/v1/courses')),
  getCourse: (id: number) => unwrap<Course>(contentApi.get(`/api/v1/courses/${id}`)),
  listSessions: (params?: { date?: string }) =>
    unwrap<CourseSession[]>(contentApi.get('/api/v1/sessions', { params })),
  registerCourse: (courseId: number) =>
    unwrap<CourseRegistration>(contentApi.post(`/api/v1/courses/${courseId}/registrations`)),
  myRegistrations: () =>
    unwrap<CourseRegistration[]>(contentApi.get('/api/v1/me/registrations')),
};
