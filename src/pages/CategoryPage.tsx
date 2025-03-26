import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { products } from "../services/supabase";
import { useRtl } from "../contexts/RtlContext";
import { ChevronRight } from "lucide-react";

// Components
import ProductGrid from "../ecommerce/products/ProductGrid";

interface Category {
  id: string;
  name: string;
  name_en: string;
  name_ar: string;
  slug: string;
  description?: string;
  parent_id: string | null;
  level: number;
  is_active: boolean;
  parent?: Category;
  subcategories?: Category[];
}

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { language, isRtl } = useRtl();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      if (!slug) return;

      setLoading(true);
      try {
        // Fetch category details with parent and subcategories
        const { data: categoryData, error: categoryError } =
          await products.getCategoryBySlug(slug, language);

        if (categoryError) throw new Error(categoryError.message);
        if (!categoryData) throw new Error("Category not found");

        setCategory(categoryData);

        // Set subcategories
        if (categoryData.subcategories) {
          setSubcategories(categoryData.subcategories);
        }

        // Build breadcrumb trail
        const buildBreadcrumbs = async (cat: Category) => {
          const trail: Category[] = [cat];
          let currentParent = cat.parent;

          while (currentParent) {
            trail.unshift(currentParent);
            if (currentParent.parent_id) {
              const { data: parentData } = await products.getCategoryById(
                currentParent.parent_id,
                language,
              );
              if (parentData) {
                currentParent = parentData;
              } else {
                break;
              }
            } else {
              break;
            }
          }

          return trail;
        };

        const breadcrumbTrail = await buildBreadcrumbs(categoryData);
        setBreadcrumbs(breadcrumbTrail);

        // Fetch products in this category
        const { data: productsData, error: productsError } =
          await products.getProducts({
            category: slug,
            locale: language,
            limit: 20,
          });

        if (productsError) throw new Error(productsError.message);
        setCategoryProducts(productsData || []);
      } catch (err: any) {
        console.error("Error fetching category data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [slug, language]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          {error || "Category not found"}
        </h1>
        <p className="mb-4">
          {t("common.category")} {slug} {t("common.notFound")}
        </p>
      </div>
    );
  }

  const categoryName = isRtl
    ? category.name_ar || category.name
    : category.name_en || category.name;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <nav className="mb-6">
        <ol
          className={`flex flex-wrap items-center text-sm text-gray-500 ${isRtl ? "space-x-reverse" : ""}`}
        >
          <li>
            <Link to="/" className="hover:text-primary">
              {t("common.home", "Home")}
            </Link>
          </li>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.id}>
              <li className="mx-2">
                <ChevronRight className="h-4 w-4" />
              </li>
              <li>
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-gray-900">
                    {isRtl
                      ? crumb.name_ar || crumb.name
                      : crumb.name_en || crumb.name}
                  </span>
                ) : (
                  <Link
                    to={`/category/${crumb.slug}`}
                    className="hover:text-primary"
                  >
                    {isRtl
                      ? crumb.name_ar || crumb.name
                      : crumb.name_en || crumb.name}
                  </Link>
                )}
              </li>
            </React.Fragment>
          ))}
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{categoryName}</h1>
        {category.description && (
          <p className="text-gray-600">{category.description}</p>
        )}
      </div>

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {t("category.subcategories", "Subcategories")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {subcategories.map((subcat) => (
              <Link
                key={subcat.id}
                to={`/category/${subcat.slug}`}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center text-center"
              >
                <span className="font-medium">
                  {isRtl
                    ? subcat.name_ar || subcat.name
                    : subcat.name_en || subcat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      <ProductGrid
        products={categoryProducts}
        title={t("category.products", "Products")}
        showFilters={true}
        showSorting={true}
        showViewToggle={true}
        showSearch={true}
        columns={3}
      />
    </div>
  );
};

export default CategoryPage;
