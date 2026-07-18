import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import logo from '../assets/logo.png';
import { api } from '../services/api';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.login(email, password);
      if (res.token) {
        onLoginSuccess(res.token, res.user);
      } else {
        setError('Terjadi kesalahan sistem. Silakan coba lagi.');
      }
    } catch (err) {
      setError(err.message || 'Email atau password salah.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card-wrapper">
        <div className="login-card">
          <div className="login-header">
            <img src={logo} alt="IuranHub Logo" className="login-logo" />
            <h1 className="login-title">IuranHub RT</h1>
            <p className="login-subtitle">Silakan login untuk mengelola keuangan & hunian RT</p>
          </div>

          {error && (
            <div className="login-error-alert">
              <AlertCircle size={18} className="error-icon" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-input-group">
              <label className="login-input-label">Alamat Email</label>
              <div className="login-input-wrapper">
                <Mail size={18} className="login-field-icon" />
                <input
                  type="email"
                  className="login-input-field"
                  placeholder="admin@iuranhub.rt"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="login-input-group">
              <label className="login-input-label">Password</label>
              <div className="login-input-wrapper">
                <Lock size={18} className="login-field-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="login-input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-submit-button"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-sm"></span>
              ) : (
                <>
                  <span>Masuk Sistem</span>
                  <LogIn size={18} />
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>© 2026 IuranHub RT. All rights reserved.</p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Mode Database Aman (Protected Session)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
