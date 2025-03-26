import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRtl } from "@/contexts/RtlContext";
import { products } from "@/services/supabase";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Eye,
  Trash2,
  Plus,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import CMSNavbar from "../components/CMSNavbar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface Category {
  id: string;
  name: string;
  name_en: string;
  name_ar: string;
  slug: string;
  parent_id: string | null;
  level: number;
  is_active: boolean;
  subcategories?: Category[];
}

const CategoriesModule: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useRtl();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  // Form state
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    slug: "",
    parent_id: null as string | null,
    is_active: true,
  });

  useEffect(() => {
    fetchCategories();
  }, [language]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await products.getCategoryTree(language);

      if (error) throw new Error(error.message);
      setCategories(data || []);
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = () => {
    setFormMode("create");
    setSelectedCategory(null);
    setFormData({
      name_en: "",
      name_ar: "",
      slug: "",
      parent_id: null,
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setFormMode("edit");
    setSelectedCategory(category);
    setFormData({
      name_en: category.name_en || category.name,
      name_ar: category.name_ar || "",
      slug: category.slug,
      parent_id: category.parent_id,
      is_active: category.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteCategory = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this category? This will also remove it from all products.",
      )
    )
      return;

    try {
      const { error } = await products.deleteCategory(id, language);
      if (error) throw new Error(error.message);

      // Refresh the category list
      fetchCategories();
      alert("Category deleted successfully");
    } catch (err: any) {
      console.error("Error deleting category:", err);
      alert(`Failed to delete category: ${err.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (formMode === "create") {
        const { error } = await products.createCategory(formData, language);
        if (error) throw new Error(error.message);
        alert("Category created successfully");
      } else {
        if (!selectedCategory) return;
        const { error } = await products.updateCategory(
          selectedCategory.id,
          formData,
          language,
        );
        if (error) throw new Error(error.message);
        alert("Category updated successfully");
      }

      // Refresh the category list and close the dialog
      fetchCategories();
      setIsDialogOpen(false);
    } catch (err: any) {
      console.error("Error saving category:", err);
      alert(`Failed to save category: ${err.message}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_active: checked }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      parent_id: value === "none" ? null : value,
    }));
  };

  const handleSlugGeneration = () => {
    // Generate slug from English name
    const slug = formData.name_en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setFormData((prev) => ({ ...prev, slug }));
  };

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Recursive function to render category tree
  const renderCategoryTree = (categoryList: Category[], depth = 0) => {
    return categoryList.map((category) => {
      const hasSubcategories =
        category.subcategories && category.subcategories.length > 0;
      const isExpanded = expandedCategories[category.id];

      return (
        <React.Fragment key={category.id}>
          <tr
            className={`hover:bg-gray-50 ${!category.is_active ? "text-gray-400" : ""}`}
          >
            <td className="px-4 py-3 border-b">
              <div
                className="flex items-center"
                style={{ paddingLeft: `${depth * 20}px` }}
              >
                {hasSubcategories && (
                  <button
                    onClick={() => toggleExpand(category.id)}
                    className="mr-2 focus:outline-none"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                )}
                {!hasSubcategories && <span className="w-6"></span>}
                <span>{category.name_en || category.name}</span>
              </div>
            </td>
            <td className="px-4 py-3 border-b">{category.name_ar || "-"}</td>
            <td className="px-4 py-3 border-b">/{category.slug}</td>
            <td className="px-4 py-3 border-b">{category.level}</td>
            <td className="px-4 py-3 border-b">
              <span
                className={`px-2 py-1 rounded-full text-xs ${category.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
              >
                {category.is_active ? "Active" : "Inactive"}
              </span>
            </td>
            <td className="px-4 py-3 border-b">
              <div className="flex justify-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditCategory(category)}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </td>
          </tr>

          {/* Render subcategories if expanded */}
          {hasSubcategories &&
            isExpanded &&
            renderCategoryTree(category.subcategories!, depth + 1)}
        </React.Fragment>
      );
    });
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
            {t("cms.categories.title", "Categories")}
          </h2>
          <Button onClick={handleCreateCategory}>
            <Plus className="mr-2 h-4 w-4" />
            {t("cms.categories.createNew", "Create New Category")}
          </Button>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">
              {t("cms.categories.noCategories", "No categories found")}
            </p>
            <Button onClick={handleCreateCategory}>
              <Plus className="mr-2 h-4 w-4" />
              {t("cms.categories.createFirst", "Create your first category")}
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left border-b">
                    {t("cms.categories.nameEnColumn", "Name (English)")}
                  </th>
                  <th className="px-4 py-2 text-left border-b">
                    {t("cms.categories.nameArColumn", "Name (Arabic)")}
                  </th>
                  <th className="px-4 py-2 text-left border-b">
                    {t("cms.categories.slugColumn", "Slug")}
                  </th>
                  <th className="px-4 py-2 text-left border-b">
                    {t("cms.categories.levelColumn", "Level")}
                  </th>
                  <th className="px-4 py-2 text-left border-b">
                    {t("cms.categories.statusColumn", "Status")}
                  </th>
                  <th className="px-4 py-2 text-center border-b">
                    {t("cms.categories.actionsColumn", "Actions")}
                  </th>
                </tr>
              </thead>
              <tbody>{renderCategoryTree(categories)}</tbody>
            </table>
          </div>
        )}

        {/* Category Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {formMode === "create"
                  ? "Create New Category"
                  : "Edit Category"}
              </DialogTitle>
              <DialogDescription>
                {formMode === "create"
                  ? "Add a new category to your store."
                  : "Update the category details."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name_en" className="text-right">
                    Name (English)
                  </Label>
                  <Input
                    id="name_en"
                    name="name_en"
                    value={formData.name_en}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name_ar" className="text-right">
                    Name (Arabic)
                  </Label>
                  <Input
                    id="name_ar"
                    name="name_ar"
                    value={formData.name_ar}
                    onChange={handleInputChange}
                    className="col-span-3"
                    dir="rtl"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="slug" className="text-right">
                    Slug
                  </Label>
                  <div className="col-span-3 flex gap-2">
                    <Input
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      className="flex-1"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSlugGeneration}
                    >
                      Generate
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="parent_id" className="text-right">
                    Parent Category
                  </Label>
                  <Select
                    value={formData.parent_id || "none"}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a parent category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Root Category)</SelectItem>
                      {/* Flatten the category tree for selection */}
                      {(() => {
                        // Helper function to flatten the category tree
                        const flattenCategories = (
                          cats: Category[],
                          prefix = "",
                        ) => {
                          let result: React.ReactNode[] = [];

                          cats.forEach((category) => {
                            // Don't allow setting itself as parent (for edit mode)
                            if (selectedCategory?.id !== category.id) {
                              result.push(
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  {prefix}
                                  {category.name_en ||
                                    category.name} (Level {category.level})
                                </SelectItem>,
                              );
                            }

                            // Add subcategories with indentation
                            if (
                              category.subcategories &&
                              category.subcategories.length > 0
                            ) {
                              result = [
                                ...result,
                                ...flattenCategories(
                                  category.subcategories,
                                  `${prefix}└─ `,
                                ),
                              ];
                            }
                          });

                          return result;
                        };

                        return flattenCategories(categories);
                      })()}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="is_active" className="text-right">
                    Active
                  </Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={handleSwitchChange}
                    />
                    <span>{formData.is_active ? "Active" : "Inactive"}</span>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {formMode === "create"
                    ? "Create Category"
                    : "Update Category"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CategoriesModule;
