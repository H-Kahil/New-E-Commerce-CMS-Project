import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMenus } from "../../../contexts/MenuContext";
import { cn } from "../../../lib/utils";

interface MenuItem {
  id: string;
  title: string;
  url: string;
  target?: string;
  parent_id: string | null;
  order: number;
  children?: MenuItem[];
}

const MainNav: React.FC = () => {
  const { t } = useTranslation();
  const { menus, loading } = useMenus();

  // Get the main navigation menu
  const mainMenu = menus["main-nav"];

  if (loading) {
    return (
      <nav className="flex items-center space-x-4">
        <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
        <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
        <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
      </nav>
    );
  }

  if (!mainMenu || !mainMenu.items || mainMenu.items.length === 0) {
    return (
      <nav className="flex items-center space-x-4">
        <Link
          to="/"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          {t("home")}
        </Link>
      </nav>
    );
  }

  // Sort menu items by order
  const sortedItems = [...mainMenu.items].sort((a, b) => a.order - b.order);

  return (
    <nav className="flex items-center space-x-4">
      {sortedItems.map((item) => (
        <React.Fragment key={item.id}>
          {item.url.startsWith("/") ? (
            <Link
              to={item.url}
              className="text-sm font-medium transition-colors hover:text-primary"
              target={item.target || "_self"}
            >
              {item.title}
            </Link>
          ) : (
            <a
              href={item.url}
              className="text-sm font-medium transition-colors hover:text-primary"
              target={item.target || "_self"}
              rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
            >
              {item.title}
            </a>
          )}

          {/* Render dropdown for items with children */}
          {item.children && item.children.length > 0 && (
            <div className="relative group">
              <button className="flex items-center text-sm font-medium transition-colors hover:text-primary">
                {item.title}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1 h-4 w-4"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div className="absolute left-0 top-full z-10 mt-2 hidden w-48 rounded-md bg-white p-2 shadow-lg group-hover:block">
                {item.children
                  .sort((a, b) => a.order - b.order)
                  .map((child) => (
                    <div key={child.id} className="py-1">
                      {child.url.startsWith("/") ? (
                        <Link
                          to={child.url}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          target={child.target || "_self"}
                        >
                          {child.title}
                        </Link>
                      ) : (
                        <a
                          href={child.url}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          target={child.target || "_self"}
                          rel={
                            child.target === "_blank"
                              ? "noopener noreferrer"
                              : undefined
                          }
                        >
                          {child.title}
                        </a>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default MainNav;
