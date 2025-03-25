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
        path: "cms/page/:slug",
        element: <CMSPage />,
      },
    ],
  },
]);

const Routes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
