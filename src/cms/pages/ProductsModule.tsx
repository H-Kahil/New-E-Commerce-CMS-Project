import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRtl } from "@/contexts/RtlContext";
import { products } from "@/services/supabase";
import { Button } from "@/components/ui/button";
import { Pencil, Eye, Trash2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CMSNavbar from "../components/CMSNavbar";
import ProductFilters, {
  ProductFilters as ProductFiltersType,
} from "../components/ProductFilters";
import { applyProductFilters } from "../utils/productFilters";

const ProductsModule: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useRtl();
  const navigate = useNavigate();
  const [productsList, setProductsList] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFiltersType>({
    search: "",
    category: "all",
    stockStatus: "all",
    priceRange: "all",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch products
        const { data, error } = await products.getProducts({
          locale: language,
        });

        if (error) throw new Error(error.message);
        setProductsList(data || []);
        setFilteredProducts(data || []);

        // Fetch categories for filters
        const { data: categoriesData, error: categoriesError } =
          await products.getCategories(language);
        if (categoriesError) throw new Error(categoriesError.message);
        setCategories(categoriesData || []);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  // Apply filters when they change or when products list changes
  useEffect(() => {
    const filtered = applyProductFilters(productsList, filters);
    setFilteredProducts(filtered);
  }, [filters, productsList]);

  const handleFilterChange = (newFilters: ProductFiltersType) => {
    setFilters(newFilters);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await products.deleteProduct(id, language);
      if (error) throw new Error(error.message);

      // Remove the deleted product from the state
      setProductsList(productsList.filter((product) => product.id !== id));
      alert("Product deleted successfully");
    } catch (err: any) {
      console.error("Error deleting product:", err);
      alert(`Failed to delete product: ${err.message}`);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock > 10) {
      return <Badge className="bg-blue-500">In Stock</Badge>;
    } else if (stock > 0) {
      return <Badge className="bg-yellow-500">Low Stock</Badge>;
    } else {
      return <Badge className="bg-red-500">Out of Stock</Badge>;
    }
  };

  if (loading) {
    return (
      <div>
        <CMSNavbar />
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded my-6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <CMSNavbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">{error}</h1>
        </div>
      </div>
    );
  }

  return (
    <div>
      <CMSNavbar />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {t("cms.products.title", "Products")}
          </h2>
          <Button onClick={() => navigate("/cms/products/wizard")}>
            <Plus className="mr-2 h-4 w-4" />
            {t("cms.products.createNew", "Create New Product")}
          </Button>
        </div>

        <ProductFilters
          onFilterChange={handleFilterChange}
          categories={categories}
        />

        {productsList.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">
              {t("cms.products.noProducts", "No products found")}
            </p>
            <Button onClick={() => navigate("/cms/products/wizard")}>
              <Plus className="mr-2 h-4 w-4" />
              {t("cms.products.createFirst", "Create your first product")}
            </Button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">
              {t(
                "cms.products.noFilteredProducts",
                "No products match your filters",
              )}
            </p>
            <Button
              variant="outline"
              onClick={() =>
                setFilters({
                  search: "",
                  category: "all",
                  stockStatus: "all",
                  priceRange: "all",
                })
              }
            >
              {t("cms.products.clearFilters", "Clear Filters")}
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left border-b">
                    {t("cms.products.imageColumn", "Image")}
                  </th>
                  <th className="px-4 py-2 text-left border-b">
                    {t("cms.products.skuColumn", "SKU")}
                  </th>
                  <th className="px-4 py-2 text-left border-b">
                    {t("cms.products.nameColumn", "Name")}
                  </th>
                  <th className="px-4 py-2 text-left border-b">
                    {t("cms.products.categoryColumn", "Category")}
                  </th>
                  <th className="px-4 py-2 text-left border-b">
                    {t("cms.products.subCategoryColumn", "Sub Category")}
                  </th>
                  <th className="px-4 py-2 text-left border-b">
                    {t("cms.products.costColumn", "Cost ($)")}
                  </th>
                  <th className="px-4 py-2 text-left border-b">
                    {t("cms.products.priceColumn", "Price ($)")}
                  </th>
                  <th className="px-4 py-2 text-center border-b">
                    {t("cms.products.actionsColumn", "Actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  // Get the main product image (position 0) or use a placeholder
                  let productImage =
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
                    product.id;

                  if (
                    product.product_images &&
                    product.product_images.length > 0
                  ) {
                    // Sort by position to ensure we get the main image (position 0)
                    const sortedImages = [...product.product_images].sort(
                      (a, b) => a.position - b.position,
                    );
                    productImage = sortedImages[0].url;
                  }

                  // Get cost from compare_at_price or use a default
                  const cost =
                    product.compare_at_price ||
                    (product.price * 0.7).toFixed(2);

                  // Get category and subcategory
                  const category =
                    product.categories && product.categories.length > 0
                      ? product.categories[0].name
                      : "Uncategorized";

                  const subCategory =
                    product.categories && product.categories.length > 1
                      ? product.categories[1].name
                      : "General";

                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 border-b">
                        <img
                          src={productImage}
                          alt={product.title}
                          className="w-10 h-10 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-3 border-b">
                        {product.sku || `PRD-${product.id.substring(0, 3)}`}
                      </td>
                      <td className="px-4 py-3 border-b">{product.title}</td>
                      <td className="px-4 py-3 border-b">{category}</td>
                      <td className="px-4 py-3 border-b">{subCategory}</td>
                      <td className="px-4 py-3 border-b">${cost}</td>
                      <td className="px-4 py-3 border-b">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 border-b">
                        <div className="flex justify-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              navigate(`/cms/products/view/${product.id}`)
                            }
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              navigate(`/cms/products/edit/${product.id}`)
                            }
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsModule;
