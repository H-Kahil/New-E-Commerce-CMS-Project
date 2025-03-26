import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface ProductFiltersProps {
  onFilterChange: (filters: ProductFilters) => void;
  categories?: any[];
}

export interface ProductFilters {
  search: string;
  category: string;
  stockStatus: string;
  priceRange: string;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  onFilterChange,
  categories = [],
}) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    category: "all",
    stockStatus: "all",
    priceRange: "all",
  });

  const handleFilterChange = (key: keyof ProductFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const resetValues = {
      search: "",
      category: "all",
      stockStatus: "all",
      priceRange: "all",
    };
    setFilters(resetValues);
    onFilterChange(resetValues);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <div className="relative">
            <Input
              placeholder={t(
                "cms.products.searchPlaceholder",
                "Search products...",
              )}
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-9"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div>
          <Select
            value={filters.category}
            onValueChange={(value) => handleFilterChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={t("cms.products.categoryFilter", "All Categories")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("cms.products.allCategories", "All Categories")}
              </SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            value={filters.stockStatus}
            onValueChange={(value) => handleFilterChange("stockStatus", value)}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={t("cms.products.stockFilter", "Stock Status")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("cms.products.allStock", "All Stock")}
              </SelectItem>
              <SelectItem value="instock">
                {t("cms.products.inStock", "In Stock")}
              </SelectItem>
              <SelectItem value="lowstock">
                {t("cms.products.lowStock", "Low Stock")}
              </SelectItem>
              <SelectItem value="outofstock">
                {t("cms.products.outOfStock", "Out of Stock")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            value={filters.priceRange}
            onValueChange={(value) => handleFilterChange("priceRange", value)}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={t("cms.products.priceFilter", "Price Range")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("cms.products.allPrices", "All Prices")}
              </SelectItem>
              <SelectItem value="under25">
                {t("cms.products.under", "Under")} $25
              </SelectItem>
              <SelectItem value="25to50">$25 - $50</SelectItem>
              <SelectItem value="50to100">$50 - $100</SelectItem>
              <SelectItem value="over100">
                {t("cms.products.over", "Over")} $100
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {(filters.search ||
        filters.category ||
        filters.stockStatus ||
        filters.priceRange) && (
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={resetFilters}>
            <X className="mr-2 h-4 w-4" />
            {t("cms.products.resetFilters", "Reset Filters")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
