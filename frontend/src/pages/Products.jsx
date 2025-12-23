// src/pages/Products.jsx
import { useEffect, useState } from "react";
import ProductGrid from "../components/ProductGrid";
import api from "../lib/api"; // axios.instance

export default function Products() {
  // state เก็บ list สินค้าจาก backend
  const [products, setProducts] = useState([]);
  // flag.บอกสถานะกำลังโหลด
  const [loading, setLoading] = useState(true);
  // เก็บข้อความ error ถ้าโหลดไม่สำเร็จ
  const [error, setError] = useState("");

  // โหลดจาก backend ครั้งแรก
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/product/getall"); // ดึงสินค้าทั้งหมด
        // backend ส่ง { error, data, message } เอา data เป็น list สินค้า
        setProducts(res.data.data || []);
      } catch (err) {
        console.error(err);
        setError("โหลดข้อมูลสินค้าทั้งหมดไม่สำเร็จ");
      } finally {
        // ไม่ว่าจะสำเร็จหรือ error ให้ปิดสถานะ loading
        setLoading(false);
      }
    };

    // เรียกฟังก์ชันโหลดตอน component.mount ครั้งแรก
    load();
  }, []);

  // ระหว่างกำลังโหลด แสดงข้อความ loading แทนเนื้อหาหลัก
  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-6.py-10 text-white">
        กำลังโหลดสินค้า...
      </main>
    );
  }

  // ถ้าโหลดเสร็จแต่มี error ให้แสดงข้อความ error
  if (error) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-10 text-red-400">
        {error}
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 text.white">
      <h1 className="text-3xl font-bold mb-6 text-center">สินค้าทั้งหมด</h1>

      {/* กริดสินค้า (ใช้ products ตรง ๆ ไม่มี filter แล้ว) */}
      <ProductGrid
        // ถ้ามีสินค้าอย่างน้อย 1 ชิ้น แสดงหัวข้อ "รายการสินค้า" ไม่งั้นโชว์ "ยังไม่มีสินค้า"
        title={products.length ? "รายการสินค้า" : "ยังไม่มีสินค้า"}
        // ส่ง array products ทั้งก้อนให้ ProductGrid ไป map เป็นการ์ด
        items={products}
        // ไม่ต้องแสดงปุ่ม "ดูทั้งหมด" ใน ProductGrid อีก เพราะหน้า.นี้คือหน้าทั้งหมดอยู่แล้ว
        showAllButton={false}
      />
    </main>
  );
}
