import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import { RequireAdmin } from "./lib/guards";

import Home from "./pages/Home";
import Search from "./pages/Search";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import AboutUs from "./pages/AboutUs";
import Login from "./pages/Login";
import MyKeys from "./pages/MyKeys";
import Cart from "./pages/Cart";
import HowToPay from "./pages/HowToPay";
import QRPromptPay from "./pages/QRPromptPay";
import ErrorPayment from "./pages/ErrorPayment";
import CreditCardPayment from "./pages/CreditCardPayment";
import ThankYou from "./pages/ThankYou";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminProducts from "./pages/Admin/Products";
import AdminUsers from "./pages/Admin/Users";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/products" element={<Products />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/keys" element={<MyKeys />} />
          <Route path="cart" element={<Cart />} />
          <Route path="/how-to-pay" element={<HowToPay />} />
          <Route path="/checkout/qr" element={<QRPromptPay />} />
          <Route path="/ErrorPayment" element={<ErrorPayment />} />
          <Route path="/credit-card" element={<CreditCardPayment />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Admin/Products" element={<AdminProducts />} />
          <Route path="/Admin/Users" element={<AdminUsers />} />
        </Route>


      </Routes>
    </BrowserRouter>
  );
}
