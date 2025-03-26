import React, { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { cms } from "../services/supabase";

interface MenuItem {
  id: string;
  title: string;
  url: string;
  target?: string;
  parent_id: string | null;
  order: number;
  children?: MenuItem[];
}

interface Menu {
  id: string;
  title: string;
  location: string;
  items: MenuItem[];
}

interface MenuContextType {
  menus: Record<string, Menu>;
  loading: boolean;
  error: Error | null;
  refreshMenus: () => Promise<void>;
}

const MenuContext = createContext<MenuContextType>({
  menus: {},
  loading: true,
  error: null,
  refreshMenus: async () => {},
});

export const useMenus = () => useContext(MenuContext);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [menus, setMenus] = useState<Record<string, Menu>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { i18n } = useTranslation();

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const { data, error } = await cms.getMenus(i18n.language);

      if (error) {
        throw new Error(`Error fetching menus: ${error.message}`);
      }

      if (data) {
        // Convert array to object with location as key for easier access
        const menusMap = data.reduce(
          (acc: Record<string, Menu>, menu: Menu) => {
            acc[menu.location] = menu;
            return acc;
          },
          {},
        );

        setMenus(menusMap);
      }
    } catch (err) {
      console.error("Error in MenuContext:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, [i18n.language]);

  const refreshMenus = async () => {
    await fetchMenus();
  };

  return (
    <MenuContext.Provider value={{ menus, loading, error, refreshMenus }}>
      {children}
    </MenuContext.Provider>
  );
};

export default MenuContext;
