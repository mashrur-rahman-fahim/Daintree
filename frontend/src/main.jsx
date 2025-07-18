import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./global-animations.css";
import App from "./App.jsx";
import { CartProvider } from "./context/CartProvider.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </AuthProvider>
);
