const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
const hasBackendApi = Boolean(process.env.NEXT_PUBLIC_API_URL);

const withAuth = (token, extraHeaders = {}) => ({
  ...extraHeaders,
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

async function handleJsonResponse(response, fallbackMessage) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || fallbackMessage);
  }

  return response.json();
}

function ensureBackendApi() {
  if (!hasBackendApi) {
    throw new Error('Admin tools are unavailable in client-only deployment mode');
  }
}

export async function fetchAdminDashboard(token) {
  ensureBackendApi();
  const response = await fetch(`${API_BASE}/admin/dashboard`, {
    cache: 'no-store',
    headers: withAuth(token),
  });
  return handleJsonResponse(response, 'Unable to load dashboard');
}

export async function fetchAdminProducts(token, search = '') {
  ensureBackendApi();
  const params = new URLSearchParams();
  if (search) {
    params.set('search', search);
  }

  const query = params.toString();
  const response = await fetch(`${API_BASE}/admin/products${query ? `?${query}` : ''}`, {
    cache: 'no-store',
    headers: withAuth(token),
  });
  return handleJsonResponse(response, 'Unable to load products');
}

export async function createAdminProduct(token, payload) {
  ensureBackendApi();
  const response = await fetch(`${API_BASE}/admin/products`, {
    method: 'POST',
    headers: withAuth(token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });

  return handleJsonResponse(response, 'Unable to create product');
}

export async function updateAdminProduct(token, id, payload) {
  ensureBackendApi();
  const response = await fetch(`${API_BASE}/admin/products/${id}`, {
    method: 'PUT',
    headers: withAuth(token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });

  return handleJsonResponse(response, 'Unable to update product');
}

export async function deleteAdminProduct(token, id) {
  ensureBackendApi();
  const response = await fetch(`${API_BASE}/admin/products/${id}`, {
    method: 'DELETE',
    headers: withAuth(token),
  });

  return handleJsonResponse(response, 'Unable to delete product');
}

export async function fetchAdminOrders(token) {
  ensureBackendApi();
  const response = await fetch(`${API_BASE}/admin/orders`, {
    cache: 'no-store',
    headers: withAuth(token),
  });
  return handleJsonResponse(response, 'Unable to load orders');
}

export async function updateAdminOrderStatus(token, id, status) {
  ensureBackendApi();
  const response = await fetch(`${API_BASE}/admin/orders/${id}/status`, {
    method: 'PUT',
    headers: withAuth(token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ status }),
  });

  return handleJsonResponse(response, 'Unable to update order');
}

export async function fetchAdminReviews(token) {
  ensureBackendApi();
  const response = await fetch(`${API_BASE}/admin/reviews`, {
    cache: 'no-store',
    headers: withAuth(token),
  });
  return handleJsonResponse(response, 'Unable to load reviews');
}
