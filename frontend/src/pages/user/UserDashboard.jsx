import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Star,
  LogOut,
  Lock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function UserDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [stores, setStores] = useState([]);

  const [nameSearch, setNameSearch] = useState('');
  const [addressSearch, setAddressSearch] = useState('');

  const [sort, setSort] = useState({
    field: 'name',
    order: 'asc',
  });

  const [ratings, setRatings] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // =========================================
  // LOAD STORES
  // =========================================

  const loadStores = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/stores', {
        params: {
          name: nameSearch || undefined,
          address: addressSearch || undefined,
        },
      });

      const data = response.data;

      const storeList = Array.isArray(data)
        ? data
        : data.stores || data.data || [];

      setStores(storeList);

      const initialRatings = {};

      storeList.forEach((store) => {
        initialRatings[store.id] =
          store.userRating ?? 0;
      });

      setRatings(initialRatings);
    } catch (err) {
      console.error(
        'Load stores error:',
        err,
      );

      setError(
        err.response?.data?.message ||
          'Unable to load stores.',
      );

      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // LOAD WHEN SEARCH CHANGES
  // =========================================

  useEffect(() => {
    loadStores();
  }, [nameSearch, addressSearch]);

  // =========================================
  // CLIENT-SIDE SORTING
  // =========================================

  const sortedStores = useMemo(() => {
    const result = [...stores];

    result.sort((a, b) => {
      let valueA;
      let valueB;

      if (sort.field === 'name') {
        valueA = a.name || '';
        valueB = b.name || '';
      }

      if (sort.field === 'address') {
        valueA = a.address || '';
        valueB = b.address || '';
      }

      if (sort.field === 'rating') {
        valueA = Number(
          a.overallRating ??
            a.averageRating ??
            a.rating ??
            0,
        );

        valueB = Number(
          b.overallRating ??
            b.averageRating ??
            b.rating ??
            0,
        );
      }

      if (
        sort.field === 'name' ||
        sort.field === 'address'
      ) {
        const comparison = String(
          valueA,
        ).localeCompare(
          String(valueB),
          undefined,
          {
            sensitivity: 'base',
          },
        );

        return sort.order === 'asc'
          ? comparison
          : -comparison;
      }

      return sort.order === 'asc'
        ? valueA - valueB
        : valueB - valueA;
    });

    return result;
  }, [stores, sort]);

  // =========================================
  // SORT TOGGLE
  // =========================================

  const toggleSort = (field) => {
    setSort((current) => ({
      field,
      order:
        current.field === field &&
        current.order === 'asc'
          ? 'desc'
          : 'asc',
    }));
  };

  // =========================================
  // RATING SELECTION
  // =========================================

  const selectRating = (
    storeId,
    rating,
  ) => {
    setRatings((current) => ({
      ...current,
      [storeId]: rating,
    }));

    setMessage('');
    setError('');
  };

  // =========================================
  // SUBMIT / UPDATE RATING
  // =========================================

  const handleRating = async (
    storeId,
  ) => {
    const rating = ratings[storeId];

    if (!rating) {
      setError(
        'Please select a rating from 1 to 5.',
      );
      return;
    }

    setMessage('');
    setError('');

    try {
      await api.post(
        `/stores/${storeId}/rating`,
        {
          rating: Number(rating),
        },
      );

      setMessage(
        'Rating submitted successfully.',
      );

      await loadStores();
    } catch (err) {
      console.error(
        'Rating submission error:',
        err,
      );

      setError(
        err.response?.data?.message ||
          'Unable to submit rating.',
      );
    }
  };

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // =========================================
  // CHANGE PASSWORD
  // =========================================

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  // =========================================
  // SORT ICON
  // =========================================

  const sortIcon = (field) => {
    if (sort.field !== field) {
      return '↕';
    }

    return sort.order === 'asc'
      ? '↑'
      : '↓';
  };

  return (
    <div className="dashboard-page">

      {/* =====================================
          TOP BAR
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
              User Portal
            </span>
          </div>

        </div>

        <div className="topbar-actions">

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
              Store Ratings
            </h1>

            <p>
              Find stores and submit your rating
              from 1 to 5.
            </p>

          </div>

        </div>

        {/* =====================================
            ALERTS
        ====================================== */}

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

        {/* =====================================
            SEARCH
        ====================================== */}

        <section className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                Find Stores
              </h2>

              <p>
                Search by store name or address.
              </p>

            </div>

          </div>

          <div className="filters-row">

            <div className="search-box">

              <Search size={17} />

              <input
                type="text"
                value={nameSearch}
                onChange={(e) =>
                  setNameSearch(
                    e.target.value,
                  )
                }
                placeholder="Search by store name..."
              />

            </div>

            <div className="search-box">

              <Search size={17} />

              <input
                type="text"
                value={addressSearch}
                onChange={(e) =>
                  setAddressSearch(
                    e.target.value,
                  )
                }
                placeholder="Search by address..."
              />

            </div>

          </div>

        </section>

        {/* =====================================
            STORE LIST
        ====================================== */}

        <section className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                Stores
              </h2>

              <p>
                View store ratings and submit or
                update your rating.
              </p>

            </div>

          </div>

          {loading ? (

            <div className="details-loading">
              Loading stores...
            </div>

          ) : sortedStores.length === 0 ? (

            <div className="empty-cell">
              No stores found.
            </div>

          ) : (

            <div className="table-wrapper">

              <table>

                <thead>

                  <tr>

                    {/* STORE NAME */}

                    <th
                      onClick={() =>
                        toggleSort('name')
                      }
                      style={{
                        cursor: 'pointer',
                      }}
                    >
                      Name {sortIcon('name')}
                    </th>

                    {/* ADDRESS */}

                    <th
                      onClick={() =>
                        toggleSort('address')
                      }
                      style={{
                        cursor: 'pointer',
                      }}
                    >
                      Address{' '}
                      {sortIcon('address')}
                    </th>

                    {/* OVERALL RATING */}

                    <th
                      onClick={() =>
                        toggleSort('rating')
                      }
                      style={{
                        cursor: 'pointer',
                      }}
                    >
                      Overall Rating{' '}
                      {sortIcon('rating')}
                    </th>

                    {/* YOUR RATING */}

                    <th>
                      Your Rating
                    </th>

                    {/* SUBMIT */}

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {sortedStores.map(
                    (store) => {

                      const currentRating =
                        ratings[store.id] ??
                        store.userRating ??
                        0;

                      const overallRating =
                        store.overallRating ??
                        store.averageRating ??
                        store.rating ??
                        0;

                      return (

                        <tr
                          key={store.id}
                        >

                          {/* NAME */}

                          <td>

                            <strong>
                              {store.name}
                            </strong>

                          </td>

                          {/* ADDRESS */}

                          <td>
                            {store.address ||
                              '-'}
                          </td>

                          {/* OVERALL RATING */}

                          <td>

                            <span className="rating-value">

                              ★{' '}

                              {overallRating}

                            </span>

                          </td>

                          {/* USER RATING */}

                          <td>

                            {store.userRating ? (

                              <span className="rating-value">

                                ★{' '}

                                {
                                  store.userRating
                                }

                              </span>

                            ) : (

                              <span className="not-rated">
                                Not rated
                              </span>

                            )}

                          </td>

                          {/* RATING */}

                          <td>

                            <div className="rating-control">

                              <div className="star-selector">

                                {[1, 2, 3, 4, 5].map(
                                  (star) => (

                                    <button
                                      key={star}
                                      type="button"
                                      className={
                                        star <=
                                        currentRating
                                          ? 'star-button active'
                                          : 'star-button'
                                      }
                                      onClick={() =>
                                        selectRating(
                                          store.id,
                                          star,
                                        )
                                      }
                                      title={`Rate ${star} out of 5`}
                                      aria-label={`Rate ${star} out of 5`}
                                    >

                                      <Star
                                        size={20}
                                        fill={
                                          star <=
                                          currentRating
                                            ? 'currentColor'
                                            : 'none'
                                        }
                                      />

                                    </button>

                                  ),
                                )}

                              </div>

                              <button
                                type="button"
                                className="rating-submit-button"
                                disabled={
                                  !currentRating
                                }
                                onClick={() =>
                                  handleRating(
                                    store.id,
                                  )
                                }
                              >

                                {store.userRating
                                  ? 'Update Rating'
                                  : 'Submit Rating'}

                              </button>

                            </div>

                          </td>

                        </tr>

                      );
                    },
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}