// src/pages/Home.jsx
import { useEffect, useState, useMemo } from "react";
import HeroSection from "../components/HeroSection";
import ProductGrid from "../components/ProductGrid";
import api from "../lib/api";

export default function Home() {
  // เก็บสินค้าทั้งหมดที่โหลดมาจาก backend
  const [products, setProducts] = useState([]);
  // flag บอกว่ากำลังโหลดข้อมูลอยู่
  const [loading, setLoading] = useState(true);
  // เก็บข้อความ error ถ้าโหลดไม่สำเร็จ
  const [error, setError] = useState("");

  // โหลดสินค้าจาก backend
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/product/getall");
        // backend ส่ง { error, data, message } มา ใช้ data เป็น list สินค้า
        const rows = res.data?.data || [];
        setProducts(rows);          // เซ็ตสินค้าลง state
      } catch (err) {
        console.error(err);
        setError("โหลดสินค้าไม่สำเร็จ");
      } finally {
        setLoading(false);          // ไม่ว่าจะสำเร็จหรือพังก็หยุดสถานะ loading
      }
    };

    // เรียกโหลดสินค้าครั้งแรกตอน component mount
    load();
  }, []);

  // เกมแนะนำ = สินค้าที่ active เอา 4 ตัวแรก
  const featured = useMemo(() => {
    // filter เอาเฉพาะสินค้า Pro_Status = "active" (เทียบแบบตัวเล็ก)
    const actives = products.filter(
      (p) => String(p.Pro_Status || "").toLowerCase() === "active"
    );
    // ตัดมาแค่ 4 ชิ้นแรกไว้โชว์เป็น “สินค้าแนะนำ”
    return actives.slice(0, 4);
  }, [products]);

  // สินค้าใหม่ = sort ProID จากมากไปน้อย แล้วเอา 4 ตัวแรก
  const newArrivals = useMemo(() => {
    // สร้าง array ใหม่จาก products แล้ว sort ตาม ProID (มากไปน้อย)
    const sorted = [...products].sort(
      (a, b) => Number(b.ProID || 0) - Number(a.ProID || 0)
    );
    // ตัด 4 ตัวแรกไว้โชว์เป็น “สินค้าใหม่”
    return sorted.slice(0, 4);
  }, [products]);

  return (
    <main className="min-h-screen text-white">
      {/* ส่วน Hero ด้านบนสุดของหน้า */}
      <HeroSection />

      <section className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {loading && (
          // ถ้ายังโหลดไม่เสร็จ แสดงข้อความกำลังโหลด
          <p className="text-center text-sm text-gray-300">
            กำลังโหลดสินค้า...
          </p>
        )}

        {error && !loading && (
          // ถ้าโหลดเสร็จแล้วแต่มี error แสดงข้อความ error
          <p className="text-center text-sm text-red-400">{error}</p>
        )}

        {/* เกมแนะนำ */}
        {/* แสดง ProductGrid สองชุดเมื่อโหลดสำเร็จและไม่มี error */}
        {!loading && !error && (
          <>
            {/* ส่งสินค้าที่ filter ว่า active เป็น section “สินค้าแนะนำ” */}
            <ProductGrid title="สินค้าแนะนำ" items={featured} />
            {/* ส่งสินค้าที่ sort ตาม ProID เป็น section “สินค้าใหม่” */}
            <ProductGrid title="สินค้าใหม่" items={newArrivals} />
          </>
        )}
      </section>
    </main>
  );
}
