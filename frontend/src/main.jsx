import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { AuthProvider } from "./lib/auth";      // มี context ผู้ใช้
import { CartProvider } from "./lib/cart";      // มี context ตะกร้า
import AppRouter from "./router";               // มี BrowserRouter ข้างใน

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <AppRouter />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
