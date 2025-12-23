import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout() {
  // layout หลักของฝั่ง user ทั่วไป ใช้ครอบทุกหน้าที่ไม่ใช่ /admin
  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a1a] text-white">
      {/* Navbar */}
      <Navbar />
      {/* แสดง Navbar ด้านบนทุกหน้าใน layout นี้ */}

      {/* เนื้อหาหน้า */}
      <main className="flex-1">
        <Outlet />
        {/* Outlet = จุดที่ React Router เอา component ของ route ลูกมา render */}
        {/* เช่น /products, /search, /keys จะถูกแสดงแทนที่ Outlet ตาม path ปัจจุบัน */}
      </main>

      {/* Footer — จะติดล่างเสมอ */}
      <Footer />
      {/* แสดง Footer ด้านล่างทุกหน้าใน layout นี้ */}
    </div>
  );
}
