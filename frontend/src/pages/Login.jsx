import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LockKeyhole, Mail } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      const response = await api.post(
        '/auth/login',
        form,
      );

      login(response.data);

      if (response.data.user.role === 'ADMIN') {
        navigate('/admin');
      } else if (
        response.data.user.role === 'STORE_OWNER'
      ) {
        navigate('/owner');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to sign in. Please check your credentials.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand-mark">S</div>

        <h1>Welcome to StoreRate</h1>

        <p className="auth-subtitle">
          Sign in to manage and rate stores.
        </p>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >
          <label>
            Email
            <div className="input-wrapper">
              <Mail size={18} />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                placeholder="you@example.com"
              />
            </div>
          </label>

          <label>
            Password
            <div className="input-wrapper">
              <LockKeyhole size={18} />
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                placeholder="Enter your password"
              />
            </div>
          </label>

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
}