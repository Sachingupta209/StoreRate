import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('storerate_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (data) => {
    localStorage.setItem(
      'storerate_token',
      data.accessToken,
    );

    localStorage.setItem(
      'storerate_user',
      JSON.stringify(data.user),
    );

    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('storerate_token');
    localStorage.removeItem('storerate_user');
    setUser(null);
  };

  useEffect(() => {
    const savedUser =
      localStorage.getItem('storerate_user');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}