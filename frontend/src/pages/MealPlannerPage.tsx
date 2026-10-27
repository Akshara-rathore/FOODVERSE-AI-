import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Sparkles,
  Flame,
  Apple,
  Trash2,
  ChevronRight,
  Plus,
  RefreshCw,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { api } from '../services/api';
import { MealPlan } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';

export const MealPlannerPage: React.FC = () => {
  const [dietType, setDietType] = useState<string>('Mediterranean');
  const [calories, setCalories] = useState<number>(2000);
  const [daysCount, setDaysCount] = useState<number>(3);
  const [allergies, setAllergies] = useState<string>('Peanuts, Shellfish');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<MealPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<MealPlan[]>([]);
  const [activeDayKey, setActiveDayKey] = useState<string>('day_1');

  useEffect(() => {
    loadSavedPlans();
  }, []);

  const loadSavedPlans = async () => {
    try {
      const data = await api.getMealPlans();
      setSavedPlans(data);
      if (data.length > 0 && !currentPlan) {
        setCurrentPlan(data[0]);
      }
    } catch {
      // ignore
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    const allergyList = allergies
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

    try {
      const data = await api.generateMealPlan({
        diet_type: dietType,
        target_calories: calories,
        days_count: daysCount,
        allergies: allergyList,
      });
      setCurrentPlan(data);
      setActiveDayKey('day_1');
      loadSavedPlans();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate meal plan. Please check provider settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteMealPlan(id);
      if (currentPlan?.id === id) {
        setCurrentPlan(null);
      }
      loadSavedPlans();
    } catch {
      // ignore
    }
  };

  const dietOptions = ['Balanced', 'Mediterranean', 'High-Protein', 'Keto', 'Vegetarian', 'Vegan', 'Low-Carb'];

  const dayKeys = currentPlan?.plan_data ? Object.keys(currentPlan.plan_data) : [];
  const currentDayData = currentPlan?.plan_data ? currentPlan.plan_data[activeDayKey] : null;

  return (
    <DashboardLayout
      title="Personalized Meal Planner"
      description="Design customized nutrition programs matching caloric targets and dietary restrictions."
    >
      <div className="space-y-6">
        <Alert variant="info" title="Dietary Planning Guidelines">
          Meal plans are calculated nutritional estimations tailored to personal wellness goals. They should not substitute for medical nutritional therapy, diabetic insulin regimens, or clinical dietitian consultations.
        </Alert>

        {error && (
          <Alert variant="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Preferences & Form */}
          <div className="lg:col-span-5 space-y-4">
            <Card title="Plan Parameters">
              <div className="space-y-4">
                {/* Diet Type */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondaryText mb-1.5">
                    Dietary Focus
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {dietOptions.map((diet) => (
                      <button
                        key={diet}
                        type="button"
                        onClick={() => setDietType(diet)}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                          dietType === diet
                            ? 'bg-primary text-white'
                            : 'bg-background text-secondaryText hover:bg-gray-200 border border-border'
                        }`}
                      >
                        {diet}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calorie Target */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-secondaryText">
                      Daily Calorie Target
                    </label>
                    <span className="font-heading font-bold text-sm text-primary">{calories} kcal</span>
                  </div>
                  <input
                    type="range"
                    min={1200}
                    max={4000}
                    step={50}
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-secondaryText mt-1">
                    <span>1200 kcal</span>
                    <span>2500 kcal</span>
                    <span>4000 kcal</span>
                  </div>
                </div>

                {/* Days Count */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondaryText mb-1.5">
                    Program Duration
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 3, 7].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDaysCount(d)}
                        className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                          daysCount === d
                            ? 'bg-primary-light border-primary text-primary'
                            : 'bg-white border-border text-secondaryText hover:bg-gray-50'
                        }`}
                      >
                        {d} {d === 1 ? 'Day' : 'Days'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Allergies / Dislikes */}
                <div>
                  <Input
                    label="Allergies / Avoid Items"
                    placeholder="e.g. Peanuts, Shellfish, Dairy"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    helperText="Comma separated ingredients you do not consume."
                  />
                </div>

                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    loading={loading}
                    icon={<Sparkles className="w-4 h-4 text-coral" />}
                    onClick={handleGenerate}
                  >
                    Generate Meal Plan
                  </Button>
                </div>
              </div>
            </Card>

            {/* Saved Plans */}
            {savedPlans.length > 0 && (
              <Card title="Saved Meal Plans" subtitle="Select a plan to inspect meals">
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {savedPlans.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setCurrentPlan(p);
                        setActiveDayKey('day_1');
                      }}
                      className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                        currentPlan?.id === p.id
                          ? 'bg-primary-light/40 border-primary'
                          : 'bg-background hover:bg-white border-border'
                      }`}
                    >
                      <div className="truncate">
                        <p className="font-semibold text-mainText truncate">{p.title}</p>
                        <p className="text-[11px] text-secondaryText">{p.target_calories} kcal/day • {p.days_count} Days</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(p.id);
                        }}
                        className="text-secondaryText hover:text-coral p-1"
                        title="Delete Plan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column: Meal Plan Viewer */}
          <div className="lg:col-span-7">
            {currentPlan ? (
              <Card
                title={currentPlan.title}
                subtitle={`${currentPlan.diet_type} • Daily Target: ${currentPlan.target_calories} kcal`}
                action={
                  <Button variant="outline" size="sm" onClick={handleGenerate} icon={<RefreshCw className="w-3.5 h-3.5" />}>
                    Regenerate
                  </Button>
                }
              >
                {/* Day selector tabs */}
                <div className="flex gap-2 border-b border-border pb-3 my-3 overflow-x-auto">
                  {dayKeys.map((dayKey) => (
                    <button
                      key={dayKey}
                      onClick={() => setActiveDayKey(dayKey)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex-shrink-0 ${
                        activeDayKey === dayKey
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-background text-secondaryText hover:text-mainText'
                      }`}
                    >
                      {currentPlan.plan_data[dayKey]?.day_label || dayKey.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                {/* Day Meals View */}
                {currentDayData ? (
                  <div className="space-y-4 pt-1">
                    {/* Breakfast */}
                    <div className="p-4 rounded-xl bg-background border border-border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-secondaryText flex items-center gap-1.5">
                          <Apple className="w-3.5 h-3.5 text-primary" /> Breakfast
                        </span>
                        <span className="text-xs font-bold text-primary">{currentDayData.breakfast.calories} kcal</span>
                      </div>
                      <h4 className="font-heading font-semibold text-sm text-mainText">{currentDayData.breakfast.name}</h4>
                      {currentDayData.breakfast.ingredients && (
                        <p className="text-xs text-secondaryText">
                          <strong>Includes: </strong> {currentDayData.breakfast.ingredients.join(', ')}
                        </p>
                      )}
                    </div>

                    {/* Lunch */}
                    <div className="p-4 rounded-xl bg-background border border-border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-secondaryText flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-coral" /> Lunch
                        </span>
                        <span className="text-xs font-bold text-coral">{currentDayData.lunch.calories} kcal</span>
                      </div>
                      <h4 className="font-heading font-semibold text-sm text-mainText">{currentDayData.lunch.name}</h4>
                      {currentDayData.lunch.ingredients && (
                        <p className="text-xs text-secondaryText">
                          <strong>Includes: </strong> {currentDayData.lunch.ingredients.join(', ')}
                        </p>
                      )}
                    </div>

                    {/* Dinner */}
                    <div className="p-4 rounded-xl bg-background border border-border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-secondaryText flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-secondary" /> Dinner
                        </span>
                        <span className="text-xs font-bold text-secondary">{currentDayData.dinner.calories} kcal</span>
                      </div>
                      <h4 className="font-heading font-semibold text-sm text-mainText">{currentDayData.dinner.name}</h4>
                      {currentDayData.dinner.ingredients && (
                        <p className="text-xs text-secondaryText">
                          <strong>Includes: </strong> {currentDayData.dinner.ingredients.join(', ')}
                        </p>
                      )}
                    </div>

                    {/* Snack if present */}
                    {currentDayData.snack && (
                      <div className="p-4 rounded-xl bg-background border border-border space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-secondaryText flex items-center gap-1.5">
                            <Apple className="w-3.5 h-3.5 text-success" /> Afternoon Snack
                          </span>
                          <span className="text-xs font-bold text-success">{currentDayData.snack.calories} kcal</span>
                        </div>
                        <h4 className="font-heading font-semibold text-sm text-mainText">{currentDayData.snack.name}</h4>
                        {currentDayData.snack.ingredients && (
                          <p className="text-xs text-secondaryText">
                            <strong>Includes: </strong> {currentDayData.snack.ingredients.join(', ')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-secondaryText text-center py-8">Select a day tab above to view scheduled meals.</p>
                )}
              </Card>
            ) : (
              <Card className="min-h-[380px] flex flex-col items-center justify-center text-center p-8">
                <div className="w-14 h-14 rounded-2xl bg-success-light text-success flex items-center justify-center mb-4">
                  <CalendarDays className="w-7 h-7 text-success" />
                </div>
                <h3 className="font-heading font-semibold text-base text-mainText mb-1">
                  Ready to Plan Your Nutrition
                </h3>
                <p className="text-xs sm:text-sm text-secondaryText max-w-sm">
                  Configure your diet style, daily calorie budget, and duration on the left to generate structured day-by-day recipes.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
