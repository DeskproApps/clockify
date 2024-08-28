import React from "react";
import ReactDOM from "react-dom/client";
import "./main.css";
import App from "./App";
import { DeskproAppProvider } from "@deskpro/app-sdk";
import "simplebar/dist/simplebar.min.css";
import { Scrollbar } from "@deskpro/deskpro-ui";

const root = ReactDOM.createRoot(document.getElementById("root") as Element);
root.render(
  <React.StrictMode>
    <Scrollbar style={{ height: "100%", width: "100%" }}>
      <DeskproAppProvider>
        <App />
      </DeskproAppProvider>
    </Scrollbar>
  </React.StrictMode>
);
