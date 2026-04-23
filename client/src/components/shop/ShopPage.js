'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ProductCard from '@/components/shop/ProductCard';
import { fetchProducts } from '@/lib/api';
import { CATEGORY_OPTIONS, SORT_OPTIONS, getSortParams } from '@/lib/catalog';
import styles from './ShopPage.module.css';

const DEFAULT_PAGINATION = {
  page: 1,
  pages: 1,
  total: 0,
  limit: 12,
};

export default function ShopPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [catalog, setCatalog] = useState({ products: [], pagination: DEFAULT_PAGINATION });
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');

  const activeCategory = searchParams.get('category') || 'all';
  const activeSort = `${searchParams.get('sort') || 'createdAt'}-${searchParams.get('order') || 'desc'}`;
  const activeSearch = searchParams.get('search') || '';
  const activePage = Number(searchParams.get('page') || 1);

  useEffect(() => {
    setSearchValue(activeSearch);
  }, [activeSearch]);

  useEffect(() => {
    let ignore = false;

    async function loadCatalog() {
      setLoading(true);
      const { sort, order } = getSortParams(activeSort);
      const response = await fetchProducts({
        page: activePage,
        limit: 12,
        sort,
        order,
        category: activeCategory === 'all' ? undefined : activeCategory,
        search: activeSearch || undefined,
      });

      if (!ignore) {
        setCatalog({
          products: response.products || [],
          pagination: response.pagination || DEFAULT_PAGINATION,
        });
        setLoading(false);
      }
    }

    loadCatalog();

    return () => {
      ignore = true;
    };
  }, [activeCategory, activePage, activeSearch, activeSort]);

  const updateParams = (updates, resetPage = false) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'all') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    if (resetPage) {
      params.delete('page');
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    updateParams({ search: searchValue.trim() }, true);
  };

  const setPage = (page) => {
    updateParams({ page }, false);
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroInner}>
            <div>
              <p className="section-subtitle">Online Store</p>
              <h1 className={styles.title}>Shop the full Radhe Boutique collection</h1>
              <p className={styles.description}>
                Browse festive kurtis, everyday essentials, and statement jewellery with
                live cart and checkout flows.
              </p>
            </div>

            <form className={styles.searchForm} onSubmit={handleSearch}>
              <input
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search kurtis, jewellery, fabrics..."
                className={styles.searchInput}
              />
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.toolbar}>
            <div className={styles.categoryRow}>
              {CATEGORY_OPTIONS.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  className={`${styles.categoryButton} ${
                    activeCategory === category.value ? styles.categoryButtonActive : ''
                  }`}
                  onClick={() =>
                    updateParams(
                      { category: category.value === 'all' ? '' : category.value },
                      true
                    )
                  }
                >
                  {category.label}
                </button>
              ))}
            </div>

            <div className={styles.sortWrap}>
              <label htmlFor="sort" className={styles.sortLabel}>
                Sort by
              </label>
              <select
                id="sort"
                className={styles.sortSelect}
                value={activeSort}
                onChange={(event) => {
                  const [sort, order] = event.target.value.split('-');
                  updateParams({ sort, order }, true);
                }}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.resultsHeader}>
            <p>
              {loading
                ? 'Loading products...'
                : `${catalog.pagination.total} product${catalog.pagination.total === 1 ? '' : 's'} found`}
            </p>
            {activeSearch ? (
              <button
                type="button"
                className={styles.clearSearch}
                onClick={() => updateParams({ search: '' }, true)}
              >
                Clear search
              </button>
            ) : null}
          </div>

          {loading ? (
            <div className={styles.loadingGrid}>
              {[...Array(8)].map((_, index) => (
                <div key={index} className={styles.skeletonCard} />
              ))}
            </div>
          ) : catalog.products.length > 0 ? (
            <>
              <div className={styles.grid}>
                {catalog.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {catalog.pagination.pages > 1 ? (
                <div className={styles.pagination}>
                  <button
                    type="button"
                    className={styles.pageButton}
                    onClick={() => setPage(activePage - 1)}
                    disabled={activePage <= 1}
                  >
                    Previous
                  </button>

                  <span className={styles.pageStatus}>
                    Page {catalog.pagination.page} of {catalog.pagination.pages}
                  </span>

                  <button
                    type="button"
                    className={styles.pageButton}
                    onClick={() => setPage(activePage + 1)}
                    disabled={activePage >= catalog.pagination.pages}
                  >
                    Next
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <div className={styles.emptyState}>
              <h2>No products matched your filters</h2>
              <p>Try switching category or removing the current search term.</p>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => router.push('/shop')}
              >
                View all products
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
