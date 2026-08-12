import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/auth/register', form);

      setSuccess(
        'Registration successful. Redirecting to login...',
      );

      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Registration failed.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="brand-mark">S</div>

        <h1>Create your account</h1>

        <p className="auth-subtitle">
          Join StoreRate and share your store experiences.
        </p>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >
          <label>
            Name
            <input
              required
              minLength={20}
              maxLength={60}
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              placeholder="Your full name"
            />
          </label>

          <label>
            Email
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
          </label>

          <label>
            Address
            <textarea
              required
              maxLength={400}
              rows={3}
              value={form.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: e.target.value,
                })
              }
              placeholder="Your address"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              required
              minLength={8}
              maxLength={16}
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              placeholder="8–16 characters"
            />

            <small>
              Must contain at least one uppercase letter
              and one special character.
            </small>
          </label>

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? 'Creating account...'
              : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          Already registered?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}