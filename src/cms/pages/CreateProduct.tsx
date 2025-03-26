import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRtl } from "@/contexts/RtlContext";
import { products } from "@/services/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CMSNavbar from "../components/CMSNavbar";

const CreateProduct: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useRtl();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("New Product");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0.00");
  const [salePrice, setSalePrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState("0");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [weight, setWeight] = useState("");
  const [warranty, setWarranty] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [isOnSale, setIsOnSale] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState("in_stock");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [features, setFeatures] = useState<string[]>([""]); // Array of feature strings
  const [specifications, setSpecifications] = useState<
    { key: string; value: string }[]
  >([{ key: "", value: "" }]);

  // Handle adding/removing features
  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const removeFeature = (index: number) => {
    const newFeatures = [...features];
    newFeatures.splice(index, 1);
    setFeatures(newFeatures);
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  // Handle adding/removing specifications
  const addSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const removeSpecification = (index: number) => {
    const newSpecs = [...specifications];
    newSpecs.splice(index, 1);
    setSpecifications(newSpecs);
  };

  const updateSpecification = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  const handleSave = async () => {
    if (!title) {
      alert("Title is required");
      return;
    }

    setLoading(true);
    try {
      // Generate a slug if not provided
      const finalSlug =
        slug ||
        title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");

      // Filter out empty features and specifications
      const filteredFeatures = features.filter((f) => f.trim() !== "");
      const filteredSpecs = specifications.filter(
        (s) => s.key.trim() !== "" && s.value.trim() !== "",
      );
      const specsObject = filteredSpecs.reduce(
        (acc, { key, value }) => {
          acc[key] = value;
          return acc;
        },
        {} as Record<string, string>,
      );

      // Call the actual product creation API
      const { data, error } = await products.createProduct(
        {
          title,
          slug: finalSlug,
          description,
          price: parseFloat(price),
          sale_price: salePrice ? parseFloat(salePrice) : null,
          compare_at_price: compareAtPrice ? parseFloat(compareAtPrice) : null,
          sku,
          stock: parseInt(stock, 10),
          brand,
          model,
          color,
          dimensions,
          weight,
          warranty,
          is_new: isNew,
          is_on_sale: isOnSale,
          is_featured: isFeatured,
          availability_status: availabilityStatus,
          meta_title: metaTitle || title,
          meta_description: metaDescription || description,
          meta_keywords: metaKeywords,
          features: filteredFeatures,
          specifications: specsObject,
          // Add empty arrays for categories and images
          categories: [],
          images: [],
        },
        language,
      );

      if (error) {
        console.error("Error creating product:", error);
        alert(`Failed to create product: ${error.message}`);
        return;
      }

      alert("Product created successfully!");
      // Redirect to the products list
      navigate("/cms/products");
    } catch (err: any) {
      console.error("Error creating product:", err);
      alert(`An error occurred: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <CMSNavbar />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {t("cms.products.createNew", "Create New Product")}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/cms/products")}>
              {t("common.cancel", "Cancel")}
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading
                ? t("common.saving", "Saving...")
                : t("common.save", "Save")}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="basic">
              {t("cms.products.basicInfo", "Basic Info")}
            </TabsTrigger>
            <TabsTrigger value="details">
              {t("cms.products.details", "Details")}
            </TabsTrigger>
            <TabsTrigger value="features">
              {t("cms.products.featuresSpecs", "Features & Specs")}
            </TabsTrigger>
            <TabsTrigger value="media">
              {t("cms.products.media", "Media")}
            </TabsTrigger>
            <TabsTrigger value="categories">
              {t("cms.products.categories", "Categories")}
            </TabsTrigger>
            <TabsTrigger value="variants">
              {t("cms.products.variants", "Variants")}
            </TabsTrigger>
            <TabsTrigger value="seo">
              {t("cms.products.seo", "SEO")}
            </TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
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
                    <span className="text-xs text-gray-500 ml-1">
                      (
                      {t(
                        "cms.products.slugInfo",
                        "Leave empty to generate from title",
                      )}
                      )
                    </span>
                  </Label>
                  <Input
                    type="text"
                    id="productSlug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="productDescription"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("cms.products.description", "Product Description")}
                  </Label>
                  <Textarea
                    id="productDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-32"
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
                      htmlFor="productSalePrice"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t("cms.products.salePrice", "Sale Price")}
                    </Label>
                    <Input
                      type="number"
                      id="productSalePrice"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                      className="w-full"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="productComparePrice"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t("cms.products.compareAtPrice", "Compare At Price")}
                    </Label>
                    <Input
                      type="number"
                      id="productComparePrice"
                      value={compareAtPrice}
                      onChange={(e) => setCompareAtPrice(e.target.value)}
                      className="w-full"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <div>
                    <Label
                      htmlFor="productAvailability"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t("cms.products.availability", "Availability")}
                    </Label>
                    <select
                      id="productAvailability"
                      value={availabilityStatus}
                      onChange={(e) => setAvailabilityStatus(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    >
                      <option value="in_stock">
                        {t("cms.products.inStock", "In Stock")}
                      </option>
                      <option value="out_of_stock">
                        {t("cms.products.outOfStock", "Out of Stock")}
                      </option>
                      <option value="backorder">
                        {t("cms.products.backorder", "Backorder")}
                      </option>
                      <option value="preorder">
                        {t("cms.products.preorder", "Pre-order")}
                      </option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isNew"
                      checked={isNew}
                      onCheckedChange={setIsNew}
                    />
                    <Label htmlFor="isNew">
                      {t("cms.products.isNew", "Mark as New")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isOnSale"
                      checked={isOnSale}
                      onCheckedChange={setIsOnSale}
                    />
                    <Label htmlFor="isOnSale">
                      {t("cms.products.isOnSale", "On Sale")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isFeatured"
                      checked={isFeatured}
                      onCheckedChange={setIsFeatured}
                    />
                    <Label htmlFor="isFeatured">
                      {t("cms.products.isFeatured", "Featured Product")}
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="productBrand"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t("cms.products.brand", "Brand")}
                    </Label>
                    <Input
                      type="text"
                      id="productBrand"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="productModel"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t("cms.products.model", "Model")}
                    </Label>
                    <Input
                      type="text"
                      id="productModel"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label
                      htmlFor="productColor"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t("cms.products.color", "Color")}
                    </Label>
                    <Input
                      type="text"
                      id="productColor"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="productDimensions"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t("cms.products.dimensions", "Dimensions")}
                    </Label>
                    <Input
                      type="text"
                      id="productDimensions"
                      value={dimensions}
                      onChange={(e) => setDimensions(e.target.value)}
                      className="w-full"
                      placeholder="e.g. 10 x 5 x 2 inches"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="productWeight"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t("cms.products.weight", "Weight")}
                    </Label>
                    <Input
                      type="text"
                      id="productWeight"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full"
                      placeholder="e.g. 2.5 lbs"
                    />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="productWarranty"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("cms.products.warranty", "Warranty Information")}
                  </Label>
                  <Input
                    type="text"
                    id="productWarranty"
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                    className="w-full"
                    placeholder="e.g. 1 Year Limited Warranty"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Features & Specs Tab */}
          <TabsContent value="features" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">
                  {t("cms.products.keyFeatures", "Key Features")}
                </h3>
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder={t(
                          "cms.products.featurePlaceholder",
                          "Enter a product feature",
                        )}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeFeature(index)}
                        disabled={features.length <= 1}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3"
                  onClick={addFeature}
                >
                  {t("cms.products.addFeature", "Add Feature")}
                </Button>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">
                  {t("cms.products.specifications", "Specifications")}
                </h3>
                <div className="space-y-3">
                  {specifications.map((spec, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={spec.key}
                        onChange={(e) =>
                          updateSpecification(index, "key", e.target.value)
                        }
                        placeholder={t(
                          "cms.products.specNamePlaceholder",
                          "Specification name",
                        )}
                        className="flex-1"
                      />
                      <Input
                        type="text"
                        value={spec.value}
                        onChange={(e) =>
                          updateSpecification(index, "value", e.target.value)
                        }
                        placeholder={t(
                          "cms.products.specValuePlaceholder",
                          "Specification value",
                        )}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeSpecification(index)}
                        disabled={specifications.length <= 1}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3"
                  onClick={addSpecification}
                >
                  {t("cms.products.addSpecification", "Add Specification")}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
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
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
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
          </TabsContent>

          {/* Variants Tab */}
          <TabsContent value="variants" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
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
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="metaTitle"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("cms.products.metaTitle", "Meta Title")}
                    <span className="text-xs text-gray-500 ml-1">
                      (
                      {t(
                        "cms.products.metaTitleInfo",
                        "Leave empty to use product title",
                      )}
                      )
                    </span>
                  </Label>
                  <Input
                    type="text"
                    id="metaTitle"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="metaDescription"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("cms.products.metaDescription", "Meta Description")}
                    <span className="text-xs text-gray-500 ml-1">
                      (
                      {t(
                        "cms.products.metaDescriptionInfo",
                        "Leave empty to use product description",
                      )}
                      )
                    </span>
                  </Label>
                  <Textarea
                    id="metaDescription"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full h-24"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="metaKeywords"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("cms.products.metaKeywords", "Meta Keywords")}
                    <span className="text-xs text-gray-500 ml-1">
                      (
                      {t(
                        "cms.products.metaKeywordsInfo",
                        "Comma-separated keywords",
                      )}
                      )
                    </span>
                  </Label>
                  <Input
                    type="text"
                    id="metaKeywords"
                    value={metaKeywords}
                    onChange={(e) => setMetaKeywords(e.target.value)}
                    className="w-full"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreateProduct;
