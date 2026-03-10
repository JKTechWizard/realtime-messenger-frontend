// src/features/auth/components/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validateEmail } from '../../../shared/utils/helpers';
import './Auth.css';

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error, isAuthenticated, clearError } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (isAuthenticated) navigate('/chatrooms');
  }, [isAuthenticated, navigate]);

  useEffect(() => () => { clearError(); }, [clearError]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.email) newErrors.email = 'Email is required';
    else if (!validateEmail(form.email)) newErrors.email = 'Invalid email address';
    if (!form.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await login({ email: form.email.toLowerCase(), password: form.password });
    if (login.fulfilled.match(result)) navigate('/chatrooms');
  };

  return (
    <div className="auth-page">
      <div className="auth-panel-left">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
          </div>
          <span className="auth-logo-name">Nexus Chat</span>
        </div>

        <div className="auth-panel-hero">
          <h1>Welcome <span>back</span> to your workspace.</h1>
          <p>Sign in to continue your conversations, catch up on messages, and collaborate with your team.</p>
        </div>

        <div className="auth-panel-stats">
          <div className="auth-stat">
            <span className="auth-stat-number">10k+</span>
            <span className="auth-stat-label">Active users</span>
          </div>
          <div className="auth-stat">
            <span className="auth-stat-number">500+</span>
            <span className="auth-stat-label">Rooms created</span>
          </div>
          <div className="auth-stat">
            <span className="auth-stat-number">99.9%</span>
            <span className="auth-stat-label">Uptime</span>
          </div>
        </div>
      </div>

      <div className="auth-panel-right">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2>Sign in</h2>
            <p>Don't have an account? <Link to="/signup">Create one</Link></p>
          </div>

          {error && (
            <div className="auth-error-banner" style={{ marginBottom: 16 }}>
              <span>⚠</span> {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="jane@example.com"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                autoComplete="email"
              />
              {errors.email && <span className="auth-field-error">{errors.email}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                autoComplete="current-password"
              />
              {errors.password && <span className="auth-field-error">{errors.password}</span>}
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
