import React, { useState, useEffect } from 'react';
import {
  History,
  Scan,
  ShieldCheck,
  UtensilsCrossed,
  ChefHat,
  CalendarDays,
  Trash2,
  Calendar,
  Eye,
  Filter
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { api } from '../services/api';
import { FoodAnalysis, FreshnessAnalysis, HygieneAudit, Recipe, MealPlan } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';

export const HistoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'food' | 'freshness' | 'hygiene' | 'recipes' | 'mealplans'>('all');
  const [foods, setFoods] = useState<FoodAnalysis[]>([]);
  const [freshness, setFreshness] = useState<FreshnessAnalysis[]>([]);
  const [hygiene, setHygiene] = useState<HygieneAudit[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllHistory();
  }, []);

  const loadAllHistory = async () => {
    setLoading(true);
    try {
      const [fData, frData, hData, rData, mData] = await Promise.all([
        api.getFoodHistory().catch(() => []),
        api.getFreshnessHistory().catch(() => []),
        api.getHygieneHistory().catch(() => []),
        api.getRecipes().catch(() => []),
        api.getMealPlans().catch(() => []),
      ]);
      setFoods(fData);
      setFreshness(frData);
      setHygiene(hData);
      setRecipes(rData);
      setMealPlans(mData);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFood = async (id: number) => {
    await api.deleteFood(id);
    setFoods((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDeleteFreshness = async (id: number) => {
    await api.deleteFreshness(id);
    setFreshness((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDeleteHygiene = async (id: number) => {
    await api.deleteHygiene(id);
    setHygiene((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDeleteRecipe = async (id: number) => {
    await api.deleteRecipe(id);
    setRecipes((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDeleteMealPlan = async (id: number) => {
    await api.deleteMealPlan(id);
    setMealPlans((prev) => prev.filter((item) => item.id !== id));
  };

  const tabs = [
    { key: 'all', label: 'All Records', count: foods.length + freshness.length + hygiene.length + recipes.length + mealPlans.length },
    { key: 'food', label: 'Food Scans', count: foods.length },
    { key: 'freshness', label: 'Freshness', count: freshness.length },
    { key: 'hygiene', label: 'Hygiene', count: hygiene.length },
    { key: 'recipes', label: 'Recipes', count: recipes.length },
    { key: 'mealplans', label: 'Meal Plans', count: mealPlans.length },
  ];

  return (
    <DashboardLayout
      title="User Records & History"
      description="Inspect your historical food analyses, optical freshness checks, saved recipes, and hygiene records."
    >
      <div className="space-y-6">
        {/* Tabs Filter */}
        <div className="flex gap-2 border-b border-border pb-3 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 flex-shrink-0 ${
                activeTab === tab.key
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface text-secondaryText hover:text-mainText border border-border'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-secondaryText'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content Streams */}
        <div className="space-y-6">
          {/* Food Scans Section */}
          {(activeTab === 'all' || activeTab === 'food') && foods.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-sm text-mainText flex items-center gap-2">
                <Scan className="w-4 h-4 text-primary" /> Food Scans & Nutritional Analyses ({foods.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {foods.map((item) => (
                  <Card key={item.id} className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-heading font-bold text-sm text-mainText">{item.food_name}</h4>
                        <p className="text-[11px] text-secondaryText">{item.category} • {item.serving_size}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteFood(item.id)}
                        className="text-secondaryText hover:text-coral p-1 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 text-center p-2 rounded-lg bg-background border border-border text-[11px]">
                      <div>
                        <span className="text-[9px] text-secondaryText uppercase block">Cal</span>
                        <strong className="text-primary">{Math.round(item.calories)}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-secondaryText uppercase block">Prot</span>
                        <strong className="text-secondary">{Math.round(item.protein)}g</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-secondaryText uppercase block">Carb</span>
                        <strong className="text-coral">{Math.round(item.carbs)}g</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-secondaryText uppercase block">Fat</span>
                        <strong className="text-success">{Math.round(item.fat)}g</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-secondaryText pt-1 border-t border-border">
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                      <Badge variant="primary" size="sm">{Math.round(item.confidence * 100)}% Match</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Freshness Analyses Section */}
          {(activeTab === 'all' || activeTab === 'freshness') && freshness.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-sm text-mainText flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-coral" /> Freshness Inspections ({freshness.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {freshness.map((item) => (
                  <Card key={item.id} className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-heading font-bold text-sm text-mainText">{item.food_item}</h4>
                        <p className="text-[11px] text-secondaryText">Freshness Score: {Math.round(item.freshness_score)}/100</p>
                      </div>
                      <button
                        onClick={() => handleDeleteFreshness(item.id)}
                        className="text-secondaryText hover:text-coral p-1 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-2.5 rounded-lg bg-background border border-border text-xs text-mainText space-y-1">
                      <p className="font-semibold text-[11px] text-secondaryText uppercase">Observed Status:</p>
                      <p>{item.status} (~{item.shelf_life_days} days shelf window)</p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-secondaryText pt-1 border-t border-border">
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                      <Badge variant={item.status.toLowerCase() === 'fresh' ? 'success' : 'warning'} size="sm">
                        {item.status}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Saved Recipes Section */}
          {(activeTab === 'all' || activeTab === 'recipes') && recipes.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-sm text-mainText flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-secondary" /> Saved Recipes ({recipes.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recipes.map((item) => (
                  <Card key={item.id} className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-heading font-bold text-sm text-mainText">{item.title}</h4>
                        <p className="text-[11px] text-secondaryText">{item.cuisine} • {item.cook_time_minutes} mins cook time</p>
                      </div>
                      <button
                        onClick={() => handleDeleteRecipe(item.id)}
                        className="text-secondaryText hover:text-coral p-1 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-secondaryText line-clamp-2">
                      {item.description || 'Nutritious customized recipe creation.'}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-secondaryText pt-1 border-t border-border">
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                      <Badge variant="secondary" size="sm">{item.difficulty}</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Meal Plans Section */}
          {(activeTab === 'all' || activeTab === 'mealplans') && mealPlans.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-sm text-mainText flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-success" /> Generated Meal Plans ({mealPlans.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mealPlans.map((item) => (
                  <Card key={item.id} className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-heading font-bold text-sm text-mainText">{item.title}</h4>
                        <p className="text-[11px] text-secondaryText">{item.diet_type} • {item.target_calories} kcal/day</p>
                      </div>
                      <button
                        onClick={() => handleDeleteMealPlan(item.id)}
                        className="text-secondaryText hover:text-coral p-1 transition-colors"
                        title="Delete plan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-secondaryText pt-1 border-t border-border">
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                      <Badge variant="success" size="sm">{item.days_count} Days</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Empty state if nothing matches */}
          {foods.length === 0 && freshness.length === 0 && recipes.length === 0 && mealPlans.length === 0 && (
            <EmptyState
              icon={<History className="w-7 h-7" />}
              title="No Saved Records"
              description="Your saved food scans, freshness audits, recipes, and meal plans will be securely persisted here."
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
