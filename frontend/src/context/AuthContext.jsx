import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // Khởi tạo: Đọc token từ localStorage khi app load
  // ============================================================
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user_info');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_info');
      }
    }

    // Xác thực token với server để đảm bảo vẫn còn hợp lệ
    if (token) {
      api.get('/auth/me')
        .then(res => {
          setUser(res.data);
          localStorage.setItem('user_info', JSON.stringify(res.data));
        })
        .catch(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_info');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // ============================================================
  // Đăng nhập
  // ============================================================
  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { access_token, user: userData } = res.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user_info', JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  // ============================================================
  // Đăng ký
  // ============================================================
  const register = useCallback(async (fullName, email, password) => {
    const res = await api.post('/auth/register', {
      full_name: fullName,
      email,
      password,
    });
    const { access_token, user: userData } = res.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user_info', JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  // ============================================================
  // Đăng xuất
  // ============================================================
  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
    setUser(null);
  }, []);

  // ============================================================
  // Làm mới thông tin user
  // ============================================================
  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
      localStorage.setItem('user_info', JSON.stringify(res.data));
    } catch {
      // Token hết hạn sẽ được interceptor xử lý
    }
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, logout, register, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
