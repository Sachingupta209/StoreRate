import { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  Users,
  Store,
  Star,
  LogOut,
  Eye,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [storeOwners, setStoreOwners] = useState([]);

  // USER FILTERS
  const [userSearch, setUserSearch] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userRole, setUserRole] = useState('');

  // STORE FILTERS
  const [storeSearch, setStoreSearch] = useState('');
  const [storeEmail, setStoreEmail] = useState('');
  const [storeAddress, setStoreAddress] = useState('');

  const [userSort, setUserSort] = useState({
    field: 'name',
    order: 'asc',
  });

  const [storeSort, setStoreSort] = useState({
    field: 'name',
    order: 'asc',
  });

  const [showUserForm, setShowUserForm] = useState(false);
  const [showStoreForm, setShowStoreForm] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'USER',
  });

  const [storeForm, setStoreForm] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // =========================
  // DASHBOARD
  // =========================

  const loadDashboard = async () => {
    try {
      const response = await api.get('/admin/dashboard');

      const data = response.data;

      setDashboard({
        totalUsers:
          data.totalUsers ??
          data.users ??
          data.totalUserCount ??
          0,

        totalStores:
          data.totalStores ??
          data.stores ??
          data.totalStoreCount ??
          0,

        totalRatings:
          data.totalRatings ??
          data.ratings ??
          data.totalRatingCount ??
          0,
      });
    } catch (err) {
      console.error('Dashboard error:', err);
    }
  };

  // =========================
  // USERS
  // =========================

  const loadUsers = async () => {
    try {
      const response = await api.get('/admin/users', {
        params: {
          name: userSearch || undefined,
          email: userEmail || undefined,
          address: userAddress || undefined,
          role: userRole || undefined,
          sortBy: userSort.field,
          sortOrder: userSort.order,
        },
      });

      const data = response.data;

      setUsers(
        Array.isArray(data)
          ? data
          : data.users || data.data || [],
      );
    } catch (err) {
      console.error('Users error:', err);
      setUsers([]);
    }
  };

  // =========================
  // STORE OWNERS
  // =========================

  const loadStoreOwners = async () => {
    try {
      const response = await api.get('/admin/users', {
        params: {
          role: 'STORE_OWNER',
          sortBy: 'name',
          sortOrder: 'asc',
        },
      });

      const data = response.data;

      setStoreOwners(
        Array.isArray(data)
          ? data
          : data.users || data.data || [],
      );
    } catch (err) {
      console.error('Store owners error:', err);
      setStoreOwners([]);
    }
  };

  // =========================
  // STORES
  // =========================

  const loadStores = async () => {
    try {
      const response = await api.get('/admin/stores', {
        params: {
          name: storeSearch || undefined,
          email: storeEmail || undefined,
          address: storeAddress || undefined,
          sortBy: storeSort.field,
          sortOrder: storeSort.order,
        },
      });

      const data = response.data;

      setStores(
        Array.isArray(data)
          ? data
          : data.stores || data.data || [],
      );
    } catch (err) {
      console.error('Stores error:', err);
      setStores([]);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    loadDashboard();
    loadStoreOwners();
  }, []);

  // =========================
  // USER FILTER/SORT
  // =========================

  useEffect(() => {
    loadUsers();
  }, [
    userSearch,
    userEmail,
    userAddress,
    userRole,
    userSort,
  ]);

  // =========================
  // STORE FILTER/SORT
  // =========================

  useEffect(() => {
    loadStores();
  }, [
    storeSearch,
    storeEmail,
    storeAddress,
    storeSort,
  ]);

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // =========================
  // VIEW USER
  // =========================

  const handleViewUser = async (userId) => {
    setError('');
    setMessage('');
    setLoadingUser(true);

    try {
      const response = await api.get(
        `/admin/users/${userId}`,
      );

      setSelectedUser(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to load user details.',
      );
    } finally {
      setLoadingUser(false);
    }
  };

  // =========================
  // CREATE USER
  // =========================

  const handleUserSubmit = async (event) => {
    event.preventDefault();

    setMessage('');
    setError('');

    try {
      await api.post('/admin/users', {
        name: userForm.name,
        email: userForm.email,
        password: userForm.password,
        address: userForm.address,
        role: userForm.role,
      });

      setMessage('User created successfully.');

      setUserForm({
        name: '',
        email: '',
        password: '',
        address: '',
        role: 'USER',
      });

      setShowUserForm(false);

      await loadDashboard();
      await loadUsers();
      await loadStoreOwners();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to create user.',
      );
    }
  };

  // =========================
  // CREATE STORE
  // =========================

  const handleStoreSubmit = async (event) => {
    event.preventDefault();

    setMessage('');
    setError('');

    if (!storeForm.ownerId) {
      setError('Please select a Store Owner.');
      return;
    }

    try {
      await api.post('/admin/stores', {
        name: storeForm.name,
        email: storeForm.email,
        address: storeForm.address,
        ownerId: Number(storeForm.ownerId),
      });

      setMessage('Store created successfully.');

      setStoreForm({
        name: '',
        email: '',
        address: '',
        ownerId: '',
      });

      setShowStoreForm(false);

      await loadDashboard();
      await loadStores();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to create store.',
      );
    }
  };

  // =========================
  // SORTING
  // =========================

  const toggleSort = (
    current,
    setCurrent,
    field,
  ) => {
    setCurrent({
      field,
      order:
        current.field === field &&
        current.order === 'asc'
          ? 'desc'
          : 'asc',
    });
  };

  return (
    <div className="dashboard-page">
      {/* =========================
          TOP BAR
      ========================= */}

      <header className="topbar">
        <div className="topbar-brand">
          <div className="brand-mark small">
            S
          </div>

          <div>
            <strong>StoreRate</strong>
            <span>Administration</span>
          </div>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          <LogOut size={17} />
          Logout
        </button>
      </header>

      <main className="dashboard-container">
        {/* =========================
            PAGE HEADER
        ========================= */}

        <div className="page-heading">
          <div>
            <h1>Admin Dashboard</h1>

            <p>
              Manage users, stores and platform activity.
            </p>
          </div>
        </div>

        {/* =========================
            ALERTS
        ========================= */}

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

        {/* =========================
            STATISTICS
        ========================= */}

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <Users size={20} />
            </div>

            <div>
              <span>Total Users</span>
              <strong>
                {dashboard.totalUsers}
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <Store size={20} />
            </div>

            <div>
              <span>Total Stores</span>
              <strong>
                {dashboard.totalStores}
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon amber">
              <Star size={20} />
            </div>

            <div>
              <span>Total Ratings</span>
              <strong>
                {dashboard.totalRatings}
              </strong>
            </div>
          </div>
        </section>

        {/* =========================
            USERS
        ========================= */}

        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>Users</h2>

              <p>
                Normal users, store owners and
                administrators
              </p>
            </div>

            <button
              className="primary-small-button"
              onClick={() => {
                setError('');
                setMessage('');
                setShowUserForm(true);
              }}
            >
              <Plus size={17} />
              Add User
            </button>
          </div>

          {/* USER FILTERS */}

          <div className="filters-row">
            <div className="search-box">
              <Search size={17} />

              <input
                value={userSearch}
                onChange={(e) =>
                  setUserSearch(e.target.value)
                }
                placeholder="Search by name..."
              />
            </div>

            <div className="search-box">
              <Search size={17} />

              <input
                value={userEmail}
                onChange={(e) =>
                  setUserEmail(e.target.value)
                }
                placeholder="Filter by email..."
              />
            </div>

            <div className="search-box">
              <Search size={17} />

              <input
                value={userAddress}
                onChange={(e) =>
                  setUserAddress(e.target.value)
                }
                placeholder="Filter by address..."
              />
            </div>

            <select
              value={userRole}
              onChange={(e) =>
                setUserRole(e.target.value)
              }
            >
              <option value="">
                All roles
              </option>

              <option value="USER">
                Normal User
              </option>

              <option value="STORE_OWNER">
                Store Owner
              </option>

              <option value="ADMIN">
                Administrator
              </option>
            </select>
          </div>

          {/* USER TABLE */}

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th
                    onClick={() =>
                      toggleSort(
                        userSort,
                        setUserSort,
                        'name',
                      )
                    }
                  >
                    Name ↕
                  </th>

                  <th
                    onClick={() =>
                      toggleSort(
                        userSort,
                        setUserSort,
                        'email',
                      )
                    }
                  >
                    Email ↕
                  </th>

                  <th>Address</th>

                  <th
                    onClick={() =>
                      toggleSort(
                        userSort,
                        setUserSort,
                        'role',
                      )
                    }
                  >
                    Role ↕
                  </th>

                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="empty-cell"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>

                      <td>{user.email}</td>

                      <td>{user.address}</td>

                      <td>
                        <span className="role-badge">
                          {user.role}
                        </span>
                      </td>

                      <td>
                        <button
                          className="view-button"
                          onClick={() =>
                            handleViewUser(
                              user.id,
                            )
                          }
                        >
                          <Eye size={15} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* =========================
            STORES
        ========================= */}

        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>Stores</h2>

              <p>
                Registered stores and their ratings
              </p>
            </div>

            <button
              className="primary-small-button"
              onClick={() => {
                setError('');
                setMessage('');
                setShowStoreForm(true);
              }}
            >
              <Plus size={17} />
              Add Store
            </button>
          </div>

          {/* STORE FILTERS */}

          <div className="filters-row">
            <div className="search-box">
              <Search size={17} />

              <input
                value={storeSearch}
                onChange={(e) =>
                  setStoreSearch(e.target.value)
                }
                placeholder="Search stores by name..."
              />
            </div>

            <div className="search-box">
              <Search size={17} />

              <input
                value={storeEmail}
                onChange={(e) =>
                  setStoreEmail(e.target.value)
                }
                placeholder="Filter by email..."
              />
            </div>

            <div className="search-box">
              <Search size={17} />

              <input
                value={storeAddress}
                onChange={(e) =>
                  setStoreAddress(e.target.value)
                }
                placeholder="Filter by address..."
              />
            </div>
          </div>

          {/* STORE TABLE */}

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th
                    onClick={() =>
                      toggleSort(
                        storeSort,
                        setStoreSort,
                        'name',
                      )
                    }
                  >
                    Name ↕
                  </th>

                  <th
                    onClick={() =>
                      toggleSort(
                        storeSort,
                        setStoreSort,
                        'email',
                      )
                    }
                  >
                    Email ↕
                  </th>

                  <th
  onClick={() =>
    toggleSort(
      storeSort,
      setStoreSort,
      'address',
    )
  }
>
  Address ↕
</th>

                  <th
                    onClick={() =>
                      toggleSort(
                        storeSort,
                        setStoreSort,
                        'rating',
                      )
                    }
                  >
                    Rating ↕
                  </th>
                </tr>
              </thead>

              <tbody>
                {stores.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="empty-cell"
                    >
                      No stores found.
                    </td>
                  </tr>
                ) : (
                  stores.map((store) => (
                    <tr key={store.id}>
                      <td>{store.name}</td>

                      <td>{store.email}</td>

                      <td>{store.address}</td>

                      <td>
                        <span className="rating-value">
                          ★{' '}
                          {store.rating ??
                            store.averageRating ??
                            0}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* =========================
          ADD USER MODAL
      ========================= */}

      {showUserForm && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h2>Add User</h2>

                <p>
                  Create a normal user, store owner
                  or administrator.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setShowUserForm(false)
                }
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleUserSubmit}
              className="modal-form"
            >
              <label>
                Name

                <input
                  required
                  minLength={20}
                  maxLength={60}
                  value={userForm.name}
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      name: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Email

                <input
                  required
                  type="email"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      email: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Password

                <input
                  required
                  type="password"
                  minLength={8}
                  maxLength={16}
                  value={userForm.password}
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      password: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Address

                <textarea
                  required
                  maxLength={400}
                  rows={3}
                  value={userForm.address}
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      address: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Role

                <select
                  value={userForm.role}
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      role: e.target.value,
                    })
                  }
                >
                  <option value="USER">
                    Normal User
                  </option>

                  <option value="STORE_OWNER">
                    Store Owner
                  </option>

                  <option value="ADMIN">
                    Administrator
                  </option>
                </select>
              </label>

              <button
                className="primary-button"
                type="submit"
              >
                Create User
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================
          ADD STORE MODAL
      ========================= */}

      {showStoreForm && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h2>Add Store</h2>

                <p>
                  Register a store and assign its
                  owner.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setShowStoreForm(false)
                }
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleStoreSubmit}
              className="modal-form"
            >
              <label>
                Store Name

                <input
                  required
                  value={storeForm.name}
                  onChange={(e) =>
                    setStoreForm({
                      ...storeForm,
                      name: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Email

                <input
                  required
                  type="email"
                  value={storeForm.email}
                  onChange={(e) =>
                    setStoreForm({
                      ...storeForm,
                      email: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Address

                <textarea
                  required
                  maxLength={400}
                  rows={3}
                  value={storeForm.address}
                  onChange={(e) =>
                    setStoreForm({
                      ...storeForm,
                      address: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Store Owner

                <select
                  required
                  value={storeForm.ownerId}
                  onChange={(e) =>
                    setStoreForm({
                      ...storeForm,
                      ownerId: e.target.value,
                    })
                  }
                >
                  <option value="">
                    Select Store Owner
                  </option>

                  {storeOwners.map((owner) => (
                    <option
                      key={owner.id}
                      value={owner.id}
                    >
                      {owner.name} — {owner.email}
                    </option>
                  ))}
                </select>

                {storeOwners.length === 0 && (
                  <small>
                    No Store Owner accounts
                    available.
                  </small>
                )}
              </label>

              <button
                className="primary-button"
                type="submit"
                disabled={
                  storeOwners.length === 0
                }
              >
                Create Store
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================
          USER DETAILS MODAL
      ========================= */}

      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal-card user-details-modal">
            <div className="modal-header">
              <div>
                <h2>User Details</h2>

                <p>
                  Complete information for this
                  account.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setSelectedUser(null)
                }
              >
                <X size={18} />
              </button>
            </div>

            {loadingUser ? (
              <div className="details-loading">
                Loading user details...
              </div>
            ) : (
              <div className="user-details">
                <div className="detail-row">
                  <span>Name</span>
                  <strong>
                    {selectedUser.name}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Email</span>
                  <strong>
                    {selectedUser.email}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Address</span>
                  <strong>
                    {selectedUser.address}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Role</span>

                  <strong>
                    <span className="role-badge">
                      {selectedUser.role}
                    </span>
                  </strong>
                </div>

                {selectedUser.role ===
                  'STORE_OWNER' && (
                  <>
                    <div className="detail-rating">
                      <span>
                        Average Rating
                      </span>

                      <strong>
                        ★{' '}
                        {selectedUser.rating ??
                          0}
                      </strong>
                    </div>

                    {selectedUser.stores
                      ?.length > 0 && (
                      <div className="owner-stores">
                        <h3>
                          Owned Store
                        </h3>

                        {selectedUser.stores.map(
                          (store) => (
                            <div
                              className="owner-store-card"
                              key={store.id}
                            >
                              <strong>
                                {store.name}
                              </strong>

                              <span>
                                {store.email}
                              </span>

                              <span>
                                {store.address}
                              </span>

                              <span>
                                ★{' '}
                                {store.rating ??
                                  0}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}