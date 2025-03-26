import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMenus } from "../../../contexts/MenuContext";

interface MenuItem {
  id: string;
  title: string;
  url: string;
  target?: string;
  parent_id: string | null;
  order: number;
  children?: MenuItem[];
}

const FooterNav: React.FC = () => {
  const { t } = useTranslation();
  const { menus, loading } = useMenus();

  // Get the footer navigation menu
  const footerMenu = menus["footer-nav"];

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4">
        <div className="space-y-3">
          <div className="h-5 w-24 animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
        </div>
        <div className="space-y-3">
          <div className="h-5 w-24 animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (!footerMenu || !footerMenu.items || footerMenu.items.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <h3 className="text-lg font-semibold">{t("quickLinks")}</h3>
          <ul className="mt-4 space-y-2">
            <li>
              <Link to="/" className="text-sm text-gray-600 hover:text-primary">
                {t("home")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  // Group menu items by parent (for footer columns)
  // Top level items (without parent) will be column headers
  const topLevelItems = footerMenu.items
    .filter((item) => !item.parent_id)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {topLevelItems.map((column) => {
        // Find children for this column
        const columnItems = footerMenu.items
          .filter((item) => item.parent_id === column.id)
          .sort((a, b) => a.order - b.order);

        return (
          <div key={column.id} className="space-y-4">
            <h3 className="text-lg font-semibold">{column.title}</h3>
            {columnItems.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {columnItems.map((item) => (
                  <li key={item.id}>
                    {item.url.startsWith("/") ? (
                      <Link
                        to={item.url}
                        className="text-sm text-gray-600 hover:text-primary"
                        target={item.target || "_self"}
                      >
                        {item.title}
                      </Link>
                    ) : (
                      <a
                        href={item.url}
                        className="text-sm text-gray-600 hover:text-primary"
                        target={item.target || "_self"}
                        rel={
                          item.target === "_blank"
                            ? "noopener noreferrer"
                            : undefined
                        }
                      >
                        {item.title}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              // If the column has no children, make the column header a link
              <div className="mt-4">
                {column.url.startsWith("/") ? (
                  <Link
                    to={column.url}
                    className="text-sm text-gray-600 hover:text-primary"
                    target={column.target || "_self"}
                  >
                    {t("viewMore")}
                  </Link>
                ) : (
                  <a
                    href={column.url}
                    className="text-sm text-gray-600 hover:text-primary"
                    target={column.target || "_self"}
                    rel={
                      column.target === "_blank"
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    {t("viewMore")}
                  </a>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FooterNav;
