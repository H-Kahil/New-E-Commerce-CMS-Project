import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRtl } from "@/contexts/RtlContext";
import { products } from "@/services/supabase";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import CMSNavbar from "../components/CMSNavbar";

const ViewProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { language } = useRtl();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // In a real implementation, you would call the products.getProduct method
        // const { data, error } = await products.getProduct(id, language);

        // For now, we'll just simulate a successful fetch with mock data
        const mockProduct = {
          id,
          title: "Sample Product",
          slug: "sample-product",
          description:
            "This is a sample product description. It provides details about the product features, specifications, and benefits. This text would typically be much longer and more detailed in a real product.",
          price: 99.99,
          sku: "PROD-001",
          stock: 100,
          images: [
            {
              id: "img1",
              url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
              alt: "Product image",
            },
          ],
          categories: [{ id: "cat1", name: "Electronics" }],
          variants: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const data = mockProduct;
        const error = null;

        if (error) {
          console.error("Error fetching product:", error);
          throw new Error("Product not found");
        }
        if (!data) throw new Error("Product not found");

        setProduct(data);
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError(err.message || "Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, language]);

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

  if (error || !product) {
    return (
      <div>
        <CMSNavbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            {error || "Product not found"}
          </h1>
          <Button variant="outline" onClick={() => navigate("/cms/products")}>
            {t("common.backToProducts", "Back to Products")}
          </Button>
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
            {t("cms.products.viewProduct", "View Product")}: {product.title}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/cms/products")}>
              {t("common.back", "Back")}
            </Button>
            <Button
              onClick={() => navigate(`/cms/products/edit/${product.id}`)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              {t("common.edit", "Edit")}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              {product.images && product.images.length > 0 ? (
                <div>
                  <img
                    src={product.images[0].url}
                    alt={product.images[0].alt || product.title}
                    className="w-full h-auto rounded-lg mb-4"
                  />
                  <div className="flex gap-2 overflow-x-auto">
                    {product.images.map((image: any) => (
                      <img
                        key={image.id}
                        src={image.url}
                        alt={image.alt || product.title}
                        className="w-20 h-20 object-cover rounded border cursor-pointer"
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg flex items-center justify-center h-64">
                  <p className="text-gray-500">
                    {t("cms.products.noImage", "No image available")}
                  </p>
                </div>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
              <p className="text-gray-500 mb-4">SKU: {product.sku}</p>

              <div className="mb-4">
                <span className="text-2xl font-semibold">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              <div className="mb-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${product.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {product.stock > 0
                    ? t("cms.products.inStock", "In Stock")
                    : t("cms.products.outOfStock", "Out of Stock")}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  {product.stock} {t("cms.products.units", "units")}
                </span>
              </div>

              {product.categories && product.categories.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-700 mb-1">
                    {t("cms.products.categories", "Categories")}:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.categories.map((category: any) => (
                      <span
                        key={category.id}
                        className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">
                  {t("cms.products.description", "Description")}:
                </h3>
                <p className="text-gray-700">{product.description}</p>
              </div>
            </div>
          </div>
        </div>

        {product.variants && product.variants.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">
              {t("cms.products.variants", "Product Variants")}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left border-b">
                      {t("cms.products.variantName", "Variant")}
                    </th>
                    <th className="px-4 py-2 text-left border-b">
                      {t("cms.products.price", "Price")}
                    </th>
                    <th className="px-4 py-2 text-left border-b">
                      {t("cms.products.sku", "SKU")}
                    </th>
                    <th className="px-4 py-2 text-left border-b">
                      {t("cms.products.stock", "Stock")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((variant: any) => (
                    <tr key={variant.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 border-b">{variant.name}</td>
                      <td className="px-4 py-3 border-b">
                        ${variant.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 border-b">{variant.sku}</td>
                      <td className="px-4 py-3 border-b">{variant.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">
              {t("cms.products.variants", "Product Variants")}
            </h2>
            <div className="text-center py-8 bg-gray-50 rounded-md">
              <p className="text-gray-500">
                {t("cms.products.noVariants", "No variants added yet")}
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {t("cms.products.productDetails", "Product Details")}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">
                {t("cms.products.createdAt", "Created At")}:
              </p>
              <p>
                {new Date(product.created_at).toLocaleDateString()}{" "}
                {new Date(product.created_at).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                {t("cms.products.updatedAt", "Updated At")}:
              </p>
              <p>
                {new Date(product.updated_at).toLocaleDateString()}{" "}
                {new Date(product.updated_at).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                {t("cms.products.productId", "Product ID")}:
              </p>
              <p>{product.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                {t("cms.products.slug", "Slug")}:
              </p>
              <p>{product.slug}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
