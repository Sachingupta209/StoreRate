import { useState } from 'react';
import { Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ChangePassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError('');
    setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setMessage('');

    if (form.newPassword !== form.confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    if (form.newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (form.newPassword.length > 16) {
      setError('Password must not exceed 16 characters.');
      return;
    }

    if (!/[A-Z]/.test(form.newPassword)) {
      setError(
        'Password must contain at least one uppercase letter.',
      );
      return;
    }

    if (!/[^A-Za-z0-9]/.test(form.newPassword)) {
      setError(
        'Password must contain at least one special character.',
      );
      return;
    }

    if (form.currentPassword === form.newPassword) {
      setError(
        'New password must be different from the current password.',
      );
      return;
    }

    try {
      setLoading(true);

      await api.post('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setMessage('Password changed successfully.');

      setForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to change password.',
      );
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    const user = JSON.parse(
      localStorage.getItem('storerate_user'),
    );

    if (user?.role === 'STORE_OWNER') {
      navigate('/owner');
      return;
    }

    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <button
          type="button"
          className="back-button"
          onClick={goBack}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        <div className="auth-header">
          <div className="brand-mark">
            S
          </div>

          <h1>Change Password</h1>

          <p>
            Update your StoreRate account password.
          </p>
        </div>

        {message && (
          <div className="dashboard-alert success">
            {message}
          </div>
        )}

        {error && (
          <div className="dashboard-alert error">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >

          {/* CURRENT PASSWORD */}

          <label>
            Current Password

            <div className="password-input">
              <input
                required
                type={
                  showCurrent
                    ? 'text'
                    : 'password'
                }
                name="currentPassword"
                value={
                  form.currentPassword
                }
                onChange={handleChange}
                autoComplete="current-password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowCurrent(
                    (value) => !value,
                  )
                }
                aria-label={
                  showCurrent
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showCurrent ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>
          </label>

          {/* NEW PASSWORD */}

          <label>
            New Password

            <div className="password-input">
              <input
                required
                type={
                  showNew
                    ? 'text'
                    : 'password'
                }
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                minLength={8}
                maxLength={16}
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowNew(
                    (value) => !value,
                  )
                }
                aria-label={
                  showNew
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showNew ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>
          </label>

          {/* CONFIRM PASSWORD */}

          <label>
            Confirm New Password

            <div className="password-input">
              <input
                required
                type={
                  showConfirm
                    ? 'text'
                    : 'password'
                }
                name="confirmPassword"
                value={
                  form.confirmPassword
                }
                onChange={handleChange}
                minLength={8}
                maxLength={16}
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirm(
                    (value) => !value,
                  )
                }
                aria-label={
                  showConfirm
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showConfirm ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>
          </label>

          <div className="password-requirements">
            <strong>Password requirements</strong>

            <span>8–16 characters</span>
            <span>At least one uppercase letter</span>
            <span>At least one special character</span>
          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            <Lock size={17} />

            {loading
              ? 'Changing Password...'
              : 'Change Password'}
          </button>

        </form>
      </div>
    </div>
  );
}