import React from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRtl } from "../contexts/RtlContext";

// Components
import Header from "../shared/components/Header";
import Footer from "../shared/components/Footer";

const MainLayout: React.FC = () => {
  const { t } = useTranslation();
  const { direction, language } = useRtl();

  return (
    <div className="flex min-h-screen flex-col bg-white" dir={direction}>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
