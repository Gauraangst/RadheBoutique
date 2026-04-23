'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  createAdminProduct,
  deleteAdminProduct,
  fetchAdminDashboard,
  fetchAdminOrders,
  fetchAdminProducts,
  fetchAdminReviews,
  updateAdminOrderStatus,
  updateAdminProduct,
} from '@/lib/admin-api';
import { formatCurrency } from '@/lib/catalog';
import { useStore } from '@/components/store/StoreProvider';
import styles from './AdminPanel.module.css';

const ADMIN_TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'products', label: 'Products' },
  { key: 'orders', label: 'Orders' },
  { key: 'inventory', label: 'Inventory' },
  { key: 'reviews', label: 'Reviews' },
];

const EMPTY_PRODUCT_FORM = {
  name: '',
  slug: '',
  description: '',
  price: '',
  originalPrice: '',
  category: 'festive-kurtis',
  material: '',
  stock: '0',
  images: '/images/products/kurti-1.png',
  sizes: 'S, M, L, XL',
  tags: '',
  colors: 'Maroon|#8B1A2B',
  isFeatured: false,
  isBestseller: false,
  isNewArrival: true,
};

const ORDER_STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const parseList = (value) =>
  String(value || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

const parseColorLines = (value) =>
  String(value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name = '', hex = ''] = line.split('|').map((entry) => entry.trim());
      return { name, hex };
    })
    .filter((color) => color.name && color.hex);

const buildProductPayload = (formValues) => ({
  name: formValues.name,
  slug: formValues.slug,
  description: formValues.description,
  price: Number(formValues.price),
  originalPrice: formValues.originalPrice ? Number(formValues.originalPrice) : '',
  category: formValues.category,
  material: formValues.material,
  stock: Number(formValues.stock),
  images: parseList(formValues.images),
  sizes: parseList(formValues.sizes),
  tags: parseList(formValues.tags),
  colors: parseColorLines(formValues.colors),
  isFeatured: formValues.isFeatured,
  isBestseller: formValues.isBestseller,
  isNewArrival: formValues.isNewArrival,
});

const mapProductToForm = (product) => ({
  name: product.name || '',
  slug: product.slug || '',
  description: product.description || '',
  price: String(product.price ?? ''),
  originalPrice: product.originalPrice ? String(product.originalPrice) : '',
  category: product.category || 'festive-kurtis',
  material: product.material || '',
  stock: String(product.stock ?? 0),
  images: (product.images || []).join(', '),
  sizes: (product.sizes || []).join(', '),
  tags: (product.tags || []).join(', '),
  colors: (product.colors || []).map((color) => `${color.name}|${color.hex}`).join('\n'),
  isFeatured: Boolean(product.isFeatured),
  isBestseller: Boolean(product.isBestseller),
  isNewArrival: Boolean(product.isNewArrival),
});

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(value))
    : '—';

const statusTone = (status = '') => {
  switch (status) {
    case 'Delivered':
      return styles.statusSuccess;
    case 'Shipped':
      return styles.statusInfo;
    case 'Processing':
      return styles.statusWarning;
    default:
      return styles.statusNeutral;
  }
};

export default function AdminPanel() {
  const { authToken, authUser, isHydrated } = useStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboard, setDashboard] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT_FORM);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productSaving, setProductSaving] = useState(false);
  const [inventorySavingId, setInventorySavingId] = useState('');
  const [orderSavingId, setOrderSavingId] = useState('');

  const loadAdminData = async (token, productSearch = '') => {
    setLoading(true);
    setError('');

    try {
      const [dashboardResponse, productsResponse, ordersResponse, reviewsResponse] = await Promise.all([
        fetchAdminDashboard(token),
        fetchAdminProducts(token, productSearch),
        fetchAdminOrders(token),
        fetchAdminReviews(token),
      ]);

      setDashboard(dashboardResponse);
      setProducts(productsResponse);
      setOrders(ordersResponse);
      setReviews(reviewsResponse);
    } catch (loadError) {
      setError(loadError.message || 'Unable to load admin panel');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (authUser?.role === 'admin' && authToken) {
      loadAdminData(authToken);
      return;
    }

    setLoading(false);
  }, [authToken, authUser, isHydrated]);

  const resetProductEditor = () => {
    setEditingProductId(null);
    setProductForm(EMPTY_PRODUCT_FORM);
  };

  const handleProductFieldChange = (event) => {
    const { name, value, type, checked } = event.target;
    setProductForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    setProductSaving(true);
    setError('');

    try {
      const payload = buildProductPayload(productForm);

        if (editingProductId) {
        await updateAdminProduct(authToken, editingProductId, payload);
      } else {
        await createAdminProduct(authToken, payload);
      }

      resetProductEditor();
      await loadAdminData(authToken, search);
      setActiveTab('products');
    } catch (submitError) {
      setError(submitError.message || 'Unable to save product');
    } finally {
      setProductSaving(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product._id);
    setProductForm(mapProductToForm(product));
    setActiveTab('products');
  };

  const handleDeleteProduct = async (product) => {
    const confirmed = window.confirm(`Delete "${product.name}" from the catalog?`);
    if (!confirmed) {
      return;
    }

    setError('');

    try {
      await deleteAdminProduct(authToken, product._id);
      if (editingProductId === product._id) {
        resetProductEditor();
      }
      await loadAdminData(authToken, search);
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete product');
    }
  };

  const handleProductSearch = async (event) => {
    event.preventDefault();
    await loadAdminData(authToken, search);
    setActiveTab('products');
  };

  const handleOrderStatusChange = async (orderId, nextStatus) => {
    setOrderSavingId(orderId);
    setError('');

    try {
      await updateAdminOrderStatus(authToken, orderId, nextStatus);
      await loadAdminData(authToken, search);
    } catch (updateError) {
      setError(updateError.message || 'Unable to update order status');
    } finally {
      setOrderSavingId('');
    }
  };

  const handleInventoryUpdate = async (product, nextStock) => {
    setInventorySavingId(product._id);
    setError('');

    try {
      await updateAdminProduct(authToken, product._id, {
        ...product,
        stock: Number(nextStock),
      });
      await loadAdminData(authToken, search);
    } catch (inventoryError) {
      setError(inventoryError.message || 'Unable to update stock');
    } finally {
      setInventorySavingId('');
    }
  };

  const metrics = dashboard?.metrics || {
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    lowStockCount: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
  };

  if (!isHydrated) {
    return (
      <main className={styles.page}>
        <div className="container-wide">
          <section className={styles.loading}>Checking admin access...</section>
        </div>
      </main>
    );
  }

  if (!authUser) {
    return (
      <main className={styles.page}>
        <div className="container-wide">
          <section className={styles.accessCard}>
            <p className="section-subtitle">Owner Portal</p>
            <h1 className={styles.title}>Sign in to access the admin panel</h1>
            <p className={styles.description}>
              The catalog manager, order controls, and stock tools are now protected behind authentication.
            </p>
            <Link href="/auth?redirect=/admin" className="btn btn-primary">
              Sign in
            </Link>
          </section>
        </div>
      </main>
    );
  }

  if (authUser.role !== 'admin') {
    return (
      <main className={styles.page}>
        <div className="container-wide">
          <section className={styles.accessCard}>
            <p className="section-subtitle">Access Restricted</p>
            <h1 className={styles.title}>This account does not have admin access</h1>
            <p className={styles.description}>
              Sign in with your owner account to manage products, orders, stock, and reviews.
            </p>
            <Link href="/account" className="btn btn-outline">
              Go to account
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className="container-wide">
        <header className={styles.header}>
          <div>
            <p className="section-subtitle">Owner Portal</p>
            <h1 className={styles.title}>Radhe Boutique Admin</h1>
            <p className={styles.description}>
              Manage your catalog, watch incoming orders, adjust stock, and review store health
              from one workspace.
            </p>
          </div>

          <div className={styles.headerNote}>
            <strong>Sync mode</strong>
            <span>
              Uses live backend API data when configured. In client-only deployment mode, admin
              tools stay read-locked until a backend URL is connected.
            </span>
          </div>
        </header>

        <nav className={styles.tabs}>
          {ADMIN_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {error ? <div className={styles.errorBanner}>{error}</div> : null}

        {loading ? (
          <section className={styles.loading}>Loading admin workspace...</section>
        ) : (
          <>
            {activeTab === 'overview' ? (
              <section className={styles.overview}>
                <div className={styles.metricsGrid}>
                  <article className={styles.metricCard}>
                    <span className={styles.metricLabel}>Products</span>
                    <strong>{metrics.totalProducts}</strong>
                    <p>Active catalog items currently listed in the store.</p>
                  </article>
                  <article className={styles.metricCard}>
                    <span className={styles.metricLabel}>Orders</span>
                    <strong>{metrics.totalOrders}</strong>
                    <p>Total orders received through the storefront.</p>
                  </article>
                  <article className={styles.metricCard}>
                    <span className={styles.metricLabel}>Pending</span>
                    <strong>{metrics.pendingOrders}</strong>
                    <p>Orders that still need fulfillment attention.</p>
                  </article>
                  <article className={styles.metricCard}>
                    <span className={styles.metricLabel}>Low Stock</span>
                    <strong>{metrics.lowStockCount}</strong>
                    <p>Products at or below 10 units available.</p>
                  </article>
                  <article className={styles.metricCard}>
                    <span className={styles.metricLabel}>Revenue</span>
                    <strong>{formatCurrency(metrics.totalRevenue)}</strong>
                    <p>Total value of current orders in the system.</p>
                  </article>
                  <article className={styles.metricCard}>
                    <span className={styles.metricLabel}>Average Order</span>
                    <strong>{formatCurrency(metrics.averageOrderValue)}</strong>
                    <p>Average order value across all received orders.</p>
                  </article>
                </div>

                <div className={styles.splitGrid}>
                  <section className={styles.panel}>
                    <div className={styles.panelHeader}>
                      <h2>Recent Orders</h2>
                    </div>
                    <div className={styles.list}>
                      {(dashboard?.recentOrders || []).map((order) => (
                        <article key={order._id || order.orderNumber} className={styles.listCard}>
                          <div>
                            <strong>{order.orderNumber || order._id}</strong>
                            <p>{order.customer?.name || 'Guest customer'}</p>
                          </div>
                          <div className={styles.listMeta}>
                            <span className={`${styles.statusPill} ${statusTone(order.status)}`}>
                              {order.status}
                            </span>
                            <strong>{formatCurrency(order.totalPrice)}</strong>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>

                  <section className={styles.panel}>
                    <div className={styles.panelHeader}>
                      <h2>Low Stock Alerts</h2>
                    </div>
                    <div className={styles.list}>
                      {(dashboard?.lowStockProducts || []).map((product) => (
                        <article key={product._id} className={styles.listCard}>
                          <div>
                            <strong>{product.name}</strong>
                            <p>{product.category}</p>
                          </div>
                          <div className={styles.listMeta}>
                            <span className={styles.stockPill}>{product.stock} left</span>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                </div>
              </section>
            ) : null}

            {activeTab === 'products' ? (
              <section className={styles.productsWorkspace}>
                <div className={styles.productsPanel}>
                  <div className={styles.panelHeader}>
                    <h2>Catalog</h2>
                    <button type="button" className="btn btn-outline" onClick={resetProductEditor}>
                      New product
                    </button>
                  </div>

                  <form className={styles.searchBar} onSubmit={handleProductSearch}>
                    <input
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search products, tags, or materials"
                    />
                    <button type="submit" className="btn btn-primary btn-sm">
                      Search
                    </button>
                  </form>

                  <div className={styles.productList}>
                    {products.map((product) => (
                      <article key={product._id} className={styles.productCard}>
                        <div>
                          <div className={styles.productHeader}>
                            <strong>{product.name}</strong>
                            <span className={`${styles.statusPill} ${statusTone(product.stock > 10 ? 'Delivered' : 'Pending')}`}>
                              {product.stock > 10 ? 'Healthy' : 'Low stock'}
                            </span>
                          </div>
                          <p className={styles.productMeta}>
                            {product.category} • {formatCurrency(product.price)} • {product.stock} in stock
                          </p>
                          <p className={styles.slug}>{product.slug}</p>
                        </div>

                        <div className={styles.rowActions}>
                          <button type="button" onClick={() => handleEditProduct(product)}>
                            Edit
                          </button>
                          <button type="button" onClick={() => handleDeleteProduct(product)}>
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                <aside className={styles.editorPanel}>
                  <div className={styles.panelHeader}>
                    <h2>{editingProductId ? 'Edit Product' : 'Add Product'}</h2>
                    {editingProductId ? (
                      <button type="button" className={styles.linkButton} onClick={resetProductEditor}>
                        Cancel edit
                      </button>
                    ) : null}
                  </div>

                  <form className={styles.productForm} onSubmit={handleProductSubmit}>
                    <div className={styles.formGrid}>
                      <label className={styles.field}>
                        Product name
                        <input name="name" value={productForm.name} onChange={handleProductFieldChange} required />
                      </label>
                      <label className={styles.field}>
                        Slug
                        <input
                          name="slug"
                          value={productForm.slug}
                          onChange={handleProductFieldChange}
                          placeholder="Optional, auto-generated if blank"
                        />
                      </label>
                      <label className={`${styles.field} ${styles.fieldFull}`}>
                        Description
                        <textarea
                          name="description"
                          rows="4"
                          value={productForm.description}
                          onChange={handleProductFieldChange}
                          required
                        />
                      </label>
                      <label className={styles.field}>
                        Price
                        <input name="price" type="number" value={productForm.price} onChange={handleProductFieldChange} required />
                      </label>
                      <label className={styles.field}>
                        Original price
                        <input name="originalPrice" type="number" value={productForm.originalPrice} onChange={handleProductFieldChange} />
                      </label>
                      <label className={styles.field}>
                        Category
                        <select name="category" value={productForm.category} onChange={handleProductFieldChange}>
                          <option value="festive-kurtis">Festive Kurtis</option>
                          <option value="everyday-wear">Everyday Wear</option>
                          <option value="statement-jewellery">Statement Jewellery</option>
                        </select>
                      </label>
                      <label className={styles.field}>
                        Material
                        <input name="material" value={productForm.material} onChange={handleProductFieldChange} />
                      </label>
                      <label className={styles.field}>
                        Stock
                        <input name="stock" type="number" value={productForm.stock} onChange={handleProductFieldChange} />
                      </label>
                      <label className={`${styles.field} ${styles.fieldFull}`}>
                        Image paths
                        <textarea
                          name="images"
                          rows="2"
                          value={productForm.images}
                          onChange={handleProductFieldChange}
                          placeholder="/images/products/kurti-1.png, /images/products/kurti-2.png"
                        />
                      </label>
                      <label className={styles.field}>
                        Sizes
                        <input
                          name="sizes"
                          value={productForm.sizes}
                          onChange={handleProductFieldChange}
                          placeholder="S, M, L, XL"
                        />
                      </label>
                      <label className={styles.field}>
                        Tags
                        <input
                          name="tags"
                          value={productForm.tags}
                          onChange={handleProductFieldChange}
                          placeholder="festive, embroidery, wedding"
                        />
                      </label>
                      <label className={`${styles.field} ${styles.fieldFull}`}>
                        Colours
                        <textarea
                          name="colors"
                          rows="3"
                          value={productForm.colors}
                          onChange={handleProductFieldChange}
                          placeholder={'Maroon|#8B1A2B\nIvory|#FAF8F5'}
                        />
                      </label>
                    </div>

                    <div className={styles.checkboxRow}>
                      <label><input type="checkbox" name="isFeatured" checked={productForm.isFeatured} onChange={handleProductFieldChange} /> Featured</label>
                      <label><input type="checkbox" name="isBestseller" checked={productForm.isBestseller} onChange={handleProductFieldChange} /> Bestseller</label>
                      <label><input type="checkbox" name="isNewArrival" checked={productForm.isNewArrival} onChange={handleProductFieldChange} /> New arrival</label>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={productSaving}>
                      {productSaving ? 'Saving...' : editingProductId ? 'Update product' : 'Create product'}
                    </button>
                  </form>
                </aside>
              </section>
            ) : null}

            {activeTab === 'orders' ? (
              <section className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h2>Incoming Orders</h2>
                </div>
                <div className={styles.orderList}>
                  {orders.map((order) => (
                    <article key={order._id || order.orderNumber} className={styles.orderCard}>
                      <div className={styles.orderTop}>
                        <div>
                          <strong>{order.orderNumber || order._id}</strong>
                          <p>{order.customer?.name} • {order.customer?.email}</p>
                        </div>
                        <div className={styles.listMeta}>
                          <span className={`${styles.statusPill} ${statusTone(order.status)}`}>{order.status}</span>
                          <strong>{formatCurrency(order.totalPrice)}</strong>
                        </div>
                      </div>

                      <div className={styles.orderMetaGrid}>
                        <div>
                          <span className={styles.metaLabel}>Created</span>
                          <p>{formatDate(order.createdAt)}</p>
                        </div>
                        <div>
                          <span className={styles.metaLabel}>Payment</span>
                          <p>{order.paymentMethod} • {order.paymentStatus}</p>
                        </div>
                        <div>
                          <span className={styles.metaLabel}>Items</span>
                          <p>{order.orderItems?.length || 0}</p>
                        </div>
                      </div>

                      <div className={styles.orderFooter}>
                        <div>
                          <span className={styles.metaLabel}>Shipping</span>
                          <p>
                            {order.shippingAddress?.address}, {order.shippingAddress?.city}
                          </p>
                        </div>

                        <label className={styles.statusSelectWrap}>
                          <span className={styles.metaLabel}>Update status</span>
                          <select
                            value={order.status}
                            onChange={(event) => handleOrderStatusChange(order._id || order.orderNumber, event.target.value)}
                            disabled={orderSavingId === (order._id || order.orderNumber)}
                          >
                            {ORDER_STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {activeTab === 'inventory' ? (
              <section className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h2>Inventory Control</h2>
                </div>
                <div className={styles.inventoryTable}>
                  {products
                    .slice()
                    .sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0))
                    .map((product) => (
                      <article key={`${product._id}-${product.stock}`} className={styles.inventoryRow}>
                        <div>
                          <strong>{product.name}</strong>
                          <p>{product.category}</p>
                        </div>
                        <div className={styles.inventoryControls}>
                          <input
                            type="number"
                            defaultValue={product.stock}
                            min="0"
                            className={styles.inventoryInput}
                            onBlur={(event) => {
                              if (Number(event.target.value) !== Number(product.stock)) {
                                handleInventoryUpdate(product, event.target.value);
                              }
                            }}
                          />
                          <span className={`${styles.statusPill} ${statusTone(product.stock > 10 ? 'Delivered' : 'Pending')}`}>
                            {inventorySavingId === product._id ? 'Saving...' : product.stock > 10 ? 'Healthy' : 'Restock soon'}
                          </span>
                        </div>
                      </article>
                    ))}
                </div>
              </section>
            ) : null}

            {activeTab === 'reviews' ? (
              <section className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h2>Customer Reviews</h2>
                </div>
                <div className={styles.reviewGrid}>
                  {reviews.map((review) => (
                    <article key={review._id} className={styles.reviewCard}>
                      <div className={styles.reviewHeader}>
                        <strong>{review.customerName}</strong>
                        <span>{'★'.repeat(review.rating)}</span>
                      </div>
                      <p className={styles.reviewTitle}>{review.title || 'Customer feedback'}</p>
                      <p className={styles.reviewText}>{review.text}</p>
                      <p className={styles.reviewMeta}>
                        {review.location || 'India'}
                        {review.productId?.name ? ` • ${review.productId.name}` : ''}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </>
        )}
      </div>
    </main>
  );
}
