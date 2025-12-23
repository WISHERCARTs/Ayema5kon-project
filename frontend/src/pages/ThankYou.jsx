// src/pages/ThankYou.jsx
import { useEffect } from "react";
import { useCart } from "../lib/cart";
import { Link } from "react-router-dom";

export default function ThankYou() {
  const { clear } = useCart();          // ดึงฟังก์ชัน clear จาก cart context เอาไว้ล้างของในตะกร้า

  useEffect(() => { 
    clear();                            // ล้างตะกร้าทั้งหมดทันทีที่ component นี้ถูก mount (เข้าหน้านี้)
  }, []); // ล้างตะกร้าเมื่อมาถึงหน้านี้

  return (
    <section className="min-h-[60vh] grid place-items-center text-white text-center px-6 mt-20 mb-20">
      <div>
        {/* ข้อความขอบคุณหลักบนหน้า */}
        <h1 className="text-5xl font-bold mb-4">Thank you!!</h1>

        {/* ข้อความอธิบายว่าของ/คีย์จะถูกส่งไปทางอีเมล */}
        <p className="text-white/80 max-w-xl">
          Your item will be shipped soon and sent to your email, please wait and enjoy playing!!
        </p>

        {/* ปุ่มให้ผู้ใช้กลับไปหน้า Home */}
        <Link
          to="/"
          className="inline-block mt-8 px-6 py-3 rounded-lg bg-teal-600 hover:bg-teal-700"
        >
          Back to Home page
        </Link>
      </div>
    </section>
  );
}
