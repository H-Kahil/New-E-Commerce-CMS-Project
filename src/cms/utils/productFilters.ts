import { ProductFilters } from "../components/ProductFilters";

export const applyProductFilters = (
  products: any[],
  filters: ProductFilters,
) => {
  if (!products) return [];

  return products.filter((product) => {
    // Search filter
    if (filters.search && !matchesSearch(product, filters.search)) {
      return false;
    }

    // Category filter
    if (
      filters.category &&
      filters.category !== "all" &&
      !matchesCategory(product, filters.category)
    ) {
      return false;
    }

    // Stock status filter
    if (
      filters.stockStatus &&
      filters.stockStatus !== "all" &&
      !matchesStockStatus(product, filters.stockStatus)
    ) {
      return false;
    }

    // Price range filter
    if (
      filters.priceRange &&
      filters.priceRange !== "all" &&
      !matchesPriceRange(product, filters.priceRange)
    ) {
      return false;
    }

    return true;
  });
};

const matchesSearch = (product: any, search: string) => {
  const searchLower = search.toLowerCase();
  return (
    (product.title && product.title.toLowerCase().includes(searchLower)) ||
    (product.description &&
      product.description.toLowerCase().includes(searchLower)) ||
    (product.sku && product.sku.toLowerCase().includes(searchLower))
  );
};

const matchesCategory = (product: any, categoryId: string) => {
  if (!product.categories || !product.product_categories) return false;

  // Check in product_categories relationship
  if (product.product_categories && product.product_categories.length > 0) {
    return product.product_categories.some(
      (pc: any) => pc.category_id === categoryId,
    );
  }

  // Check in categories array if available
  if (product.categories && product.categories.length > 0) {
    return product.categories.some(
      (category: any) => category.id === categoryId,
    );
  }

  return false;
};

const matchesStockStatus = (product: any, stockStatus: string) => {
  const stock = product.stock || 0;

  switch (stockStatus) {
    case "instock":
      return stock > 10;
    case "lowstock":
      return stock > 0 && stock <= 10;
    case "outofstock":
      return stock <= 0;
    default:
      return true;
  }
};

const matchesPriceRange = (product: any, priceRange: string) => {
  const price = product.price || 0;

  switch (priceRange) {
    case "under25":
      return price < 25;
    case "25to50":
      return price >= 25 && price <= 50;
    case "50to100":
      return price > 50 && price <= 100;
    case "over100":
      return price > 100;
    default:
      return true;
  }
};
