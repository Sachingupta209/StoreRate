import { useEffect, useMemo, useState } from 'react';
import {
  Store,
  Star,
  Users,
  LogOut,
  Lock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Rating table sorting
  const [ratingSort, setRatingSort] = useState({
    field: 'submittedAt',
    order: 'desc',
  });

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/owner/dashboard');

      setDashboard(response.data);
    } catch (err) {
      console.error(
        'Owner dashboard error:',
        err,
      );

      setError(
        err.response?.data?.message ||
          'Unable to load owner dashboard.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  // =========================================
  // SORT RATINGS
  // =========================================

  const sortRatings = (ratings) => {
    if (!ratings || ratings.length === 0) {
      return [];
    }

    const result = [...ratings];

    result.sort((a, b) => {
      let valueA;
      let valueB;

      switch (ratingSort.field) {
        case 'user':
          valueA = a.user?.name || '';
          valueB = b.user?.name || '';

          return ratingSort.order === 'asc'
            ? String(valueA).localeCompare(
                String(valueB),
                undefined,
                { sensitivity: 'base' },
              )
            : String(valueB).localeCompare(
                String(valueA),
                undefined,
                { sensitivity: 'base' },
              );

        case 'email':
          valueA = a.user?.email || '';
          valueB = b.user?.email || '';

          return ratingSort.order === 'asc'
            ? String(valueA).localeCompare(
                String(valueB),
                undefined,
                { sensitivity: 'base' },
              )
            : String(valueB).localeCompare(
                String(valueA),
                undefined,
                { sensitivity: 'base' },
              );

        case 'rating':
          valueA = Number(a.rating || 0);
          valueB = Number(b.rating || 0);

          return ratingSort.order === 'asc'
            ? valueA - valueB
            : valueB - valueA;

        case 'submittedAt':
          valueA = a.submittedAt
            ? new Date(a.submittedAt).getTime()
            : 0;

          valueB = b.submittedAt
            ? new Date(b.submittedAt).getTime()
            : 0;

          return ratingSort.order === 'asc'
            ? valueA - valueB
            : valueB - valueA;

        default:
          return 0;
      }
    });

    return result;
  };

  const toggleRatingSort = (field) => {
    setRatingSort((current) => ({
      field,
      order:
        current.field === field &&
        current.order === 'asc'
          ? 'desc'
          : 'asc',
    }));
  };

  const getSortIcon = (field) => {
    if (ratingSort.field !== field) {
      return '↕';
    }

    return ratingSort.order === 'asc'
      ? '↑'
      : '↓';
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="page-center">
        <div className="placeholder-card">
          <h2>
            Loading dashboard...
          </h2>
        </div>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error) {
    return (
      <div className="page-center">
        <div className="placeholder-card">

          <h2>
            Unable to load dashboard
          </h2>

          <p>
            {error}
          </p>

          <button
            className="primary-button"
            type="button"
            onClick={loadDashboard}
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  const owner = dashboard?.owner;
  const stores = dashboard?.stores || [];

  // =========================================
  // STATISTICS
  // =========================================

  const totalStores = stores.length;

  const totalRatings = stores.reduce(
    (sum, store) =>
      sum +
      Number(store.totalRatings || 0),
    0,
  );

  const totalRatingPoints = stores.reduce(
    (sum, store) =>
      sum +
      Number(store.averageRating || 0) *
        Number(store.totalRatings || 0),
    0,
  );

  const overallRating =
    totalRatings > 0
      ? Number(
          (
            totalRatingPoints /
            totalRatings
          ).toFixed(1),
        )
      : 0;

  return (
    <div className="dashboard-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <header className="topbar">

        <div className="topbar-brand">

          <div className="brand-mark small">
            S
          </div>

          <div>
            <strong>
              StoreRate
            </strong>

            <span>
              Store Owner
            </span>
          </div>

        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >

          <button
            className="secondary-button"
            type="button"
            onClick={
              handleChangePassword
            }
          >
            <Lock size={16} />
            Change Password
          </button>

          <button
            className="logout-button"
            type="button"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

      </header>

      <main className="dashboard-container">

        {/* =====================================
            PAGE HEADING
        ====================================== */}

        <div className="page-heading">

          <div>

            <h1>
              Store Owner Dashboard
            </h1>

            <p>
              Welcome,{' '}
              {owner?.name || 'Store Owner'}.
              Manage your store and view
              customer ratings.
            </p>

          </div>

        </div>

        {/* =====================================
            OWNER INFORMATION
        ====================================== */}

        <section className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                Owner Information
              </h2>

              <p>
                Account information associated
                with your store.
              </p>

            </div>

          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '0',
              padding: '20px 18px',
            }}
          >

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                padding: '0 20px 0 0',
                minWidth: 0,
              }}
            >

              <span
                style={{
                  fontSize: '12px',
                  color: '#64748b',
                  fontWeight: 500,
                }}
              >
                Name
              </span>

              <strong
                style={{
                  fontSize: '14px',
                  color: '#0f172a',
                  fontWeight: 600,
                  wordBreak: 'break-word',
                }}
              >
                {owner?.name || '-'}
              </strong>

            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                padding: '0 20px',
                minWidth: 0,
                borderLeft:
                  '1px solid #e2e8f0',
              }}
            >

              <span
                style={{
                  fontSize: '12px',
                  color: '#64748b',
                  fontWeight: 500,
                }}
              >
                Email
              </span>

              <strong
                style={{
                  fontSize: '14px',
                  color: '#0f172a',
                  fontWeight: 600,
                  wordBreak: 'break-word',
                }}
              >
                {owner?.email || '-'}
              </strong>

            </div>

          </div>

        </section>

        {/* =====================================
            STATISTICS
        ====================================== */}

        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon green">
              <Store size={20} />
            </div>

            <div>

              <span>
                Total Stores
              </span>

              <strong>
                {totalStores}
              </strong>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon amber">
              <Star size={20} />
            </div>

            <div>

              <span>
                Average Rating
              </span>

              <strong
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >

                <Star
                  size={17}
                  fill="currentColor"
                />

                {overallRating}

              </strong>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon blue">
              <Users size={20} />
            </div>

            <div>

              <span>
                Total Ratings
              </span>

              <strong>
                {totalRatings}
              </strong>

            </div>

          </div>

        </section>

        {/* =====================================
            STORES
        ====================================== */}

        {stores.length === 0 ? (

          <section className="dashboard-section">

            <div className="section-header">

              <div>

                <h2>
                  Your Stores
                </h2>

                <p>
                  Stores assigned to your
                  account.
                </p>

              </div>

            </div>

            <div className="empty-cell">
              No stores are assigned to
              this account.
            </div>

          </section>

        ) : (

          stores.map((store) => {

            const sortedRatings =
              sortRatings(
                store.ratings,
              );

            return (

              <section
                className="dashboard-section"
                key={store.id}
              >

                {/* STORE HEADER */}

                <div className="section-header">

                  <div>

                    <h2>
                      {store.name}
                    </h2>

                    <p>
                      Store details and
                      customer ratings.
                    </p>

                  </div>

                </div>

                {/* =================================
                    STORE DETAILS
                ================================== */}

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '0',
                    padding: '20px 18px',
                    borderBottom:
                      '1px solid #e2e8f0',
                  }}
                >

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      padding: '0 18px',
                      minWidth: 0,
                    }}
                  >

                    <span
                      style={{
                        fontSize: '12px',
                        color: '#64748b',
                        fontWeight: 500,
                      }}
                    >
                      Store Name
                    </span>

                    <strong
                      style={{
                        fontSize: '14px',
                        color: '#0f172a',
                        fontWeight: 600,
                        wordBreak:
                          'break-word',
                      }}
                    >
                      {store.name || '-'}
                    </strong>

                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      padding: '0 18px',
                      minWidth: 0,
                      borderLeft:
                        '1px solid #e2e8f0',
                    }}
                  >

                    <span
                      style={{
                        fontSize: '12px',
                        color: '#64748b',
                        fontWeight: 500,
                      }}
                    >
                      Email
                    </span>

                    <strong
                      style={{
                        fontSize: '14px',
                        color: '#0f172a',
                        fontWeight: 600,
                        wordBreak:
                          'break-word',
                      }}
                    >
                      {store.email || '-'}
                    </strong>

                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      padding: '0 18px',
                      minWidth: 0,
                      borderLeft:
                        '1px solid #e2e8f0',
                    }}
                  >

                    <span
                      style={{
                        fontSize: '12px',
                        color: '#64748b',
                        fontWeight: 500,
                      }}
                    >
                      Address
                    </span>

                    <strong
                      style={{
                        fontSize: '14px',
                        color: '#0f172a',
                        fontWeight: 600,
                        lineHeight: '1.5',
                        wordBreak:
                          'break-word',
                      }}
                    >
                      {store.address || '-'}
                    </strong>

                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      padding: '0 18px',
                      minWidth: 0,
                      borderLeft:
                        '1px solid #e2e8f0',
                    }}
                  >

                    <span
                      style={{
                        fontSize: '12px',
                        color: '#64748b',
                        fontWeight: 500,
                      }}
                    >
                      Average Rating
                    </span>

                    <strong
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '14px',
                        color: '#d97706',
                        fontWeight: 600,
                      }}
                    >

                      <Star
                        size={16}
                        fill="currentColor"
                      />

                      {store.averageRating ??
                        0}

                    </strong>

                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      padding: '0 18px',
                      minWidth: 0,
                      borderLeft:
                        '1px solid #e2e8f0',
                    }}
                  >

                    <span
                      style={{
                        fontSize: '12px',
                        color: '#64748b',
                        fontWeight: 500,
                      }}
                    >
                      Total Ratings
                    </span>

                    <strong
                      style={{
                        fontSize: '14px',
                        color: '#0f172a',
                        fontWeight: 600,
                      }}
                    >
                      {store.totalRatings ??
                        0}
                    </strong>

                  </div>

                </div>

                {/* =================================
                    CUSTOMER RATINGS HEADER
                ================================== */}

                <div
                  style={{
                    padding:
                      '18px 18px 12px 18px',
                  }}
                >

                  <h3
                    style={{
                      margin: 0,
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#0f172a',
                    }}
                  >
                    Customer Ratings
                  </h3>

                  <p
                    style={{
                      margin:
                        '5px 0 0 0',
                      fontSize: '12px',
                      color: '#64748b',
                    }}
                  >
                    Ratings submitted by
                    users for this store.
                  </p>

                </div>

                {/* =================================
                    RATINGS TABLE
                ================================== */}

                <div className="table-wrapper">

                  <table>

                    <thead>

                      <tr>

                        <th
                          onClick={() =>
                            toggleRatingSort(
                              'user',
                            )
                          }
                          style={{
                            cursor:
                              'pointer',
                          }}
                        >
                          User{' '}
                          {getSortIcon(
                            'user',
                          )}
                        </th>

                        <th
                          onClick={() =>
                            toggleRatingSort(
                              'email',
                            )
                          }
                          style={{
                            cursor:
                              'pointer',
                          }}
                        >
                          Email{' '}
                          {getSortIcon(
                            'email',
                          )}
                        </th>

                        <th
                          onClick={() =>
                            toggleRatingSort(
                              'rating',
                            )
                          }
                          style={{
                            cursor:
                              'pointer',
                          }}
                        >
                          Rating{' '}
                          {getSortIcon(
                            'rating',
                          )}
                        </th>

                        <th
                          onClick={() =>
                            toggleRatingSort(
                              'submittedAt',
                            )
                          }
                          style={{
                            cursor:
                              'pointer',
                          }}
                        >
                          Submitted{' '}
                          {getSortIcon(
                            'submittedAt',
                          )}
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {sortedRatings.length ===
                      0 ? (

                        <tr>

                          <td
                            colSpan="4"
                            className="empty-cell"
                          >
                            No ratings submitted
                            yet.
                          </td>

                        </tr>

                      ) : (

                        sortedRatings.map(
                          (item) => (

                            <tr
                              key={item.id}
                            >

                              <td>
                                {item.user
                                  ?.name ||
                                  'Unknown'}
                              </td>

                              <td>
                                {item.user
                                  ?.email ||
                                  '-'}
                              </td>

                              <td>

                                <span
                                  style={{
                                    display:
                                      'inline-flex',
                                    alignItems:
                                      'center',
                                    gap: '4px',
                                    color:
                                      '#d97706',
                                    fontWeight:
                                      600,
                                  }}
                                >

                                  <Star
                                    size={15}
                                    fill="currentColor"
                                  />

                                  {item.rating}

                                </span>

                              </td>

                              <td>
                                {item.submittedAt
                                  ? new Date(
                                      item.submittedAt,
                                    ).toLocaleString()
                                  : '-'}
                              </td>

                            </tr>

                          ),
                        )

                      )}

                    </tbody>

                  </table>

                </div>

              </section>

            );
          })

        )}

      </main>

    </div>
  );
}