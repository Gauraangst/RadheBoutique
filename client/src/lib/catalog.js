export const CATEGORY_LABELS = {
  'festive-kurtis': 'Festive Kurtis',
  'everyday-wear': 'Everyday Wear',
  'statement-jewellery': 'Statement Jewellery',
};

export const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Products' },
  { value: 'festive-kurtis', label: 'Festive Kurtis' },
  { value: 'everyday-wear', label: 'Everyday Wear' },
  { value: 'statement-jewellery', label: 'Statement Jewellery' },
];

export const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Top Rated' },
];

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function formatCategoryLabel(category) {
  return CATEGORY_LABELS[category] || 'Curated Collection';
}

export function getDiscountPercentage(product) {
  if (!product?.originalPrice || product.originalPrice <= product.price) {
    return 0;
  }

  return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
}

export function getPrimaryImage(product) {
  return product?.images?.[0] || '/images/products/kurti-1.png';
}

export function getSortParams(sortValue) {
  const [sort = 'createdAt', order = 'desc'] = String(sortValue || 'createdAt-desc').split('-');
  return { sort, order };
}

export function getCartItemId(productId, selectedSize, selectedColorName) {
  return [productId, selectedSize || 'default', selectedColorName || 'default'].join('::');
}

export function buildCartItem(product, options = {}) {
  const selectedColor = options.selectedColor || product.colors?.[0] || null;
  const selectedSize = options.selectedSize || product.sizes?.[0] || '';
  const qty = Math.max(1, Number(options.qty) || 1);
  const id = getCartItemId(product._id, selectedSize, selectedColor?.name);

  return {
    id,
    productId: product._id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: getPrimaryImage(product),
    qty,
    stock: product.stock || 0,
    material: product.material,
    category: product.category,
    selectedSize,
    selectedColor,
  };
}
