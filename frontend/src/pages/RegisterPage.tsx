import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, UserPlus } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError('All fields are required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.register(name, email, password);
      await login(res.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Registration failed. Email may already be in use.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md relative overflow-hidden">
              <span className="font-heading font-black text-xl text-white">F</span>
              <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-coral"></span>
            </div>
            <span className="font-heading font-bold text-xl text-mainText tracking-tight">
              FoodVerse <span className="text-primary">AI</span>
            </span>
          </Link>
          <h2 className="font-heading font-bold text-2xl text-mainText pt-2">Create an account</h2>
          <p className="text-xs sm:text-sm text-secondaryText">Start tracking nutrition, evaluating freshness, and generating tailored recipes.</p>
        </div>

        <div className="bg-surface border border-border rounded-2xl shadow-card p-6 sm:p-8 space-y-5">
          {error && (
            <Alert variant="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Chef Alex"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<UserIcon className="w-4 h-4" />}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="alex@foodverse.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password (min 6 characters)"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              className="w-full mt-2"
              icon={<UserPlus className="w-4 h-4" />}
            >
              Register & Continue
            </Button>
          </form>

          <p className="text-center text-xs text-secondaryText pt-2">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
