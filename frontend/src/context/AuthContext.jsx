import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await authAPI.login({ username, password });
    const { token, username: uname, role, message, studentId } = response.data;
    const userData = { username: uname, role, token, studentId: studentId || null };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return response.data;
  };

  const register = async (username, password, role) => {
    const response = await authAPI.register({ username, password, role });
    // Do not auto-login: only return the response so they must sign in explicitly.
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const isAdmin = () => user?.role === 'ADMIN';
  const isTeacher = () => user?.role === 'TEACHER';
  const isStudent = () => user?.role === 'STUDENT';
  const isAdminOrTeacher = () => user?.role === 'ADMIN' || user?.role === 'TEACHER';

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    hasRole,
    isAdmin,
    isTeacher,
    isStudent,
    isAdminOrTeacher,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
