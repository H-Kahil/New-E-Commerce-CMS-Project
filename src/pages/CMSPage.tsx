import React from "react";
import { Navigate } from "react-router-dom";

// This component now just redirects to the new CMS dashboard
const CMSPage: React.FC<{ edit?: boolean; create?: boolean }> = ({
  edit,
  create,
}) => {
  // If it's a create request, redirect to the new create page
  if (create) {
    return <Navigate to="/cms/pages/create" replace />;
  }

  // If it's an edit request, we can't redirect properly without the slug
  // So we'll just redirect to the pages list
  if (edit) {
    return <Navigate to="/cms/pages" replace />;
  }

  // Default redirect to the CMS dashboard
  return <Navigate to="/cms" replace />;
};

export default CMSPage;
