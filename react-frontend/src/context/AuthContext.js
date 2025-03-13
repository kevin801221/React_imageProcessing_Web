import React, { createContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

export const AuthContext = createContext();

// useAuth is now moved to a separate hook file

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(2.5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // In development, we'll use mock data if the API is not available
        try {
          const userResponse = await authApi.getCurrentUser();
          if (userResponse.data.success) {
            setUser(userResponse.data.user);
            
            const pointsResponse = await authApi.getPointsBalance();
            if (pointsResponse.data.success) {
              setPoints(pointsResponse.data.balance);
            }
          }
        } catch (apiError) {
          console.warn('API not available, using mock data', apiError);
          // Mock user data for development
          setUser({
            id: 1,
            username: 'user',
            email: 'user@example.com'
          });
          setPoints(2.5);
        }
      } catch (err) {
        setError('Failed to load user data');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const addPoints = async (amount) => {
    try {
      const response = await authApi.addPoints(amount);
      if (response.data.success) {
        setPoints(response.data.newBalance);
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      console.error('Error adding points:', err);
      // Fallback for development
      setPoints(prev => prev + amount);
      return { success: true };
    }
  };

  const checkPointsHistory = async () => {
    try {
      const response = await authApi.getPointsHistory();
      if (response.data.success) {
        return {
          success: true,
          history: response.data.history
        };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      console.error('Error fetching points history:', err);
      // Fallback for development
      return {
        success: true,
        history: [
          { date: '2025-03-13', amount: 5.0, description: 'Initial purchase' },
          { date: '2025-03-12', amount: -2.5, description: 'Used for image generation' }
        ]
      };
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authApi.login(credentials);
      if (response.data.success) {
        setUser(response.data.user);
        setPoints(response.data.points || 0);
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      console.error('Error logging in:', err);
      return { success: false, message: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authApi.register(userData);
      if (response.data.success) {
        setUser(response.data.user);
        setPoints(response.data.points || 0);
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      console.error('Error registering:', err);
      return { success: false, message: 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      setPoints(0);
      return { success: true };
    } catch (err) {
      console.error('Error logging out:', err);
      // Still clear user data on the client side
      setUser(null);
      setPoints(0);
      return { success: true };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      points, 
      loading, 
      error, 
      login,
      register,
      logout,
      addPoints, 
      checkPointsHistory 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
