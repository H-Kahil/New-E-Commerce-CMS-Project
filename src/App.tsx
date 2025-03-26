import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import routes from "tempo-routes";
import MainLayout from "./layouts/MainLayout";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductPage from "./pages/ProductPage";
import CategoryPage from "./pages/CategoryPage";
import CollectionPage from "./pages/CollectionPage";
import NotFoundPage from "./pages/NotFoundPage";

// Import new CMS modules
import CMSDashboard from "./cms/pages/CMSDashboard";
import PagesModule from "./cms/pages/PagesModule";
import CreatePage from "./cms/pages/CreatePage";
import EditPage from "./cms/pages/EditPage";
import ViewPage from "./cms/pages/ViewPage";
import ProductsModule from "./cms/pages/ProductsModule";
import CreateProduct from "./cms/pages/CreateProduct";
import EditProduct from "./cms/pages/EditProduct";
import ViewProduct from "./cms/pages/ViewProduct";
import AdsModule from "./cms/pages/AdsModule";
import MenusModule from "./cms/pages/MenusModule";

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

          {/* CMS routes */}
          <Route path="cms" element={<CMSDashboard />} />
          <Route path="cms/dashboard" element={<CMSDashboard />} />

          {/* Pages module */}
          <Route path="cms/pages" element={<PagesModule />} />
          <Route path="cms/pages/create" element={<CreatePage />} />
          <Route path="cms/pages/edit/:slug" element={<EditPage />} />
          <Route path="cms/pages/view/:slug" element={<ViewPage />} />

          {/* Products module */}
          <Route path="cms/products" element={<ProductsModule />} />
          <Route path="cms/products/create" element={<CreateProduct />} />
          <Route path="cms/products/edit/:id" element={<EditProduct />} />
          <Route path="cms/products/view/:id" element={<ViewProduct />} />

          {/* Ads module */}
          <Route path="cms/ads" element={<AdsModule />} />

          {/* Menus module */}
          <Route path="cms/menus" element={<MenusModule />} />

          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
          <Route path="cart" element={<div>Cart Page</div>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
