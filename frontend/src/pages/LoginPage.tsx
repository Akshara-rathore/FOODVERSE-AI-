import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.login(email, password);
      await login(res.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Invalid email or password. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('chef@foodverse.ai');
    setPassword('FoodVerse2026!');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
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
          <h2 className="font-heading font-bold text-2xl text-mainText pt-2">Welcome back</h2>
          <p className="text-xs sm:text-sm text-secondaryText">Enter your credentials to access your food intelligence workspace.</p>
        </div>

        {/* Card Form */}
        <div className="bg-surface border border-border rounded-2xl shadow-card p-6 sm:p-8 space-y-5">
          {error && (
            <Alert variant="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              label="Password"
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
              icon={<LogIn className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface px-2 text-secondaryText font-medium">Quick Test</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={handleDemoLogin}
          >
            Pre-fill Demo Credentials
          </Button>

          <p className="text-center text-xs text-secondaryText pt-2">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
