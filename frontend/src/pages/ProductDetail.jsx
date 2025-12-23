// src/pages/ProductDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useCart } from "../lib/cart";
import { useAuth } from "../lib/auth";
import api from "../lib/api";

export default function ProductDetail() {
  const { id } = useParams(); // "/product/:id" ดึงค่า id จาก path param
  const nav = useNavigate();
  const { add } = useCart();  // ฟังก์ชันเพิ่มสินค้าเข้า cart
  const { user } = useAuth(); // ใช้เช็ก role ตอนจะซื้อ

  const [product, setProduct] = useState(null); // เก็บข้อมูลสินค้าที่โหลดมา
  const [loading, setLoading] = useState(true); // flag กำลังโหลด
  const [error, setError] = useState("");       // ข้อความ error เวลาโหลด fail

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await api.get(`/product/getinfo/${id}`); // ยิงไป backend ขอข้อมูลรายตัว
        console.log("product detail:", res.data);
        setProduct(res.data.data || null);                  // เก็บ product ถ้าไม่มีให้เป็น null
        // console.log(product.Pro_Name)
      } catch (err) {
        console.error(err);
        setError("โหลดข้อมูลสินค้าไม่สำเร็จ");            // เก็บ error ไว้โชว์หน้า UI
      } finally {
        setLoading(false);                                  // เลิกสถานะกำลังโหลดแล้ว
      }
    };

    loadProduct();
  }, [id]); // ถ้า id ใน URL เปลี่ยนจะโหลดสินค้าตัวใหม่

  // ยังโหลดอยู่ แสดงข้อความกำลังโหลด
  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-8 text-white">
        กำลังโหลดสินค้า...
      </section>
    );
  }

  // โหลดเสร็จแล้วแต่ error
  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-8 text-white">
        <p className="text-red-400">{error}</p>
      </section>
    );
  }

  // ไม่มี product กลับมาจาก backend
  if (!product) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-8 text-white">
        ไม่พบสินค้า
      </section>
    );
  }

  // กดปุ่มซื้อ / เพิ่มตะกร้า
  const handleBuy = () => {
    // ถ้ายังเป็น guest บังคับให้ไป login ก่อน แล้วกลับมาหน้านี้ทีหลัง
    if (user.role === "guest") {
      nav(`/login`, { state: { from: `/product/${product.ProID}` } });
      return;
    }

    // ถ้าล็อกอินแล้ว เพิ่มสินค้าตัวนี้เข้า cart 1 ชิ้น
    add(
      {
        id: product.ProID,
        name: product.Pro_Name,
        price: product.Pro_Price,
        image: product.Pro_Image,
      },
      1
    );
    // แล้วพาไปหน้าตะกร้า
    nav("/cart");
  };

  return (
    <section className="max-w-7xl mx-auto mt-20 px-6 py-8 text-white">
      {/* ------------- ส่วนบน: รูป + ข้อมูลสั้น ------------- */}
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <img
          src={product.Pro_Image}
          alt={product.Pro_Name}
          className="w-full rounded-lg shadow-xl"
        />

        <div>
          {/* ชื่อเกม */}
          <h1 className="text-2xl font-semibold mb-2">{product.Pro_Name}</h1>
          {/* ราคา */}
          <p className="text-teal-300 font-bold text-xl mb-4">
            ฿{product.Pro_Price}
          </p>

          {/* summary สั้น ๆ ใต้ชื่อ (จะใช้คำเดียวกับ description ก็ได้) */}
          <p className="text-white/80 mb-6">
            {product.Pro_Description || "ยังไม่มีรายละเอียดสำหรับเกมนี้"}
          </p>

          {/* ปุ่มซื้อ + ปุ่มย้อนกลับ */}
          <div className="flex gap-3">
            <button
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
              onClick={handleBuy}
            >
              ซื้อ / เพิ่มตะกร้า
            </button>
            <button
              onClick={() => nav(-1)} // ย้อนกลับไปหน้าก่อนหน้าใน history
              className="border px-4 py-2 rounded"
            >
              ย้อนกลับ
            </button>
          </div>
        </div>
      </div>

      {/* ------------- ส่วนล่าง: กล่องรายละเอียดเกม (เต็มกว้าง) ------------- */}
      <div className="mt-10 bg-gray-600/30 rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-4">รายละเอียดเกม</h2>

        {/* รายละเอียดหลักจาก Pro_Description */}
        <p className="text-white/80 whitespace-pre-line mb-4">
          {product.Pro_Description || "ยังไม่มีรายละเอียดสำหรับเกมนี้"}
        </p>

        {/* ข้อมูลเพิ่มเติมของเกม */}
        <div className="grid sm:grid-cols-2 gap-2 text-sm md:text-base">
          <p>
            <span className="text-white/60">แพลตฟอร์ม: </span>
            {product.Pro_Platform || "-"}
          </p>
          <p>
            <span className="text-white/60">ผู้พัฒนา (Developer): </span>
            {product.Pro_Developer || "-"}
          </p>
          <p>
            <span className="text-white/60">ผู้จัดจำหน่าย (Publisher): </span>
            {product.Pro_Publisher || "-"}
          </p>
          <p>
            <span className="text-white/60">ราคา: </span>
            {product.Pro_Price != null ? `฿${product.Pro_Price}` : "-"}
          </p>
        </div>
      </div>
    </section>
  );
}
