export interface User {
  id: number;
  email: string;
  name: string;
  preferences: {
    dietary_preference?: string;
    daily_calorie_goal?: number;
    allergies?: string[];
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

export interface FoodAnalysis {
  id: number;
  user_id: number;
  image_url?: string;
  food_name: string;
  category: string;
  confidence: number;
  serving_size: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium_mg: number;
  health_score: number;
  dietary_attributes: string[];
  micronutrients: Record<string, string>;
  notes?: string;
  is_estimated: number;
  created_at: string;
}

export interface FreshnessAnalysis {
  id: number;
  user_id: number;
  image_url?: string;
  food_item: string;
  freshness_score: number;
  status: 'Fresh' | 'Consume Soon' | 'Spoiled' | string;
  visual_indicators: string[];
  color_metrics: Record<string, string>;
  texture_observations?: string;
  shelf_life_days: number;
  storage_recommendation?: string;
  safety_disclaimer: string;
  created_at: string;
}

export interface HygieneAudit {
  id: number;
  user_id: number;
  media_url?: string;
  media_type: 'image' | 'video';
  frames_analyzed: number;
  overall_score: number;
  cleanliness_rating: string;
  contamination_risk: string;
  surface_cleanliness: Record<string, any>;
  cross_contamination_risks: string[];
  storage_compliance: Record<string, any>;
  detected_hazards: Array<{ timestamp?: string; hazard: string; severity?: string }>;
  corrective_actions: string[];
  disclaimer: string;
  created_at: string;
}

export interface Recipe {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  prep_time_minutes: number;
  cook_time_minutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  ingredients: Array<{ item: string; amount: string; notes?: string }>;
  instructions: Array<{ step: number; instruction: string; tip?: string }>;
  nutrition_estimate: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  };
  tags: string[];
  is_favorite: boolean;
  created_at: string;
}

export interface MealPlanDay {
  day_label: string;
  target_calories: number;
  breakfast: { name: string; calories: number; protein?: string; carbs?: string; fat?: string; ingredients: string[] };
  lunch: { name: string; calories: number; protein?: string; carbs?: string; fat?: string; ingredients: string[] };
  dinner: { name: string; calories: number; protein?: string; carbs?: string; fat?: string; ingredients: string[] };
  snack?: { name: string; calories: number; protein?: string; carbs?: string; fat?: string; ingredients: string[] };
}

export interface MealPlan {
  id: number;
  user_id: number;
  title: string;
  diet_type: string;
  target_calories: number;
  days_count: number;
  plan_data: Record<string, MealPlanDay>;
  preferences_used: Record<string, any>;
  summary_nutrition: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: number;
  conversation_id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  image_url?: string;
  metadata_info?: Record<string, any>;
  created_at: string;
}

export interface Conversation {
  id: number;
  user_id: number;
  title: string;
  created_at: string;
  updated_at: string;
  messages: ChatMessage[];
}

export interface HistorySummary {
  total_food_scans: number;
  total_freshness_checks: number;
  total_hygiene_audits: number;
  total_recipes: number;
  total_meal_plans: number;
  recent_food_analyses: FoodAnalysis[];
  recent_freshness_analyses: FreshnessAnalysis[];
  recent_hygiene_audits: HygieneAudit[];
  recent_recipes: Recipe[];
  recent_meal_plans: MealPlan[];
}

export interface SystemHealth {
  status: string;
  environment: string;
  database: string;
  ai_provider: {
    configured_provider: string;
    is_live_configured: boolean;
    offline_fallback_enabled: boolean;
    model: string;
  };
  version: string;
}
