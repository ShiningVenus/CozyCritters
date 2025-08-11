import React from "react";
import { createRoot } from "react-dom/client";
import { Router as WouterRouter } from "wouter";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WouterRouter base={import.meta.env.BASE_URL}>
      <App />
    </WouterRouter>
  </React.StrictMode>
);
