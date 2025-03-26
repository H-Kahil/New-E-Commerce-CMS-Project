import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import routes from "tempo-routes";
import MainLayout from "./layouts/MainLayout";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductPage from "./pages/ProductPage";
import CategoryPage from "./pages/CategoryPage";
import CollectionPage from "./pages/CollectionPage";
import CMSPage from "./pages/CMSPage";
import CMSIndexPage from "./pages/CMSIndexPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products/:slug" element={<ProductPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="category/:slug" element={<CategoryPage />} />
          <Route path="collection/:slug" element={<CollectionPage />} />
          <Route path="cms" element={<CMSIndexPage />} />
          <Route path="cms/page/:slug" element={<CMSPage />} />
          <Route path="cms/page/edit/:slug" element={<CMSPage edit={true} />} />
          <Route path="cms/ads/:id" element={<CMSPage />} />
          <Route path="cms/menus/:id" element={<CMSPage />} />
          <Route path="cart" element={<div>Cart Page</div>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
