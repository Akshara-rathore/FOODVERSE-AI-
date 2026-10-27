import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Scan,
  ShieldCheck,
  UtensilsCrossed,
  ChefHat,
  CalendarDays,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Database,
  Menu,
  X,
  Activity,
  HeartPulse
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      icon: Scan,
      title: 'Food Recognition & Nutrition',
      description: 'Upload meal photos to detect dishes, quantify estimated macronutrients, and view breakdown charts calibrated against USDA data.',
      color: 'bg-primary-light text-primary',
    },
    {
      icon: ShieldCheck,
      title: 'Freshness Assessment',
      description: 'Inspect visual shelf-life indicators, surface discoloration, and decay risk. Accompanied by rigorous food-safety limitation advisories.',
      color: 'bg-coral-light text-coral',
    },
    {
      icon: UtensilsCrossed,
      title: 'Kitchen Hygiene Auditing',
      description: 'Analyze kitchen images and video frames to detect cross-contamination risks, prep surface sanitation, and corrective checklists.',
      color: 'bg-secondary/15 text-secondary',
    },
    {
      icon: ChefHat,
      title: 'Smart Cooking Assistant',
      description: 'Generate recipes tailored to ingredients on hand, dietary allergies, available time, and difficulty preferences.',
      color: 'bg-primary-light text-primary',
    },
    {
      icon: CalendarDays,
      title: 'Personalized Meal Planner',
      description: 'Create multi-day balanced meal programs tailored to calorie objectives, target macros, and pantry ingredients.',
      color: 'bg-coral-light text-coral',
    },
    {
      icon: Sparkles,
      title: 'Multimodal AI Assistant',
      description: 'Ask culinary questions, query dietary guidelines, inspect food items with photos, and receive context-aware culinary coaching.',
      color: 'bg-secondary/15 text-secondary',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-mainText flex flex-col">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm relative overflow-hidden">
              <span className="font-heading font-black text-lg text-white">F</span>
              <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-coral"></span>
            </div>
            <span className="font-heading font-bold text-lg text-mainText tracking-tight">
              FoodVerse <span className="text-primary">AI</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-secondaryText">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
            <a href="#trust" className="hover:text-primary transition-colors">Privacy & Safety</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-secondaryText p-2 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-white px-4 py-4 space-y-3">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-secondaryText hover:text-primary"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-secondaryText hover:text-primary"
            >
              How It Works
            </a>
            <a
              href="#trust"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-secondaryText hover:text-primary"
            >
              Privacy & Safety
            </a>
            <div className="pt-2 border-t border-border flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button variant="primary" size="sm" className="flex-1" onClick={() => navigate('/register')}>
                Get Started
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-light text-primary text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-coral" />
              <span>Full-Stack Multimodal Food Intelligence</span>
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-mainText tracking-tight leading-[1.12]">
              Intelligent nutrition, freshness & kitchen audits in one place.
            </h1>

            <p className="text-secondaryText text-base sm:text-lg max-w-xl leading-relaxed">
              FoodVerse AI combines computer vision, verified USDA reference nutrition facts, optical freshness analysis, and personalized recipe generation into an integrated, production-grade application.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-5 h-5 ml-1" />}
                onClick={() => navigate('/register')}
              >
                Start Exploring
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Features
              </Button>
            </div>

            {/* Real Feature Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/80">
              <div>
                <p className="font-heading font-bold text-lg text-primary">USDA</p>
                <p className="text-xs text-secondaryText">Reference Database</p>
              </div>
              <div>
                <p className="font-heading font-bold text-lg text-secondary">Multimodal</p>
                <p className="text-xs text-secondaryText">Vision & Video Frames</p>
              </div>
              <div>
                <p className="font-heading font-bold text-lg text-coral">Privacy First</p>
                <p className="text-xs text-secondaryText">User Isolated Records</p>
              </div>
            </div>
          </div>

          {/* Designed Food Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-coral opacity-20 blur-xl"></div>
              <div className="relative bg-surface border border-border rounded-2xl shadow-card p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center text-primary font-bold text-xs">
                      AI
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-sm text-mainText">Live Food Analysis</h4>
                      <p className="text-[11px] text-secondaryText">Multi-spectral Recognition</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-success-light text-success">
                    94% Confidence
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-background border border-border flex items-center justify-between">
                    <div>
                      <span className="text-xs text-secondaryText">Identified Meal</span>
                      <p className="font-heading font-semibold text-sm text-mainText">Mediterranean Quinoa Salmon Bowl</p>
                    </div>
                    <HeartPulse className="w-5 h-5 text-coral" />
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-2.5 rounded-lg bg-primary-light/60 border border-primary/10">
                      <p className="text-[10px] text-secondaryText uppercase font-bold">Calories</p>
                      <p className="font-heading font-bold text-sm text-primary">485</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-100">
                      <p className="text-[10px] text-secondaryText uppercase font-bold">Protein</p>
                      <p className="font-heading font-bold text-sm text-secondary">34g</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-coral-light/60 border border-coral/10">
                      <p className="text-[10px] text-secondaryText uppercase font-bold">Carbs</p>
                      <p className="font-heading font-bold text-sm text-coral">42g</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
                      <p className="text-[10px] text-secondaryText uppercase font-bold">Fats</p>
                      <p className="font-heading font-bold text-sm text-success">19g</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-surface border border-border space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-mainText">Freshness Score</span>
                    <span className="font-bold text-success">88/100 (Optimal)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-success h-2 rounded-full w-[88%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section id="features" className="py-20 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-3 py-1 rounded-full">
              Full Feature Suite
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-mainText mt-3 tracking-tight">
              Built for precision, safety & gastronomy
            </h2>
            <p className="text-secondaryText text-sm sm:text-base mt-3">
              Six purpose-built engines operating seamlessly together to deliver comprehensive food intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-xl border border-border bg-background hover:bg-white hover:shadow-subtle transition-all space-y-3"
                >
                  <div className={`w-11 h-11 rounded-lg ${feat.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-mainText">{feat.title}</h3>
                  <p className="text-xs md:text-sm text-secondaryText leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-coral bg-coral-light px-3 py-1 rounded-full">
            Real Workflow
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-mainText mt-3 tracking-tight">
            How FoodVerse AI Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-3 p-6 rounded-xl bg-surface border border-border">
            <div className="w-10 h-10 rounded-full bg-primary text-white font-bold mx-auto flex items-center justify-center font-heading">
              1
            </div>
            <h4 className="font-heading font-bold text-base text-mainText">Capture or Input</h4>
            <p className="text-xs text-secondaryText leading-relaxed">
              Upload photos of your plate, submit kitchen video footage, or define ingredients and dietary preferences.
            </p>
          </div>

          <div className="space-y-3 p-6 rounded-xl bg-surface border border-border">
            <div className="w-10 h-10 rounded-full bg-secondary text-white font-bold mx-auto flex items-center justify-center font-heading">
              2
            </div>
            <h4 className="font-heading font-bold text-base text-mainText">Multimodal AI Inference</h4>
            <p className="text-xs text-secondaryText leading-relaxed">
              Vision models analyze visual cues, calibrate against USDA nutritional metrics, and assess safety boundaries.
            </p>
          </div>

          <div className="space-y-3 p-6 rounded-xl bg-surface border border-border">
            <div className="w-10 h-10 rounded-full bg-coral text-white font-bold mx-auto flex items-center justify-center font-heading">
              3
            </div>
            <h4 className="font-heading font-bold text-base text-mainText">Actionable Insights</h4>
            <p className="text-xs text-secondaryText leading-relaxed">
              Review structured macros, freshness horizons, corrective kitchen checklists, and save them to your private history.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy and Trust Section */}
      <section id="trust" className="py-16 bg-surface border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-2xl bg-darkNav text-white space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-white">Privacy & Safety Transparency</h3>
                <p className="text-xs text-gray-400">Security principles enforced throughout the application</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span>Uploaded media is saved with sanitized UUID keys and scoped strictly to your account.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span>Passwords are hashed with bcrypt; sessions are guarded by short-lived JWT tokens.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span>Visual freshness and hygiene models provide optical assessments, not regulatory microbiological certification.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span>Nutritional estimates distinguish reference data from model estimates.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-darkNav text-gray-400 py-10 border-t border-white/10 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white">
            <span className="font-heading font-bold text-sm">FoodVerse AI</span>
            <span className="text-gray-500">—</span>
            <span className="text-xs text-gray-400">© 2026 All Rights Reserved.</span>
          </div>

          <p className="text-[11px] text-gray-500 max-w-lg text-center md:text-right">
            Notice: FoodVerse AI provides automated nutritional approximations and advisory guidance. It does not provide medical diagnostic counsel or certify food regulatory compliance.
          </p>
        </div>
      </footer>
    </div>
  );
};
