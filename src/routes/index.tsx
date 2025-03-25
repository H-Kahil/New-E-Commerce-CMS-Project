import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layouts
import MainLayout from "../layouts/MainLayout";

// Pages
import HomePage from "../pages/HomePage";
import ProductPage from "../pages/ProductPage";
import CategoryPage from "../pages/CategoryPage";
import CollectionPage from "../pages/CollectionPage";
import CMSPage from "../pages/CMSPage";
import NotFoundPage from "../pages/NotFoundPage";
import CMSIndexPage from "../pages/CMSIndexPage";

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
        path: "category/:slug",
        element: <CategoryPage />,
      },
      {
        path: "collection/:slug",
        element: <CollectionPage />,
      },
      {
        path: "cms",
        element: <CMSIndexPage />,
      },
      {
        path: "cms/page/:slug",
        element: <CMSPage />,
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
