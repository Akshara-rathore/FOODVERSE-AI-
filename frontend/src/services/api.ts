import axios from 'axios';
import {
  User,
  FoodAnalysis,
  FreshnessAnalysis,
  HygieneAudit,
  Recipe,
  MealPlan,
  Conversation,
  ChatMessage,
  HistorySummary,
  SystemHealth
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('foodverse_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-clear or redirect if already on login/register
      const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';
      if (!isAuthPage) {
        localStorage.removeItem('foodverse_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Auth
  register: async (name: string, email: string, password: string) => {
    const res = await apiClient.post<{ access_token: string; token_type: string }>('/auth/register', { name, email, password });
    return res.data;
  },
  login: async (email: string, password: string) => {
    const res = await apiClient.post<{ access_token: string; token_type: string }>('/auth/login', { email, password });
    return res.data;
  },
  getMe: async () => {
    const res = await apiClient.get<User>('/auth/me');
    return res.data;
  },
  updateProfile: async (data: { name?: string; preferences?: Record<string, any> }) => {
    const res = await apiClient.patch<User>('/users/me', data);
    return res.data;
  },

  // Food Scanner & Nutrition
  analyzeFood: async (formData: FormData) => {
    const res = await apiClient.post<FoodAnalysis>('/food/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  getFoodHistory: async (limit = 50) => {
    const res = await apiClient.get<FoodAnalysis[]>(`/food/history?limit=${limit}`);
    return res.data;
  },
  getFoodById: async (id: number) => {
    const res = await apiClient.get<FoodAnalysis>(`/food/${id}`);
    return res.data;
  },
  deleteFood: async (id: number) => {
    await apiClient.delete(`/food/${id}`);
  },

  // Freshness Assessment
  analyzeFreshness: async (formData: FormData) => {
    const res = await apiClient.post<FreshnessAnalysis>('/freshness/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  getFreshnessHistory: async (limit = 50) => {
    const res = await apiClient.get<FreshnessAnalysis[]>(`/freshness/history?limit=${limit}`);
    return res.data;
  },
  deleteFreshness: async (id: number) => {
    await apiClient.delete(`/freshness/${id}`);
  },

  // Kitchen Hygiene Audit
  analyzeHygiene: async (formData: FormData) => {
    const res = await apiClient.post<HygieneAudit>('/hygiene/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  getHygieneHistory: async (limit = 50) => {
    const res = await apiClient.get<HygieneAudit[]>(`/hygiene/history?limit=${limit}`);
    return res.data;
  },
  deleteHygiene: async (id: number) => {
    await apiClient.delete(`/hygiene/${id}`);
  },

  // Recipes & Cooking
  generateRecipe: async (payload: {
    ingredients: string[];
    dietary_preferences?: string[];
    max_cook_time_minutes?: number;
    difficulty?: string;
    servings?: number;
    cuisine?: string;
  }) => {
    const res = await apiClient.post<Recipe>('/recipes/generate', payload);
    return res.data;
  },
  getRecipes: async (limit = 50) => {
    const res = await apiClient.get<Recipe[]>(`/recipes?limit=${limit}`);
    return res.data;
  },
  getRecipeById: async (id: number) => {
    const res = await apiClient.get<Recipe>(`/recipes/${id}`);
    return res.data;
  },
  toggleFavoriteRecipe: async (id: number) => {
    const res = await apiClient.patch<Recipe>(`/recipes/${id}/favorite`);
    return res.data;
  },
  deleteRecipe: async (id: number) => {
    await apiClient.delete(`/recipes/${id}`);
  },

  // Meal Plans
  generateMealPlan: async (payload: {
    diet_type: string;
    target_calories: number;
    days_count: number;
    allergies?: string[];
    preferred_cuisines?: string[];
    available_ingredients?: string[];
  }) => {
    const res = await apiClient.post<MealPlan>('/meal-plans/generate', payload);
    return res.data;
  },
  getMealPlans: async (limit = 50) => {
    const res = await apiClient.get<MealPlan[]>(`/meal-plans?limit=${limit}`);
    return res.data;
  },
  getMealPlanById: async (id: number) => {
    const res = await apiClient.get<MealPlan>(`/meal-plans/${id}`);
    return res.data;
  },
  deleteMealPlan: async (id: number) => {
    await apiClient.delete(`/meal-plans/${id}`);
  },

  // Assistant & Chat
  sendChatMessage: async (message: string, conversationId?: number, imageUrl?: string) => {
    const res = await apiClient.post<ChatMessage>('/assistant/chat', {
      message,
      conversation_id: conversationId,
      image_url: imageUrl,
    });
    return res.data;
  },
  getConversations: async (limit = 20) => {
    const res = await apiClient.get<Conversation[]>(`/assistant/conversations?limit=${limit}`);
    return res.data;
  },
  getConversationById: async (id: number) => {
    const res = await apiClient.get<Conversation>(`/assistant/conversations/${id}`);
    return res.data;
  },
  deleteConversation: async (id: number) => {
    await apiClient.delete(`/assistant/conversations/${id}`);
  },

  // Overview History
  getHistorySummary: async () => {
    const res = await apiClient.get<HistorySummary>('/history');
    return res.data;
  },

  // System Health
  getHealth: async () => {
    const res = await apiClient.get<SystemHealth>('/health');
    return res.data;
  },
};
