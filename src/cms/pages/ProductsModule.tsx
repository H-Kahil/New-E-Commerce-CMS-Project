import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRtl } from "@/contexts/RtlContext";
import { products } from "@/services/supabase";
import { Button } from "@/components/ui/button";
import { Pencil, Eye, Trash2, Plus } from "lucide-react";
import CMSNavbar from "../components/CMSNavbar";

const ProductsModule: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useRtl();
  const navigate = useNavigate();
  const [productsList, setProductsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // In a real implementation, you would call the products.getProducts method
        // const { data, error } = await products.getProducts(language);

        // For now, we'll just simulate a successful fetch with mock data
        const mockProducts = [
          {
            id: "1",
            title: "Smartphone X",
            slug: "smartphone-x",
            price: 799.99,
            sku: "PHONE-001",
            stock: 45,
            updated_at: new Date().toISOString(),
          },
          {
            id: "2",
            title: "Laptop Pro",
            slug: "laptop-pro",
            price: 1299.99,
            sku: "LAPTOP-001",
            stock: 20,
            updated_at: new Date().toISOString(),
          },
          {
            id: "3",
            title: "Wireless Headphones",
            slug: "wireless-headphones",
            price: 149.99,
            sku: "AUDIO-001",
            stock: 78,
            updated_at: new Date().toISOString(),
          },
          {
            id: "4",
            title: "Smart Watch",
            slug: "smart-watch",
            price: 249.99,
            sku: "WATCH-001",
            stock: 32,
            updated_at: new Date().toISOString(),
          },
          {
            id: "5",
            title: "Bluetooth Speaker",
            slug: "bluetooth-speaker",
            price: 89.99,
            sku: "AUDIO-002",
            stock: 54,
            updated_at: new Date().toISOString(),
          },
        ];

        const data = mockProducts;
        const fetchError = null;

        if (fetchError) throw new Error(fetchError.message);
        setProductsList(data || []);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [language]);

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      // This function might not be implemented yet, so we'll just simulate success for now
      // const { error } = await products.deleteProduct(id, language);
      const error = null;
      if (error) throw new Error(error.message);

      // Remove the deleted product from the state
      setProductsList(productsList.filter((product) => product.id !== id));
      alert("Product deleted successfully");
    } catch (err: any) {
      console.error("Error deleting product:", err);
      alert(`Failed to delete product: ${err.message}`);
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
          <Button onClick={() => navigate("/cms/products/create")}>
            <Plus className="mr-2 h-4 w-4" />
            {t("cms.products.createNew", "Create New Product")}
          </Button>
        </div>

        {productsList.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">
              {t("cms.products.noProducts", "No products found")}
            </p>
            <Button onClick={() => navigate("/cms/products/create")}>
              <Plus className="mr-2 h-4 w-4" />
              {t("cms.products.createFirst", "Create your first product")}
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left border-b">
                    {t("cms.products.titleColumn", "Title")}
                  </th>
                  <th className="px-4 py-2 text-left border-b">
                    {t("cms.products.slugColumn", "Slug")}
                  </th>
                  <th className="px-4 py-2 text-left border-b">
                    {t("cms.products.priceColumn", "Price")}
                  </th>
                  <th className="px-4 py-2 text-left border-b">
                    {t("cms.products.stockColumn", "Stock")}
                  </th>
                  <th className="px-4 py-2 text-left border-b">
                    {t("cms.products.updatedAtColumn", "Updated At")}
                  </th>
                  <th className="px-4 py-2 text-center border-b">
                    {t("cms.products.actionsColumn", "Actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {productsList.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b">{product.title}</td>
                    <td className="px-4 py-3 border-b">/{product.slug}</td>
                    <td className="px-4 py-3 border-b">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 border-b">{product.stock}</td>
                    <td className="px-4 py-3 border-b">
                      {new Date(product.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 border-b">
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(`/cms/products/view/${product.id}`)
                          }
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(`/cms/products/edit/${product.id}`)
                          }
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsModule;
