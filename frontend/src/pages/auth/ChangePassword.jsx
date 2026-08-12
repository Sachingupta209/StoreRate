import { useState } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function ChangePassword() {
  const navigate = useNavigate();

  const savedUser = localStorage.getItem(
    'storerate_user',
  );

  let user = null;

  try {
    user = savedUser
      ? JSON.parse(savedUser)
      : null;
  } catch {
    user = null;
  }

  const dashboardPath =
    user?.role === 'STORE_OWNER'
      ? '/owner'
      : '/dashboard';

  const [currentPassword, setCurrentPassword] =
    useState('');

  const [newPassword, setNewPassword] =
    useState('');

  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [showCurrent, setShowCurrent] =
    useState(false);

  const [showNew, setShowNew] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const [error, setError] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const handleBack = () => {
    navigate(dashboardPath);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage('');
    setError('');

    if (!currentPassword) {
      setError(
        'Please enter your current password.',
      );
      return;
    }

    if (!newPassword) {
      setError(
        'Please enter a new password.',
      );
      return;
    }

    if (
      newPassword.length < 8 ||
      newPassword.length > 16
    ) {
      setError(
        'New password must be between 8 and 16 characters.',
      );
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setError(
        'New password must contain at least one uppercase letter.',
      );
      return;
    }

    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      setError(
        'New password must contain at least one special character.',
      );
      return;
    }

    if (!confirmPassword) {
      setError(
        'Please confirm your new password.',
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        'New password and confirm password do not match.',
      );
      return;
    }

    if (currentPassword === newPassword) {
      setError(
        'New password must be different from the current password.',
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        '/auth/change-password',
        {
          currentPassword,
          newPassword,
        },
      );

      setMessage(
        response.data?.message ||
          'Password changed successfully.',
      );

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate(dashboardPath);
      }, 1200);
    } catch (err) {
      console.error(
        'Change password error:',
        err,
      );

      const responseMessage =
        err.response?.data?.message;

      setError(
        Array.isArray(responseMessage)
          ? responseMessage.join(', ')
          : responseMessage ||
            'Unable to change password.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">

      {/* HEADER */}

      <header className="topbar">

        <div className="topbar-brand">

          <div className="brand-mark small">
            S
          </div>

          <div>
            <strong>StoreRate</strong>

            <span>
              Change Password
            </span>
          </div>

        </div>

        <button
          className="secondary-button"
          type="button"
          onClick={handleBack}
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>

      </header>

      {/* CONTENT */}

      <main className="dashboard-container">

        <div className="page-heading">

          <div>

            <h1>
              Change Password
            </h1>

            <p>
              Update your StoreRate account
              password.
            </p>

          </div>

        </div>

        <section className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                Update Password
              </h2>

              <p>
                Enter your current password and
                choose a new secure password.
              </p>

            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="modal-form"
            style={{
              maxWidth: '560px',
              padding: '24px',
            }}
          >

            {/* SUCCESS */}

            {message && (
              <div className="dashboard-alert success">
                {message}
              </div>
            )}

            {/* ERROR */}

            {error && (
              <div className="dashboard-alert error">
                {error}
              </div>
            )}

            {/* CURRENT PASSWORD */}

            <label>
              Current Password

              <div className="password-input">

                <Lock size={17} />

                <input
                  required
                  type={
                    showCurrent
                      ? 'text'
                      : 'password'
                  }
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(
                      e.target.value,
                    )
                  }
                  placeholder="Enter current password"
                  autoComplete="current-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrent(
                      (value) => !value,
                    )
                  }
                  disabled={loading}
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

                <Lock size={17} />

                <input
                  required
                  type={
                    showNew
                      ? 'text'
                      : 'password'
                  }
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value,
                    )
                  }
                  placeholder="Enter new password"
                  minLength={8}
                  maxLength={16}
                  autoComplete="new-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNew(
                      (value) => !value,
                    )
                  }
                  disabled={loading}
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

              <small>
                8–16 characters, at least one
                uppercase letter and one special
                character.
              </small>

            </label>

            {/* CONFIRM PASSWORD */}

            <label>
              Confirm New Password

              <div className="password-input">

                <Lock size={17} />

                <input
                  required
                  type={
                    showConfirm
                      ? 'text'
                      : 'password'
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value,
                    )
                  }
                  placeholder="Confirm new password"
                  minLength={8}
                  maxLength={16}
                  autoComplete="new-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirm(
                      (value) => !value,
                    )
                  }
                  disabled={loading}
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

            {/* ACTIONS */}

            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginTop: '8px',
              }}
            >

              <button
                type="button"
                className="secondary-button"
                onClick={handleBack}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={loading}
              >
                <Lock size={16} />

                {loading
                  ? 'Changing Password...'
                  : 'Change Password'}
              </button>

            </div>

          </form>

        </section>

      </main>

    </div>
  );
}