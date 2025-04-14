import React from "react";
import ReactDOM from "react-dom/client";
import { applyThreePatches } from "./utils/threePatches";

import App from "./App";
import "./index.css";

// Apply compatibility patches for Three.js
applyThreePatches();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
