'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { buildCartItem } from '@/lib/catalog';
import { loginUser, registerUser, updateProfile } from '@/lib/api';

const CART_STORAGE_KEY = 'radhe-boutique-cart';
const AUTH_STORAGE_KEY = 'radhe-boutique-auth';

const StoreContext = createContext(null);

function clampQuantity(qty, stock) {
  if (!stock) {
    return Math.max(1, qty);
  }

  return Math.max(1, Math.min(qty, stock));
}

export function StoreProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const [authToken, setAuthToken] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      const storedAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);

      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }

      if (storedAuth) {
        const parsedAuth = JSON.parse(storedAuth);
        setAuthUser(parsedAuth.user || null);
        setAuthToken(parsedAuth.token || '');
      }
    } catch {
      setCartItems([]);
      setAuthUser(null);
      setAuthToken('');
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems, isHydrated]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!authUser || !authToken) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        user: authUser,
        token: authToken,
      })
    );
  }, [authToken, authUser, isHydrated]);

  const setAuthSession = (response) => {
    setAuthUser({
      _id: response._id,
      name: response.name,
      email: response.email,
      phone: response.phone || '',
      role: response.role,
    });
    setAuthToken(response.token);
    return response;
  };

  const login = async (credentials) => {
    const response = await loginUser(credentials);
    return setAuthSession(response);
  };

  const register = async (payload) => {
    const response = await registerUser(payload);
    return setAuthSession(response);
  };

  const saveProfile = async (payload) => {
    const response = await updateProfile(authToken, payload);
    return setAuthSession(response);
  };

  const addToCart = (product, options = {}) => {
    const item = buildCartItem(product, options);

    setCartItems((currentItems) => {
      const existingItem = currentItems.find((entry) => entry.id === item.id);
      if (!existingItem) {
        return [...currentItems, item];
      }

      return currentItems.map((entry) =>
        entry.id === item.id
          ? {
              ...entry,
              qty: clampQuantity(entry.qty + item.qty, entry.stock),
            }
          : entry
      );
    });

    return item;
  };

  const updateCartItem = (itemId, qty) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === itemId
            ? {
                ...item,
                qty: clampQuantity(Number(qty) || 1, item.stock),
              }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (itemId) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const logout = () => {
    setAuthUser(null);
    setAuthToken('');
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <StoreContext.Provider
      value={{
        cartItems,
        cartCount,
        isHydrated,
        authUser,
        authToken,
        isAuthenticated: Boolean(authUser && authToken),
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        login,
        register,
        logout,
        saveProfile,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }

  return context;
}
