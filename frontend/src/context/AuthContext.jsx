import {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const storedUser = localStorage.getItem('buddy-user');

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch (error) {
    console.error('Failed to read stored user:', error);
    return null;
  }
}

function readStoredToken() {
  return localStorage.getItem('buddy-token') || '';
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(readStoredToken);

  const login = (profile, authToken) => {
    if (!profile) {
      console.error('Login failed: user profile is missing');
      return;
    }

    if (!authToken) {
      console.error('Login failed: authentication token is missing');
      return;
    }

    setUser(profile);
    setToken(authToken);

    localStorage.setItem(
      'buddy-user',
      JSON.stringify(profile)
    );

    localStorage.setItem(
      'buddy-token',
      authToken
    );
  };

  const logout = () => {
    setUser(null);
    setToken('');

    localStorage.removeItem('buddy-user');
    localStorage.removeItem('buddy-token');
  };

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      isAuthenticated: Boolean(user && token),
      isAdmin: user?.role === 'admin',
      isBuddy: user?.isBuddy === true,
    }),
    [user, token]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}