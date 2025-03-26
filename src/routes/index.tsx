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
import CreatePage from "../cms/pages/CreatePage";
import EditPage from "../cms/pages/EditPage";
import ViewPage from "../cms/pages/ViewPage";

// Add new route for Ad Management
const AdManagementPage = () => (
  <div className="container mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold mb-6">Ad Zone Management</h1>
    <p className="text-gray-600 mb-8">
      Manage your ad zones and advertisements across the site.
    </p>
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <p className="text-center text-gray-500">
        Ad management interface will be implemented here.
      </p>
    </div>
  </div>
);

// Add new route for Menu Builder
const MenuBuilderPage = () => (
  <div className="container mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold mb-6">Menu Builder</h1>
    <p className="text-gray-600 mb-8">
      Create and manage navigation menus for your site.
    </p>
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <p className="text-center text-gray-500">
        Menu builder interface will be implemented here.
      </p>
    </div>
  </div>
);

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
        path: "cms/ads",
        element: <AdManagementPage />,
      },
      {
        path: "cms/menus",
        element: <MenuBuilderPage />,
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
