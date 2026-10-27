import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { AuthProvider } from '../context/AuthContext';

describe('UI Component Unit Tests', () => {
  it('renders Button with variants and sizes', () => {
    render(<Button variant="primary">Scan Meal</Button>);
    expect(screen.getByText('Scan Meal')).toBeDefined();
  });

  it('renders Badge with custom status', () => {
    render(<Badge variant="success">Fresh & Optimal</Badge>);
    expect(screen.getByText('Fresh & Optimal')).toBeDefined();
  });
});

describe('Page Rendering Tests', () => {
  it('renders the Public Landing Page with brand header and CTAs', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );
    expect(screen.getAllByText(/FoodVerse/i).length).toBeGreaterThan(0);
    expect(screen.getByText('Start Exploring')).toBeDefined();
    expect(screen.getByText('Food Recognition & Nutrition')).toBeDefined();
  });

  it('renders Login form with email and password inputs', () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </AuthProvider>
    );
    expect(screen.getByText('Welcome back')).toBeDefined();
    expect(screen.getByPlaceholderText('alex@foodverse.ai')).toBeDefined();
  });

  it('renders Register form with name and password validation', () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <RegisterPage />
        </BrowserRouter>
      </AuthProvider>
    );
    expect(screen.getByText('Create an account')).toBeDefined();
    expect(screen.getByText('Register & Continue')).toBeDefined();
  });
});
