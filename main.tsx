import React from "react";
import { createRoot } from "react-dom/client";
import Root from "./src/Root";
import "./src/index.css";

const container = document.getElementById("root");
if (!container) throw new Error("Root container #root not found");

createRoot(container).render(<Root />);
