import React from "react";
import { Link, useRouteError } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NotFoundPage: React.FC = () => {
  const error = useRouteError() as any;
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-semibold mt-4 mb-6">
          {t("common.pageNotFound")}
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          {error?.statusText ||
            error?.message ||
            t("common.pageNotFoundMessage")}
        </p>
        <Link
          to="/"
          className="inline-block bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          {t("common.backToHome")}
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
