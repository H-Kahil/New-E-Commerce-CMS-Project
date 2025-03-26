import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRtl } from "@/contexts/RtlContext";
import { products, variants, supabase } from "@/services/supabase";
import { Wizard } from "@/components/ui/wizard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Plus, Trash2, Upload } from "lucide-react";
import CMSNavbar from "../components/CMSNavbar";

const ProductWizard: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useRtl();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [parentCategories, setParentCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [selectedParentCategory, setSelectedParentCategory] =
    useState<string>("");

  // Product form state
  const [productData, setProductData] = useState({
    // Basic Info
    title: "New Product",
    slug: "",
    description: "",
    price: "0.00",
    sale_price: "",
    compare_at_price: "",
    sku: "",
    stock: "0",
    availability_status: "in_stock",
    is_new: false,
    is_on_sale: false,
    is_featured: false,

    // Details
    brand: "",
    model: "",
    color: "",
    dimensions: "",
    weight: "",
    warranty: "",

    // Features & Specs
    features: [""],
    specifications: [{ key: "", value: "" }],

    // Categories
    categories: [],
    parent_category: "",
    sub_category: "",

    // SEO
    meta_title: "",
    meta_description: "",
    meta_keywords: "",

    // Images
    images: [],
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch parent categories (level 0)
        const { data: parentCats, error: parentError } =
          await products.getCategories(language, { parentId: null });
        if (parentError) throw parentError;
        setParentCategories(parentCats || []);

        // Fetch all categories for the complete list
        // Use direct query to avoid ambiguous relationship error
        const { data: allCats, error } = await supabase
          .from("categories")
          .select("*")
          .eq("locale", language);
        if (error) throw error;
        setCategories(allCats || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, [language]);

  // Update subcategories when parent category changes
  useEffect(() => {
    if (selectedParentCategory) {
      const filteredSubcategories = categories.filter(
        (cat) => cat.parent_id === selectedParentCategory,
      );
      setSubCategories(filteredSubcategories);

      // Reset subcategory selection when parent changes
      setProductData((prev) => ({
        ...prev,
        sub_category: "",
      }));
    } else {
      setSubCategories([]);
    }
  }, [selectedParentCategory, categories]);

  // Handle form field changes
  const handleChange = (field: string, value: any) => {
    setProductData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Generate slug from title if slug is empty
    if (field === "title" && !productData.slug) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      setProductData((prev) => ({
        ...prev,
        slug: generatedSlug,
      }));
    }

    // Update parent category selection
    if (field === "parent_category") {
      setSelectedParentCategory(value);
    }

    // Add selected category IDs to the categories array
    if (field === "sub_category" && value) {
      setProductData((prev) => ({
        ...prev,
        categories: [
          ...prev.categories.filter((id) => id !== prev.parent_category),
          prev.parent_category,
          value,
        ],
      }));
    } else if (field === "parent_category" && value) {
      setProductData((prev) => ({
        ...prev,
        categories: [
          ...prev.categories.filter((id) => id !== prev.sub_category),
          value,
        ],
      }));
    }
  };

  // Handle features array
  const addFeature = () => {
    setProductData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const removeFeature = (index: number) => {
    setProductData((prev) => {
      const newFeatures = [...prev.features];
      newFeatures.splice(index, 1);
      return {
        ...prev,
        features: newFeatures,
      };
    });
  };

  const updateFeature = (index: number, value: string) => {
    setProductData((prev) => {
      const newFeatures = [...prev.features];
      newFeatures[index] = value;
      return {
        ...prev,
        features: newFeatures,
      };
    });
  };

  // Handle specifications array
  const addSpecification = () => {
    setProductData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }],
    }));
  };

  const removeSpecification = (index: number) => {
    setProductData((prev) => {
      const newSpecs = [...prev.specifications];
      newSpecs.splice(index, 1);
      return {
        ...prev,
        specifications: newSpecs,
      };
    });
  };

  const updateSpecification = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    setProductData((prev) => {
      const newSpecs = [...prev.specifications];
      newSpecs[index][field] = value;
      return {
        ...prev,
        specifications: newSpecs,
      };
    });
  };

  // Handle image uploads (mock implementation - would need to be connected to actual file upload)
  const handleImageUpload = () => {
    // In a real implementation, this would handle file uploads to storage
    // For now, we'll just add a placeholder image
    setProductData((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        {
          url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
          alt: productData.title || "Product image",
        },
      ],
    }));
  };

  const removeImage = (index: number) => {
    setProductData((prev) => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return {
        ...prev,
        images: newImages,
      };
    });
  };

  // Handle form submission
  const handleSave = async () => {
    if (!productData.title) {
      alert("Title is required");
      return;
    }

    setLoading(true);
    try {
      // Generate a slug if not provided
      const finalSlug =
        productData.slug ||
        productData.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");

      // Filter out empty features and specifications
      const filteredFeatures = productData.features.filter(
        (f) => f.trim() !== "",
      );
      const filteredSpecs = productData.specifications.filter(
        (s) => s.key.trim() !== "" && s.value.trim() !== "",
      );
      const specsObject = filteredSpecs.reduce(
        (acc, { key, value }) => {
          acc[key] = value;
          return acc;
        },
        {} as Record<string, string>,
      );

      // Call the product creation API
      const { data, error } = await products.createProduct(
        {
          title: productData.title,
          slug: finalSlug,
          description: productData.description,
          price: parseFloat(productData.price),
          sale_price: productData.sale_price
            ? parseFloat(productData.sale_price)
            : null,
          compare_at_price: productData.compare_at_price
            ? parseFloat(productData.compare_at_price)
            : null,
          sku: productData.sku,
          stock: parseInt(productData.stock, 10),
          brand: productData.brand,
          model: productData.model,
          color: productData.color,
          dimensions: productData.dimensions,
          weight: productData.weight,
          warranty: productData.warranty,
          is_new: productData.is_new,
          is_on_sale: productData.is_on_sale,
          is_featured: productData.is_featured,
          availability_status: productData.availability_status,
          meta_title: productData.meta_title || productData.title,
          meta_description:
            productData.meta_description || productData.description,
          meta_keywords: productData.meta_keywords,
          features: filteredFeatures,
          specifications: specsObject,
          categories: productData.categories.filter((c) => c), // Filter out empty values
          images: productData.images,
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

  // Wizard steps
  const wizardSteps = [
    {
      title: t("cms.products.basicInfo", "Basic Info"),
      description: t(
        "cms.products.basicInfoDesc",
        "Enter the essential product information",
      ),
      content: (
        <div className="space-y-4">
          <div>
            <Label
              htmlFor="productTitle"
              className="block text-sm font-medium mb-1"
            >
              {t("cms.products.productTitle", "Product Title")}
            </Label>
            <Input
              type="text"
              id="productTitle"
              value={productData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <Label
              htmlFor="productSlug"
              className="block text-sm font-medium mb-1"
            >
              {t("cms.products.productSlug", "Product Slug")}
              <span className="text-xs text-muted-foreground ml-1">
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
              value={productData.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <Label
              htmlFor="productDescription"
              className="block text-sm font-medium mb-1"
            >
              {t("cms.products.description", "Product Description")}
            </Label>
            <Textarea
              id="productDescription"
              value={productData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full h-32"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label
                htmlFor="productPrice"
                className="block text-sm font-medium mb-1"
              >
                {t("cms.products.price", "Price")}
              </Label>
              <Input
                type="number"
                id="productPrice"
                value={productData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                className="w-full"
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <Label
                htmlFor="productSalePrice"
                className="block text-sm font-medium mb-1"
              >
                {t("cms.products.salePrice", "Sale Price")}
              </Label>
              <Input
                type="number"
                id="productSalePrice"
                value={productData.sale_price}
                onChange={(e) => handleChange("sale_price", e.target.value)}
                className="w-full"
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <Label
                htmlFor="productComparePrice"
                className="block text-sm font-medium mb-1"
              >
                {t("cms.products.compareAtPrice", "Compare At Price")}
              </Label>
              <Input
                type="number"
                id="productComparePrice"
                value={productData.compare_at_price}
                onChange={(e) =>
                  handleChange("compare_at_price", e.target.value)
                }
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
                className="block text-sm font-medium mb-1"
              >
                {t("cms.products.sku", "SKU")}
              </Label>
              <Input
                type="text"
                id="productSku"
                value={productData.sku}
                onChange={(e) => handleChange("sku", e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <Label
                htmlFor="productStock"
                className="block text-sm font-medium mb-1"
              >
                {t("cms.products.stock", "Stock")}
              </Label>
              <Input
                type="number"
                id="productStock"
                value={productData.stock}
                onChange={(e) => handleChange("stock", e.target.value)}
                className="w-full"
                min="0"
                step="1"
              />
            </div>

            <div>
              <Label
                htmlFor="productAvailability"
                className="block text-sm font-medium mb-1"
              >
                {t("cms.products.availability", "Availability")}
              </Label>
              <Select
                value={productData.availability_status}
                onValueChange={(value) =>
                  handleChange("availability_status", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t(
                      "cms.products.selectAvailability",
                      "Select availability",
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_stock">
                    {t("cms.products.inStock", "In Stock")}
                  </SelectItem>
                  <SelectItem value="out_of_stock">
                    {t("cms.products.outOfStock", "Out of Stock")}
                  </SelectItem>
                  <SelectItem value="backorder">
                    {t("cms.products.backorder", "Backorder")}
                  </SelectItem>
                  <SelectItem value="preorder">
                    {t("cms.products.preorder", "Pre-order")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="isNew"
                checked={productData.is_new}
                onCheckedChange={(checked) => handleChange("is_new", checked)}
              />
              <Label htmlFor="isNew">
                {t("cms.products.isNew", "Mark as New")}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isOnSale"
                checked={productData.is_on_sale}
                onCheckedChange={(checked) =>
                  handleChange("is_on_sale", checked)
                }
              />
              <Label htmlFor="isOnSale">
                {t("cms.products.isOnSale", "On Sale")}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isFeatured"
                checked={productData.is_featured}
                onCheckedChange={(checked) =>
                  handleChange("is_featured", checked)
                }
              />
              <Label htmlFor="isFeatured">
                {t("cms.products.isFeatured", "Featured Product")}
              </Label>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t("cms.products.categories", "Categories"),
      description: t(
        "cms.products.categoriesDesc",
        "Assign your product to categories",
      ),
      content: (
        <div className="space-y-6">
          <div>
            <Label
              htmlFor="parentCategory"
              className="block text-sm font-medium mb-1"
            >
              {t("cms.products.parentCategory", "Parent Category")}
            </Label>
            <Select
              value={productData.parent_category}
              onValueChange={(value) => handleChange("parent_category", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={t(
                    "cms.products.selectCategory",
                    "Select a category",
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {parentCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedParentCategory && subCategories.length > 0 && (
            <div>
              <Label
                htmlFor="subCategory"
                className="block text-sm font-medium mb-1"
              >
                {t("cms.products.subCategory", "Sub Category")}
              </Label>
              <Select
                value={productData.sub_category}
                onValueChange={(value) => handleChange("sub_category", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t(
                      "cms.products.selectSubCategory",
                      "Select a sub-category",
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {subCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {productData.categories.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">
                {t("cms.products.selectedCategories", "Selected Categories")}
              </h4>
              <div className="bg-muted p-3 rounded-md">
                <ul className="list-disc pl-5 space-y-1">
                  {productData.categories.map((catId) => {
                    const category = categories.find((c) => c.id === catId);
                    return category ? (
                      <li key={catId} className="text-sm">
                        {category.name}
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      title: t("cms.products.details", "Details"),
      description: t(
        "cms.products.detailsDesc",
        "Add detailed product information",
      ),
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="productBrand"
                className="block text-sm font-medium mb-1"
              >
                {t("cms.products.brand", "Brand")}
              </Label>
              <Input
                type="text"
                id="productBrand"
                value={productData.brand}
                onChange={(e) => handleChange("brand", e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <Label
                htmlFor="productModel"
                className="block text-sm font-medium mb-1"
              >
                {t("cms.products.model", "Model")}
              </Label>
              <Input
                type="text"
                id="productModel"
                value={productData.model}
                onChange={(e) => handleChange("model", e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label
                htmlFor="productColor"
                className="block text-sm font-medium mb-1"
              >
                {t("cms.products.color", "Color")}
              </Label>
              <Input
                type="text"
                id="productColor"
                value={productData.color}
                onChange={(e) => handleChange("color", e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <Label
                htmlFor="productDimensions"
                className="block text-sm font-medium mb-1"
              >
                {t("cms.products.dimensions", "Dimensions")}
              </Label>
              <Input
                type="text"
                id="productDimensions"
                value={productData.dimensions}
                onChange={(e) => handleChange("dimensions", e.target.value)}
                className="w-full"
                placeholder="e.g. 10 x 5 x 2 inches"
              />
            </div>

            <div>
              <Label
                htmlFor="productWeight"
                className="block text-sm font-medium mb-1"
              >
                {t("cms.products.weight", "Weight")}
              </Label>
              <Input
                type="text"
                id="productWeight"
                value={productData.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
                className="w-full"
                placeholder="e.g. 2.5 lbs"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="productWarranty"
              className="block text-sm font-medium mb-1"
            >
              {t("cms.products.warranty", "Warranty Information")}
            </Label>
            <Input
              type="text"
              id="productWarranty"
              value={productData.warranty}
              onChange={(e) => handleChange("warranty", e.target.value)}
              className="w-full"
              placeholder="e.g. 1 Year Limited Warranty"
            />
          </div>
        </div>
      ),
    },
    {
      title: t("cms.products.featuresSpecs", "Features & Specs"),
      description: t(
        "cms.products.featuresSpecsDesc",
        "Add product features and specifications",
      ),
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-medium mb-3">
              {t("cms.products.keyFeatures", "Key Features")}
            </h3>
            <div className="space-y-3">
              {productData.features.map((feature, index) => (
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
                    disabled={productData.features.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={addFeature}
            >
              <Plus className="h-4 w-4 mr-1" />
              {t("cms.products.addFeature", "Add Feature")}
            </Button>
          </div>

          <Separator className="my-4" />

          <div>
            <h3 className="text-base font-medium mb-3">
              {t("cms.products.specifications", "Specifications")}
            </h3>
            <div className="space-y-3">
              {productData.specifications.map((spec, index) => (
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
                    disabled={productData.specifications.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={addSpecification}
            >
              <Plus className="h-4 w-4 mr-1" />
              {t("cms.products.addSpecification", "Add Specification")}
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: t("cms.products.media", "Media"),
      description: t("cms.products.mediaDesc", "Upload product images"),
      content: (
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-1">
              {t(
                "cms.products.dragImages",
                "Drag and drop images here or click to browse",
              )}
            </p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleImageUpload}
            >
              {t("cms.products.uploadImages", "Upload Images")}
            </Button>
          </div>

          {productData.images.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">
                {t("cms.products.uploadedImages", "Uploaded Images")}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {productData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.url}
                      alt={image.alt || "Product image"}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      title: t("cms.products.seo", "SEO"),
      description: t("cms.products.seoDesc", "Optimize for search engines"),
      content: (
        <div className="space-y-4">
          <div>
            <Label
              htmlFor="metaTitle"
              className="block text-sm font-medium mb-1"
            >
              {t("cms.products.metaTitle", "Meta Title")}
              <span className="text-xs text-muted-foreground ml-1">
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
              value={productData.meta_title}
              onChange={(e) => handleChange("meta_title", e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <Label
              htmlFor="metaDescription"
              className="block text-sm font-medium mb-1"
            >
              {t("cms.products.metaDescription", "Meta Description")}
              <span className="text-xs text-muted-foreground ml-1">
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
              value={productData.meta_description}
              onChange={(e) => handleChange("meta_description", e.target.value)}
              className="w-full h-24"
            />
          </div>

          <div>
            <Label
              htmlFor="metaKeywords"
              className="block text-sm font-medium mb-1"
            >
              {t("cms.products.metaKeywords", "Meta Keywords")}
              <span className="text-xs text-muted-foreground ml-1">
                (
                {t("cms.products.metaKeywordsInfo", "Comma-separated keywords")}
                )
              </span>
            </Label>
            <Input
              type="text"
              id="metaKeywords"
              value={productData.meta_keywords}
              onChange={(e) => handleChange("meta_keywords", e.target.value)}
              className="w-full"
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>

          <div className="p-4 bg-muted rounded-md flex items-start gap-3 mt-4">
            <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">
                {t("cms.products.seoTips", "SEO Tips")}
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  {t(
                    "cms.products.seoTip1",
                    "Keep meta titles under 60 characters",
                  )}
                </li>
                <li>
                  {t(
                    "cms.products.seoTip2",
                    "Meta descriptions should be 120-160 characters",
                  )}
                </li>
                <li>
                  {t(
                    "cms.products.seoTip3",
                    "Use relevant keywords in both title and description",
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t("cms.products.review", "Review & Submit"),
      description: t(
        "cms.products.reviewDesc",
        "Review your product before submission",
      ),
      content: (
        <div className="space-y-6">
          <div className="bg-muted p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">{productData.title}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">
                  {t("cms.products.price", "Price")}:
                </p>
                <p>${parseFloat(productData.price).toFixed(2)}</p>
              </div>

              {productData.sale_price && (
                <div>
                  <p className="font-medium">
                    {t("cms.products.salePrice", "Sale Price")}:
                  </p>
                  <p>${parseFloat(productData.sale_price).toFixed(2)}</p>
                </div>
              )}

              <div>
                <p className="font-medium">{t("cms.products.sku", "SKU")}:</p>
                <p>{productData.sku || "-"}</p>
              </div>

              <div>
                <p className="font-medium">
                  {t("cms.products.stock", "Stock")}:
                </p>
                <p>{productData.stock}</p>
              </div>

              <div>
                <p className="font-medium">
                  {t("cms.products.brand", "Brand")}:
                </p>
                <p>{productData.brand || "-"}</p>
              </div>

              <div>
                <p className="font-medium">
                  {t("cms.products.categories", "Categories")}:
                </p>
                <p>
                  {productData.categories.length > 0
                    ? productData.categories
                        .map((catId) => {
                          const category = categories.find(
                            (c) => c.id === catId,
                          );
                          return category ? category.name : "";
                        })
                        .filter(Boolean)
                        .join(", ")
                    : "-"}
                </p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="text-sm">
              <p className="font-medium mb-1">
                {t("cms.products.description", "Description")}:
              </p>
              <p className="text-muted-foreground">
                {productData.description || "-"}
              </p>
            </div>

            {productData.features.some((f) => f.trim() !== "") && (
              <div className="mt-4 text-sm">
                <p className="font-medium mb-1">
                  {t("cms.products.keyFeatures", "Key Features")}:
                </p>
                <ul className="list-disc pl-5">
                  {productData.features
                    .filter((f) => f.trim() !== "")
                    .map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                </ul>
              </div>
            )}

            {productData.images.length > 0 && (
              <div className="mt-4">
                <p className="font-medium text-sm mb-2">
                  {t("cms.products.images", "Images")}:
                </p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {productData.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={image.alt || "Product image"}
                      className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleSave}
              disabled={loading}
              size="lg"
              className="min-w-[200px]"
            >
              {loading
                ? t("common.saving", "Saving...")
                : t("cms.products.createProduct", "Create Product")}
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <CMSNavbar />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {t("cms.products.createNew", "Create New Product")}
          </h2>
          <Button variant="outline" onClick={() => navigate("/cms/products")}>
            {t("common.cancel", "Cancel")}
          </Button>
        </div>

        <Wizard
          steps={wizardSteps}
          onComplete={handleSave}
          completeButtonText={
            loading
              ? t("common.saving", "Saving...")
              : t("cms.products.createProduct", "Create Product")
          }
          nextButtonText={t("common.next", "Next")}
          previousButtonText={t("common.back", "Back")}
        />
      </div>
    </div>
  );
};

export default ProductWizard;
