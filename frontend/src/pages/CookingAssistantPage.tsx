import React, { useState, useEffect } from 'react';
import {
  ChefHat,
  Sparkles,
  Clock,
  Users,
  Flame,
  Heart,
  Plus,
  X,
  BookmarkCheck,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { api } from '../services/api';
import { Recipe } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';

export const CookingAssistantPage: React.FC = () => {
  const [ingredients, setIngredients] = useState<string[]>(['Salmon fillet', 'Asparagus', 'Garlic', 'Olive oil']);
  const [currentIng, setCurrentIng] = useState<string>('');
  const [dietary, setDietary] = useState<string[]>(['Gluten-Free']);
  const [cookTime, setCookTime] = useState<number>(30);
  const [difficulty, setDifficulty] = useState<string>('Medium');
  const [servings, setServings] = useState<number>(2);
  const [cuisine, setCuisine] = useState<string>('Mediterranean');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    loadSavedRecipes();
  }, []);

  const loadSavedRecipes = async () => {
    try {
      const data = await api.getRecipes();
      setSavedRecipes(data);
    } catch {
      // ignore
    }
  };

  const handleAddIngredient = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    if (currentIng.trim() && !ingredients.includes(currentIng.trim())) {
      setIngredients([...ingredients, currentIng.trim()]);
      setCurrentIng('');
    }
  };

  const handleRemoveIngredient = (ing: string) => {
    setIngredients(ingredients.filter((i) => i !== ing));
  };

  const handleToggleDietary = (item: string) => {
    if (dietary.includes(item)) {
      setDietary(dietary.filter((d) => d !== item));
    } else {
      setDietary([...dietary, item]);
    }
  };

  const handleGenerate = async () => {
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient to build a recipe around.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await api.generateRecipe({
        ingredients,
        dietary_preferences: dietary,
        max_cook_time_minutes: cookTime,
        difficulty,
        servings,
        cuisine,
      });
      setRecipe(data);
      loadSavedRecipes();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate recipe. Please verify AI provider configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (id: number) => {
    try {
      const updated = await api.toggleFavoriteRecipe(id);
      if (recipe && recipe.id === id) {
        setRecipe(updated);
      }
      loadSavedRecipes();
    } catch {
      // ignore
    }
  };

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Keto', 'Gluten-Free', 'High-Protein', 'Dairy-Free', 'Low-Carb'];

  return (
    <DashboardLayout
      title="Smart Cooking Assistant"
      description="Tell the AI what ingredients you have in your kitchen to generate delicious, healthy recipes matching your dietary goals."
    >
      <div className="space-y-6">
        {error && (
          <Alert variant="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Recipe Configuration Parameters */}
          <div className="lg:col-span-5 space-y-4">
            <Card title="Kitchen Pantry & Constraints">
              {/* Ingredients Input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondaryText">
                  Available Ingredients
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type an ingredient & press enter..."
                    value={currentIng}
                    onChange={(e) => setCurrentIng(e.target.value)}
                    onKeyDown={handleAddIngredient}
                  />
                  <Button variant="secondary" size="md" onClick={handleAddIngredient} icon={<Plus className="w-4 h-4" />}>
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="inline-flex items-center gap-1.5 text-xs bg-primary-light text-primary px-2.5 py-1 rounded-full font-medium"
                    >
                      {ing}
                      <button
                        onClick={() => handleRemoveIngredient(ing)}
                        className="hover:text-coral transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Dietary Restrictions */}
              <div className="space-y-2 pt-3 border-t border-border">
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondaryText">
                  Dietary Preferences
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {dietaryOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleToggleDietary(opt)}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                        dietary.includes(opt)
                          ? 'bg-secondary text-white'
                          : 'bg-background text-secondaryText hover:bg-gray-200/80 border border-border'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cook Time, Servings, Difficulty */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-secondaryText mb-1">
                    Max Time
                  </label>
                  <select
                    value={cookTime}
                    onChange={(e) => setCookTime(Number(e.target.value))}
                    className="w-full h-9 bg-white border border-border rounded-lg text-xs text-mainText px-2 focus:ring-1 focus:ring-primary"
                  >
                    <option value={15}>15 mins</option>
                    <option value={30}>30 mins</option>
                    <option value={45}>45 mins</option>
                    <option value={60}>60 mins</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-secondaryText mb-1">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full h-9 bg-white border border-border rounded-lg text-xs text-mainText px-2 focus:ring-1 focus:ring-primary"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Gourmet">Gourmet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-secondaryText mb-1">
                    Servings
                  </label>
                  <select
                    value={servings}
                    onChange={(e) => setServings(Number(e.target.value))}
                    className="w-full h-9 bg-white border border-border rounded-lg text-xs text-mainText px-2 focus:ring-1 focus:ring-primary"
                  >
                    <option value={1}>1 person</option>
                    <option value={2}>2 persons</option>
                    <option value={4}>4 persons</option>
                    <option value={6}>6 persons</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  loading={loading}
                  icon={<Sparkles className="w-4 h-4 text-coral" />}
                  onClick={handleGenerate}
                >
                  Generate Chef Recipe
                </Button>
              </div>
            </Card>

            {/* Saved Recipes Quick List */}
            {savedRecipes.length > 0 && (
              <Card title="Saved Recipes" subtitle="Previously generated dishes in your cookbook">
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {savedRecipes.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => setRecipe(r)}
                      className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                        recipe?.id === r.id
                          ? 'bg-primary-light/40 border-primary'
                          : 'bg-background hover:bg-white border-border'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <BookOpen className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                        <span className="font-semibold text-mainText truncate">{r.title}</span>
                      </div>
                      <span className="text-[11px] text-secondaryText flex-shrink-0">{r.cook_time_minutes}m</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column: Recipe Result Display */}
          <div className="lg:col-span-7">
            {recipe ? (
              <Card
                title={recipe.title}
                subtitle={recipe.description || 'Customized artisan recipe'}
                action={
                  <button
                    onClick={() => handleToggleFavorite(recipe.id)}
                    className={`p-2 rounded-lg border transition-colors ${
                      recipe.is_favorite
                        ? 'bg-coral-light text-coral border-coral/30'
                        : 'bg-white text-secondaryText border-border hover:text-coral'
                    }`}
                    title={recipe.is_favorite ? 'Favorited' : 'Add to Favorites'}
                  >
                    <Heart className={`w-4 h-4 ${recipe.is_favorite ? 'fill-coral' : ''}`} />
                  </button>
                }
              >
                {/* Meta Badges */}
                <div className="flex flex-wrap items-center gap-3 py-3 border-y border-border my-3 text-xs">
                  <span className="flex items-center gap-1.5 text-secondaryText">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>Prep: <strong>{recipe.prep_time_minutes}m</strong></span>
                  </span>
                  <span className="flex items-center gap-1.5 text-secondaryText">
                    <Flame className="w-3.5 h-3.5 text-coral" />
                    <span>Cook: <strong>{recipe.cook_time_minutes}m</strong></span>
                  </span>
                  <span className="flex items-center gap-1.5 text-secondaryText">
                    <Users className="w-3.5 h-3.5 text-secondary" />
                    <span>Servings: <strong>{recipe.servings}</strong></span>
                  </span>
                  <Badge variant="primary" size="sm">{recipe.difficulty}</Badge>
                  <Badge variant="secondary" size="sm">{recipe.cuisine}</Badge>
                </div>

                {/* Estimated Nutrition Banner */}
                {recipe.nutrition_estimate && (
                  <div className="grid grid-cols-4 gap-2 my-4 text-center p-3 rounded-xl bg-background border border-border">
                    <div>
                      <p className="text-[10px] text-secondaryText uppercase font-bold">Calories</p>
                      <p className="font-heading font-bold text-sm text-primary">{recipe.nutrition_estimate.calories || 380}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-secondaryText uppercase font-bold">Protein</p>
                      <p className="font-heading font-bold text-sm text-secondary">{recipe.nutrition_estimate.protein || 24}g</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-secondaryText uppercase font-bold">Carbs</p>
                      <p className="font-heading font-bold text-sm text-coral">{recipe.nutrition_estimate.carbs || 36}g</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-secondaryText uppercase font-bold">Fats</p>
                      <p className="font-heading font-bold text-sm text-success">{recipe.nutrition_estimate.fat || 14}g</p>
                    </div>
                  </div>
                )}

                {/* Ingredients List */}
                <div className="space-y-2 pt-2">
                  <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-secondaryText">
                    Ingredients
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {recipe.ingredients.map((ing, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-surface border border-border text-xs">
                        <span className="font-medium text-mainText">{ing.item}</span>
                        <span className="text-secondaryText font-medium">{ing.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step-by-Step Instructions */}
                <div className="space-y-3 pt-4 border-t border-border mt-4">
                  <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-secondaryText">
                    Preparation Steps
                  </h4>
                  <div className="space-y-3">
                    {recipe.instructions.map((step) => (
                      <div key={step.step} className="p-3.5 rounded-xl bg-background border border-border text-xs space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[10px]">
                            {step.step}
                          </span>
                          <span className="font-semibold text-mainText">Step {step.step}</span>
                        </div>
                        <p className="text-mainText leading-relaxed pl-7">{step.instruction}</p>
                        {step.tip && (
                          <p className="text-primary text-[11px] pl-7 italic">
                            💡 Chef's Tip: {step.tip}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="min-h-[380px] flex flex-col items-center justify-center text-center p-8">
                <div className="w-14 h-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center mb-4">
                  <ChefHat className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-base text-mainText mb-1">
                  Ready to Cook
                </h3>
                <p className="text-xs sm:text-sm text-secondaryText max-w-sm">
                  Specify ingredients and dietary requirements on the left, then click Generate to create tailored recipes with step-by-step guidance.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
