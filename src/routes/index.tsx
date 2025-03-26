import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layouts
import MainLayout from "../layouts/MainLayout";

// Pages
import HomePage from "../pages/HomePage";
import ProductPage from "../pages/ProductPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CategoryPage from "../pages/CategoryPage";
import CollectionPage from "../pages/CollectionPage";
import CMSPage from "../pages/CMSPage";
import NotFoundPage from "../pages/NotFoundPage";
import CMSDashboard from "../cms/pages/CMSDashboard";

// CMS Pages
import PagesModule from "../cms/pages/PagesModule";
import ProductsModule from "../cms/pages/ProductsModule";
import CategoriesModule from "../cms/pages/CategoriesModule";
import VariantsModule from "../cms/pages/VariantsModule";
import AdsModule from "../cms/pages/AdsModule";
import MenusModule from "../cms/pages/MenusModule";
import CreateProduct from "../cms/pages/CreateProduct";
import EditProduct from "../cms/pages/EditProduct";
import ViewProduct from "../cms/pages/ViewProduct";
import CreatePage from "../cms/pages/CreatePage";
import EditPage from "../cms/pages/EditPage";
import ViewPage from "../cms/pages/ViewPage";
import ProductWizard from "../cms/pages/ProductWizard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "products/:slug",
        element: <ProductPage />,
      },
      {
        path: "product/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "category/:slug",
        element: <CategoryPage />,
      },
      {
        path: "collection/:slug",
        element: <CollectionPage />,
      },
      {
        path: "cms",
        element: <CMSDashboard />,
      },
      {
        path: "cms/pages",
        element: <PagesModule />,
      },
      {
        path: "cms/pages/create",
        element: <CreatePage />,
      },
      {
        path: "cms/pages/edit/:slug",
        element: <EditPage />,
      },
      {
        path: "cms/pages/view/:slug",
        element: <ViewPage />,
      },
      {
        path: "cms/products",
        element: <ProductsModule />,
      },
      {
        path: "cms/categories",
        element: <CategoriesModule />,
      },
      {
        path: "cms/variants",
        element: <VariantsModule />,
      },
      {
        path: "cms/products/create",
        element: <CreateProduct />,
      },
      {
        path: "cms/products/wizard",
        element: <ProductWizard />,
      },
      {
        path: "cms/products/edit/:id",
        element: <EditProduct />,
      },
      {
        path: "cms/products/view/:id",
        element: <ViewProduct />,
      },
      {
        path: "cms/ads",
        element: <AdsModule />,
      },
      {
        path: "cms/menus",
        element: <MenusModule />,
      },
      {
        path: "promotions",
        element: (
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-6">Promotions</h1>
            <p className="text-gray-600">
              Current promotions and special offers will be displayed here.
            </p>
          </div>
        ),
      },
      {
        path: "account",
        element: (
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-6">My Account</h1>
            <p className="text-gray-600">
              Account management page will be displayed here.
            </p>
          </div>
        ),
      },
      {
        path: "orders",
        element: (
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-6">My Orders</h1>
            <p className="text-gray-600">
              Order history will be displayed here.
            </p>
          </div>
        ),
      },
      {
        path: "contact",
        element: (
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
            <p className="text-gray-600">
              Contact form will be displayed here.
            </p>
          </div>
        ),
      },
    ],
  },
]);

const Routes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
