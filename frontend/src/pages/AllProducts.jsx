// src/pages/AllProducts.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductGrid from "../components/ProductGrid";
import useRequireAuthAction from "../lib/useRequireAuthAction";
import api from "../lib/api";

export default function AllProducts() {
  const nav = useNavigate();                  // hook เปลี่ยนหน้า
  const requireAuth = useRequireAuthAction(); // hook สำหรับ guard action ว่าต้องล็อกอินก่อน

  const [items, setItems] = useState([]);     // รายการสินค้าในหน้า (หลัง map แล้ว)
  const [loading, setLoading] = useState(true); // flag โหลดข้อมูลอยู่
  const [error, setError] = useState("");       // เก็บ message error ถ้ามีปัญหาโหลด

  useEffect(() => {
    // effect โหลดรายการสินค้าจาก backend ครั้งแรกตอน mount
    const loadProducts = async () => {
      try {
        // เรียก backend: GET /api/product/getall
        const res = await api.get("/product/getall");
        // server ฝั่งโซลออกแบบให้ตอบ { error, data, message }
        const rows = res.data.data || [];

        // map ให้ตรงกับโครงที่ ProductGrid ใช้
        const mapped = rows.map((p) => ({
          id: p.ProID,
          image: p.Pro_Image,
          name: p.Pro_Name,
          price: `฿${p.Pro_Price}`,
          // ตรงนี้คือการเตรียม shape ข้อมูลสำหรับส่งลง ProductGrid (และ ProductCard)
          // โครงสร้างต้องแมตช์กับ component ปลายทางที่หยิบไปใช้
        }));

        setItems(mapped);      // เซ็ต state items ให้เอาไปแสดงในหน้าได้
      } catch (err) {
        console.error(err);
        setError("โหลดรายการสินค้าไม่สำเร็จ");
      } finally {
        setLoading(false);     // ไม่ว่า success หรือ fail ก็หยุดสถานะ loading
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    // ระหว่างกำลังโหลดให้แสดงข้อความแทน content จริง
    return (
      <section className="max-w-7xl mx-auto px-6 py-10">
        <p>กำลังโหลดสินค้า...</p>
      </section>
    );
  }

  if (error) {
    // ถ้าโหลด fail ให้แสดงข้อความ error แทน
    return (
      <section className="max-w-7xl mx-auto px-6 py-10">
        <p className="text-red-400">{error}</p>
      </section>
    );
  }

  // case ปกติ: โหลดสำเร็จ แสดง header + ProductGrid + ปุ่มซื้อรวม
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">สินค้าทั้งหมด</h1>
        <div className="text-sm text-gray-500">
          ทั้งหมด {items.length} รายการ
          {/* แสดงจำนวนสินค้าที่โหลดมาได้ทั้งหมด */}
        </div>
      </div>

      {/* ส่งข้อมูลสินค้าให้ ProductGrid ไปจัดการ render การ์ด */}
      <ProductGrid title="" items={items} />

      {/* ปุ่มซื้อรวม บังคับ login เหมือนเดิม */}
      <div className="mt-6">
        <button
          className="px-4 py-2 rounded bg-teal-600 text-white"
          onClick={() =>
            requireAuth(() => {
              // action ที่ต้องล็อกอินก่อนถึงจะรันได้
              // ตอนนี้ยังเป็น mock เฉย ๆ ยังไม่ได้สร้าง order จริง
              alert("เพิ่มลงตะกร้าจำนวนมาก (mock)");
            })
          }
        >
          ซื้อรวม (ตัวอย่าง)
        </button>
      </div>
    </section>
  );
}
