import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Settings,
  Shield,
  Key,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Save,
  Server
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { SystemHealth } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Alert } from '../components/ui/Alert';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [dietary, setDietary] = useState(user?.preferences?.dietary_preference || 'Balanced');
  const [calorieGoal, setCalorieGoal] = useState<number>(user?.preferences?.daily_calorie_goal || 2000);
  const [allergies, setAllergies] = useState<string>((user?.preferences?.allergies || []).join(', '));
  const [health, setHealth] = useState<SystemHealth | null>(null);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; variant: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setDietary(user.preferences?.dietary_preference || 'Balanced');
      setCalorieGoal(user.preferences?.daily_calorie_goal || 2000);
      setAllergies((user.preferences?.allergies || []).join(', '));
    }
    api.getHealth().then(setHealth).catch(() => null);
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const allergyList = allergies
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

    try {
      await api.updateProfile({
        name,
        preferences: {
          dietary_preference: dietary,
          daily_calorie_goal: calorieGoal,
          allergies: allergyList,
        },
      });
      await refreshUser();
      setMessage({ text: 'Profile preferences updated successfully.', variant: 'success' });
    } catch {
      setMessage({ text: 'Failed to update preferences.', variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <DashboardLayout
      title="Profile & Settings"
      description="Manage your account profile, wellness goals, and verify AI provider connectivity."
    >
      <div className="space-y-6 max-w-4xl">
        {message && (
          <Alert variant={message.variant} onClose={() => setMessage(null)}>
            {message.text}
          </Alert>
        )}

        {/* Profile Card */}
        <Card title="Account Profile" subtitle="Your personal information and credentials">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Email Address"
                value={user?.email || ''}
                disabled
                helperText="Email cannot be changed."
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" size="sm" loading={saving} icon={<Save className="w-4 h-4" />}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>

        {/* Dietary Preferences Card */}
        <Card title="Dietary & Nutritional Preferences" subtitle="Customizes default meal planner and recipe recommendations">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondaryText mb-1.5">
                  Default Dietary Focus
                </label>
                <select
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  className="w-full h-10 bg-white border border-border rounded-lg text-sm text-mainText px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Balanced">Balanced</option>
                  <option value="Mediterranean">Mediterranean</option>
                  <option value="High-Protein">High-Protein</option>
                  <option value="Keto">Keto</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Low-Carb">Low-Carb</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondaryText mb-1.5">
                  Daily Caloric Budget: {calorieGoal} kcal
                </label>
                <input
                  type="range"
                  min={1200}
                  max={4000}
                  step={50}
                  value={calorieGoal}
                  onChange={(e) => setCalorieGoal(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer mt-2"
                />
              </div>
            </div>

            <Input
              label="Standard Allergies / Ingredients to Avoid"
              placeholder="e.g. Peanuts, Gluten, Dairy"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              helperText="Separate multiple ingredients with commas."
            />

            <div className="pt-2 flex justify-end">
              <Button type="button" variant="secondary" size="sm" onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
                Update Nutrition Goals
              </Button>
            </div>
          </div>
        </Card>

        {/* AI Provider & Infrastructure Configuration */}
        <Card title="AI Provider & System Status" subtitle="Transparent status of connected machine learning engines">
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-background border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-mainText flex items-center gap-2">
                  <Server className="w-4 h-4 text-primary" /> Active AI Provider Engine
                </span>
                <span className="font-bold uppercase text-primary">
                  {health?.ai_provider?.configured_provider || 'Gemini'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-secondaryText">Live Provider Key Configured:</span>
                {health?.ai_provider?.is_live_configured ? (
                  <Badge variant="success" size="sm" dot>Live Gemini Connected</Badge>
                ) : (
                  <Badge variant="warning" size="sm" dot>Reference Baseline Mode</Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-secondaryText">Backend Database Connection:</span>
                <Badge variant="success" size="sm">
                  {health?.database || 'Connected (SQLite/PostgreSQL)'}
                </Badge>
              </div>
            </div>

            {!health?.ai_provider?.is_live_configured && (
              <div className="p-3.5 rounded-xl bg-primary-light/50 border border-primary/20 text-mainText space-y-2">
                <p className="font-heading font-semibold text-primary">How to activate Live Gemini AI:</p>
                <ol className="list-decimal list-inside space-y-1 text-secondaryText">
                  <li>Open <code>backend/.env</code> in the workspace.</li>
                  <li>Set <code>GEMINI_API_KEY=your_actual_gemini_api_key</code>.</li>
                  <li>Save and restart the backend server with <code>uvicorn backend.app.main:app --reload</code>.</li>
                </ol>
              </div>
            )}
          </div>
        </Card>

        {/* Account Signout */}
        <Card title="Session Control">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm text-mainText">Sign out of FoodVerse AI</p>
              <p className="text-xs text-secondaryText">Terminates the current JWT session on this device.</p>
            </div>
            <Button variant="danger" size="sm" onClick={handleLogout} icon={<LogOut className="w-4 h-4" />}>
              Sign Out
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};
