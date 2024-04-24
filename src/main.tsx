import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { DeskproAppProvider } from "@deskpro/app-sdk";
import "iframe-resizer/js/iframeResizer.contentWindow.js";

const root = ReactDOM.createRoot(document.getElementById("root") as Element);
root.render(
  <React.StrictMode>
    <DeskproAppProvider>
      <App />
    </DeskproAppProvider>
  </React.StrictMode>
);
