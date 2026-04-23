import { calculateOrderTotals } from '@/lib/pricing';
import {
  getFallbackProduct,
  getFallbackProducts,
  getFallbackReviews,
} from '@/lib/demo-data';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
const DEMO_ORDERS_STORAGE_KEY = 'radhe-boutique-demo-orders';
const DEMO_USERS_STORAGE_KEY = 'radhe-boutique-demo-users';
const hasBackendApi = Boolean(API_BASE);

const requestOptions = {
  cache: 'no-store',
};

function buildSearchParams(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });

  return searchParams;
}

function normalizeEmail(value = '') {
  return String(value).trim().toLowerCase();
}

function createDemoToken(userId) {
  return `demo-token:${userId}:${Date.now()}`;
}

function decodeDemoToken(token = '') {
  const [prefix, userId] = String(token).split(':');
  if (prefix !== 'demo-token' || !userId) {
    return null;
  }

  return userId;
}

function readDemoUsers() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(DEMO_USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeDemoUsers(users) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(DEMO_USERS_STORAGE_KEY, JSON.stringify(users));
}

function findDemoUserByToken(token) {
  const userId = decodeDemoToken(token);
  if (!userId) {
    return null;
  }

  return readDemoUsers().find((user) => user._id === userId) || null;
}

function buildDemoAuthResponse(user, token = createDemoToken(user._id)) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    role: user.role || 'user',
    token,
  };
}

function buildJsonHeaders(token) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function readJsonResponse(response, fallbackMessage) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || fallbackMessage);
  }

  return response.json();
}

function readDemoOrders() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(DEMO_ORDERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeDemoOrders(orders) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(DEMO_ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

function createDemoOrder(orderInput) {
  const totals = calculateOrderTotals(orderInput.orderItems);
  const order = {
    _id: `demo-order-${Date.now()}`,
    orderNumber: `RB-DEMO-${String(Date.now()).slice(-6)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'Pending',
    paymentStatus:
      orderInput.paymentMethod === 'Cash on Delivery'
        ? 'Pending'
        : 'Awaiting Confirmation',
    ...orderInput,
    ...totals,
  };

  const orders = readDemoOrders();
  orders.unshift(order);
  writeDemoOrders(orders);
  return order;
}

export async function fetchProducts(params = {}) {
  if (!hasBackendApi) {
    return getFallbackProducts(params);
  }

  const searchParams = buildSearchParams(params);

  try {
    const res = await fetch(`${API_BASE}/products?${searchParams.toString()}`, requestOptions);
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  } catch {
    return getFallbackProducts(params);
  }
}

export async function fetchBestsellers() {
  if (!hasBackendApi) {
    return getFallbackProducts({ bestseller: true, limit: 8 }).products;
  }

  try {
    const res = await fetch(`${API_BASE}/products/bestsellers`, requestOptions);
    if (!res.ok) throw new Error('Failed to fetch bestsellers');
    return await res.json();
  } catch {
    return getFallbackProducts({ bestseller: true, limit: 8 }).products;
  }
}

export async function fetchFeatured() {
  if (!hasBackendApi) {
    return getFallbackProducts({ featured: true, limit: 6 }).products;
  }

  try {
    const res = await fetch(`${API_BASE}/products/featured`, requestOptions);
    if (!res.ok) throw new Error('Failed to fetch featured');
    return await res.json();
  } catch {
    return getFallbackProducts({ featured: true, limit: 6 }).products;
  }
}

export async function fetchReviews() {
  if (!hasBackendApi) {
    return getFallbackReviews();
  }

  try {
    const res = await fetch(`${API_BASE}/reviews`, requestOptions);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return await res.json();
  } catch {
    return getFallbackReviews();
  }
}

export async function fetchProduct(identifier) {
  if (!hasBackendApi) {
    return getFallbackProduct(identifier);
  }

  try {
    const res = await fetch(`${API_BASE}/products/${identifier}`, requestOptions);
    if (!res.ok) throw new Error('Failed to fetch product');
    return await res.json();
  } catch {
    return getFallbackProduct(identifier);
  }
}

export async function createOrder(payload) {
  return createOrderWithAuth(payload);
}

export async function createOrderWithAuth(payload, token) {
  if (!hasBackendApi) {
    const user = findDemoUserByToken(token);
    return createDemoOrder({
      ...payload,
      user: user?._id || null,
    });
  }

  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: buildJsonHeaders(token),
      body: JSON.stringify(payload),
    });

    return await readJsonResponse(res, 'Failed to create order');
  } catch (error) {
    if (error instanceof TypeError) {
      const user = findDemoUserByToken(token);
      return createDemoOrder({
        ...payload,
        user: user?._id || null,
      });
    }

    throw error;
  }
}

export async function fetchOrder(id) {
  if (!hasBackendApi) {
    return readDemoOrders().find((order) => order._id === id || order.orderNumber === id) || null;
  }

  try {
    const res = await fetch(`${API_BASE}/orders/${id}`, requestOptions);
    if (!res.ok) throw new Error('Failed to fetch order');
    return await res.json();
  } catch {
    return readDemoOrders().find((order) => order._id === id || order.orderNumber === id) || null;
  }
}

export async function loginUser(credentials) {
  if (!hasBackendApi) {
    const email = normalizeEmail(credentials.email);
    const users = readDemoUsers();
    const user = users.find((entry) => entry.email === email);

    if (!user || user.password !== credentials.password) {
      throw new Error('Invalid email or password');
    }

    return buildDemoAuthResponse(user);
  }

  const response = await fetch(`${API_BASE}/users/login`, {
    method: 'POST',
    headers: buildJsonHeaders(),
    body: JSON.stringify(credentials),
  });

  return readJsonResponse(response, 'Unable to sign in');
}

export async function registerUser(payload) {
  if (!hasBackendApi) {
    const users = readDemoUsers();
    const email = normalizeEmail(payload.email);

    if (users.some((entry) => entry.email === email)) {
      throw new Error('User already exists');
    }

    if (String(payload.password || '').length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    const user = {
      _id: `demo-user-${Date.now()}`,
      name: String(payload.name || '').trim(),
      email,
      phone: String(payload.phone || '').trim(),
      password: String(payload.password || ''),
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.unshift(user);
    writeDemoUsers(users);
    return buildDemoAuthResponse(user);
  }

  const response = await fetch(`${API_BASE}/users/register`, {
    method: 'POST',
    headers: buildJsonHeaders(),
    body: JSON.stringify(payload),
  });

  return readJsonResponse(response, 'Unable to create account');
}

export async function fetchProfile(token) {
  if (!hasBackendApi) {
    const user = findDemoUserByToken(token);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role || 'user',
    };
  }

  const response = await fetch(`${API_BASE}/users/profile`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: 'no-store',
  });

  return readJsonResponse(response, 'Unable to load profile');
}

export async function updateProfile(token, payload) {
  if (!hasBackendApi) {
    const userId = decodeDemoToken(token);
    if (!userId) {
      throw new Error('Not authorized');
    }

    const users = readDemoUsers();
    const index = users.findIndex((entry) => entry._id === userId);
    if (index === -1) {
      throw new Error('User not found');
    }

    const nextEmail = normalizeEmail(payload.email || users[index].email);
    const duplicate = users.find((entry) => entry.email === nextEmail && entry._id !== userId);
    if (duplicate) {
      throw new Error('Email is already in use');
    }

    if (payload.password && String(payload.password).length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    const updatedUser = {
      ...users[index],
      name: payload.name || users[index].name,
      email: nextEmail,
      phone: payload.phone ?? users[index].phone,
      ...(payload.password ? { password: payload.password } : {}),
      updatedAt: new Date().toISOString(),
    };

    users[index] = updatedUser;
    writeDemoUsers(users);
    return buildDemoAuthResponse(updatedUser, token);
  }

  const response = await fetch(`${API_BASE}/users/profile`, {
    method: 'PUT',
    headers: buildJsonHeaders(token),
    body: JSON.stringify(payload),
  });

  return readJsonResponse(response, 'Unable to update profile');
}

export async function fetchMyOrders(token) {
  if (!hasBackendApi) {
    const user = findDemoUserByToken(token);
    if (!user) {
      throw new Error('Not authorized');
    }

    const email = normalizeEmail(user.email);
    return readDemoOrders()
      .filter(
        (order) =>
          String(order.user || '') === user._id ||
          normalizeEmail(order.customer?.email || '') === email
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const response = await fetch(`${API_BASE}/orders/myorders`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: 'no-store',
  });

  return readJsonResponse(response, 'Unable to load your orders');
}

export async function createRazorpayCheckout(payload, token) {
  if (!hasBackendApi) {
    throw new Error('Razorpay is disabled in client-only deployment mode');
  }

  const response = await fetch(`${API_BASE}/payments/razorpay/order`, {
    method: 'POST',
    headers: buildJsonHeaders(token),
    body: JSON.stringify(payload),
  });

  return readJsonResponse(response, 'Unable to start Razorpay checkout');
}

export async function verifyRazorpayPayment(payload) {
  if (!hasBackendApi) {
    throw new Error('Razorpay is disabled in client-only deployment mode');
  }

  const response = await fetch(`${API_BASE}/payments/razorpay/verify`, {
    method: 'POST',
    headers: buildJsonHeaders(),
    body: JSON.stringify(payload),
  });

  return readJsonResponse(response, 'Unable to verify Razorpay payment');
}
