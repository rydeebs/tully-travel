import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/fonts";
import "./styles/tokens.css";
import "./styles/components.css";
import "./styles/app.css";
import "./styles/dashboard.css";
import "./styles/dash-overview-crm.css";
import "./styles/dash-erp-finance.css";
import "./styles/dash-agents.css";
import "./styles/dash-backbone.css";
import { App } from "./App";

const rootElement = document.getElementById("root");

if (rootElement === null) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
