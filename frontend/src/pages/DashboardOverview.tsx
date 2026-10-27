import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scan,
  ShieldCheck,
  UtensilsCrossed,
  ChefHat,
  CalendarDays,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Apple,
  Clock,
  ChevronRight
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { HistorySummary, SystemHealth } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Alert } from '../components/ui/Alert';

export const DashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState<HistorySummary | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getHistorySummary().catch(() => null),
      api.getHealth().catch(() => null),
    ]).then(([historyData, healthData]) => {
      setHistory(historyData);
      setHealth(healthData);
      setLoading(false);
    });
  }, []);

  // Format real chart data from user's persisted food analyses
  const chartData = (history?.recent_food_analyses || [])
    .slice(0, 7)
    .reverse()
    .map((item) => ({
      name: item.food_name.length > 12 ? item.food_name.slice(0, 10) + '...' : item.food_name,
      calories: Math.round(item.calories),
      protein: Math.round(item.protein),
      carbs: Math.round(item.carbs),
      fat: Math.round(item.fat),
    }));

  return (
    <DashboardLayout
      title="Overview"
      description="Holistic food intelligence, recent scans, and dietary analytics."
    >
      <div className="space-y-6">
        {/* Unconfigured Provider Notice Banner if live AI is unconfigured */}
        {health && !health.ai_provider.is_live_configured && (
          <Alert
            variant="warning"
            title="AI Provider in Local Reference Mode"
            className="shadow-sm"
          >
            The backend is running using USDA baseline references and offline models because <code>GEMINI_API_KEY</code> is not yet configured in <code>backend/.env</code>. To enable live multimodal Gemini vision and generative chef models, add your key to <code>.env</code>.
          </Alert>
        )}

        {/* Welcome & Quick Action Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white relative overflow-hidden shadow-card">
            <div className="relative z-10 space-y-4 max-w-xl">
              <span className="inline-block text-[11px] uppercase tracking-wider font-bold bg-white/20 px-3 py-1 rounded-full text-white">
                FoodVerse AI Workspace
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
                Welcome back, {user?.name || 'Chef'}!
              </h2>
              <p className="text-white/85 text-xs sm:text-sm leading-relaxed">
                Scan your meal to instantly identify ingredients, verify nutritional breakdown, assess kitchen safety, or ask the AI culinary assistant for advice.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Button
                  variant="coral"
                  size="md"
                  icon={<Scan className="w-4 h-4" />}
                  onClick={() => navigate('/food-scanner')}
                >
                  Scan New Meal
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => navigate('/cooking')}
                  className="bg-white/15 text-white hover:bg-white/25 border border-white/20"
                >
                  Generate Recipe
                </Button>
              </div>
            </div>

            {/* Decorative subtle circles */}
            <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
          </div>

          {/* Activity Metrics Counter */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            <Card className="flex flex-col justify-between">
              <div className="flex items-center justify-between text-secondaryText">
                <span className="text-xs font-semibold uppercase">Food Scans</span>
                <Scan className="w-4 h-4 text-primary" />
              </div>
              <div className="mt-4">
                <p className="font-heading font-bold text-3xl text-mainText">{history?.total_food_scans || 0}</p>
                <p className="text-[11px] text-secondaryText mt-1">Recorded dishes</p>
              </div>
            </Card>

            <Card className="flex flex-col justify-between">
              <div className="flex items-center justify-between text-secondaryText">
                <span className="text-xs font-semibold uppercase">Freshness</span>
                <ShieldCheck className="w-4 h-4 text-coral" />
              </div>
              <div className="mt-4">
                <p className="font-heading font-bold text-3xl text-mainText">{history?.total_freshness_checks || 0}</p>
                <p className="text-[11px] text-secondaryText mt-1">Items inspected</p>
              </div>
            </Card>

            <Card className="flex flex-col justify-between">
              <div className="flex items-center justify-between text-secondaryText">
                <span className="text-xs font-semibold uppercase">Recipes</span>
                <ChefHat className="w-4 h-4 text-secondary" />
              </div>
              <div className="mt-4">
                <p className="font-heading font-bold text-3xl text-mainText">{history?.total_recipes || 0}</p>
                <p className="text-[11px] text-secondaryText mt-1">Saved creations</p>
              </div>
            </Card>

            <Card className="flex flex-col justify-between">
              <div className="flex items-center justify-between text-secondaryText">
                <span className="text-xs font-semibold uppercase">Meal Plans</span>
                <CalendarDays className="w-4 h-4 text-success" />
              </div>
              <div className="mt-4">
                <p className="font-heading font-bold text-3xl text-mainText">{history?.total_meal_plans || 0}</p>
                <p className="text-[11px] text-secondaryText mt-1">Active schedules</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Nutritional Breakdown Chart & Recent Food Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card
            className="lg:col-span-7"
            title="Nutritional Activity Breakdown"
            subtitle="Derived from your saved food recognition scans"
          >
            {chartData.length > 0 ? (
              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E7E5F0" vertical={false} />
                    <XAxis dataKey="name" stroke="#77778F" fontSize={11} tickLine={false} />
                    <YAxis stroke="#77778F" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E7E5F0',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="calories" fill="#5546A6" radius={[4, 4, 0, 0]} name="Calories (kcal)" />
                    <Bar dataKey="protein" fill="#8375D1" radius={[4, 4, 0, 0]} name="Protein (g)" />
                    <Bar dataKey="carbs" fill="#F07868" radius={[4, 4, 0, 0]} name="Carbs (g)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState
                icon={<TrendingUp className="w-6 h-6" />}
                title="No Nutrition Records Yet"
                description="Upload meal images in Food Scanner to visualize your calorie and macronutrient breakdown trends."
                actionLabel="Scan First Meal"
                onAction={() => navigate('/food-scanner')}
              />
            )}
          </Card>

          {/* Quick Recent Activity Stream */}
          <Card
            className="lg:col-span-5"
            title="Recent Food Analyses"
            subtitle="Your latest inspected dishes"
            action={
              (history?.recent_food_analyses || []).length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => navigate('/history')} className="text-xs">
                  View All <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </Button>
              )
            }
          >
            {(history?.recent_food_analyses || []).length > 0 ? (
              <div className="space-y-3">
                {history?.recent_food_analyses.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate('/history')}
                    className="flex items-center justify-between p-3 rounded-lg bg-background hover:bg-primary-light/40 border border-border cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center text-primary flex-shrink-0">
                        <Apple className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-heading font-semibold text-xs sm:text-sm text-mainText truncate">
                          {item.food_name}
                        </p>
                        <p className="text-[11px] text-secondaryText flex items-center gap-2">
                          <span>{item.serving_size}</span>
                          <span>•</span>
                          <span className="font-medium text-primary">{Math.round(item.calories)} kcal</span>
                        </p>
                      </div>
                    </div>
                    <Badge variant="primary" size="sm">
                      {Math.round(item.confidence * 100)}% Match
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Clock className="w-6 h-6" />}
                title="No Recent Scans"
                description="Your analyzed dishes will appear here with instant nutritional breakdowns."
              />
            )}
          </Card>
        </div>

        {/* Feature Fast-Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <Card
            className="hover:border-primary/40 cursor-pointer transition-all"
            onClick={() => navigate('/freshness')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-coral-light flex items-center justify-center text-coral">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-semibold text-sm text-mainText">Freshness Checker</h4>
                <p className="text-xs text-secondaryText">Optical shelf-life & oxidation risk</p>
              </div>
            </div>
          </Card>

          <Card
            className="hover:border-primary/40 cursor-pointer transition-all"
            onClick={() => navigate('/hygiene')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-semibold text-sm text-mainText">Kitchen Hygiene Audit</h4>
                <p className="text-xs text-secondaryText">Sanitation & hazard detection</p>
              </div>
            </div>
          </Card>

          <Card
            className="hover:border-primary/40 cursor-pointer transition-all"
            onClick={() => navigate('/assistant')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center text-primary">
                <Sparkles className="w-5 h-5 text-coral" />
              </div>
              <div>
                <h4 className="font-heading font-semibold text-sm text-mainText">AI Assistant</h4>
                <p className="text-xs text-secondaryText">Multimodal culinary dialogue</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
