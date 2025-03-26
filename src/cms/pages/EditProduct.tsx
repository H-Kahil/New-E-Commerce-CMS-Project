import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRtl } from "@/contexts/RtlContext";
import { products } from "@/services/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import CMSNavbar from "../components/CMSNavbar";

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { language } = useRtl();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0.00");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState("0");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const { data, error } = await products.getProduct(id, language);

        if (error) {
          console.error("Error fetching product:", error);
          throw new Error("Product not found");
        }
        if (!data) throw new Error("Product not found");

        setProduct(data);
        setTitle(data.title || "");
        setSlug(data.slug || "");
        setDescription(data.description || "");
        setPrice((data.price || 0).toString());
        setSku(data.sku || "");
        setStock((data.stock || 0).toString());
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError(err.message || "Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, language]);

  const handleSave = async () => {
    if (!title) {
      alert("Title is required");
      return;
    }

    setSaving(true);
    try {
      // Generate a slug if not provided
      const finalSlug =
        slug ||
        title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");

      // Call the actual product update API
      const { data, error } = await products.updateProduct(
        id || "",
        {
          title,
          slug: finalSlug,
          description,
          price: parseFloat(price),
          sku,
          stock: parseInt(stock, 10),
          // Keep existing categories and images
          categories: product?.categories?.map((cat: any) => cat.id) || [],
          images: product?.product_images || [],
        },
        language,
      );

      if (error) {
        console.error("Error updating product:", error);
        alert(`Failed to update product: ${error.message}`);
        return;
      }

      alert("Product updated successfully!");
      // Redirect to the products list
      navigate("/cms/products");
    } catch (err: any) {
      console.error("Error updating product:", err);
      alert(`An error occurred: ${err.message}`);
    } finally {
      setSaving(false);
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
            {t("cms.products.editProduct", "Edit Product")}: {product.title}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/cms/products")}>
              {t("common.cancel", "Cancel")}
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving
                ? t("common.saving", "Saving...")
                : t("common.save", "Save")}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="productTitle"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("cms.products.productTitle", "Product Title")}
              </Label>
              <Input
                type="text"
                id="productTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label
                htmlFor="productSlug"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("cms.products.productSlug", "Product Slug")}
              </Label>
              <Input
                type="text"
                id="productSlug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label
                  htmlFor="productPrice"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("cms.products.price", "Price")}
                </Label>
                <Input
                  type="number"
                  id="productPrice"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full"
                  step="0.01"
                  min="0"
                />
              </div>
              <div>
                <Label
                  htmlFor="productSku"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("cms.products.sku", "SKU")}
                </Label>
                <Input
                  type="text"
                  id="productSku"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Label
                  htmlFor="productStock"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("cms.products.stock", "Stock")}
                </Label>
                <Input
                  type="number"
                  id="productStock"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full"
                  min="0"
                  step="1"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <Label
            htmlFor="productDescription"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            {t("cms.products.description", "Product Description")}
          </Label>
          <Textarea
            id="productDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-64"
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {t("cms.products.images", "Product Images")}
          </h2>
          <div className="text-center py-8 bg-gray-50 rounded-md">
            <p className="text-gray-500">
              {t("cms.products.noImages", "No images added yet")}
            </p>
            <Button className="mt-4">
              {t("cms.products.addImage", "Add Image")}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {t("cms.products.categories", "Categories")}
          </h2>
          <div className="text-center py-8 bg-gray-50 rounded-md">
            <p className="text-gray-500">
              {t("cms.products.noCategories", "No categories selected")}
            </p>
            <Button className="mt-4">
              {t("cms.products.selectCategories", "Select Categories")}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {t("cms.products.variants", "Product Variants")}
          </h2>
          <div className="text-center py-8 bg-gray-50 rounded-md">
            <p className="text-gray-500">
              {t("cms.products.noVariants", "No variants added yet")}
            </p>
            <Button className="mt-4">
              {t("cms.products.addVariant", "Add Variant")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
