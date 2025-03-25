import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RtlProvider } from "./contexts/RtlContext";
import Routes from "./routes";
import "./i18n";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RtlProvider>
      <Routes />
    </RtlProvider>
  </React.StrictMode>,
);
