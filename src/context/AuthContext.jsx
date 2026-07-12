import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('transitops-user');
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    const name = userData.name || 'User';
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    
    const u = { ...userData, initials };
    setUser(u);
    localStorage.setItem('transitops-user', JSON.stringify(u));
    if (token) {
      localStorage.setItem('transitops-token', token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('transitops-user');
    localStorage.removeItem('transitops-token');
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
