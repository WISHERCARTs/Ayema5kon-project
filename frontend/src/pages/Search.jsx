// src/pages/Search.jsx
import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import ProductGrid from "../components/ProductGrid";
import api from "../lib/api"; // <-- ใช้ axios instance เชื่อม backend

export default function Search() {
  // state ฟิลเตอร์ที่กำลังแก้ไขใน SearchBar (ยังไม่กดค้นหา)
  const [search, setSearch] = useState({
    q: "",
    category: "",     // จะเก็บเป็นสตริงของ CatID
    minPrice: "",
    maxPrice: "",
  });

  // state ฟิลเตอร์ที่ "ยืนยันแล้ว" (ใช้ตัวนี้ยิงไป backend)
  const [committed, setCommitted] = useState(search);

  // กดปุ่มค้นหาใน SearchBar → เอาค่าจาก search มา commit เพื่อให้ useEffect ด้านล่าง reload
  const handleSubmit = () => setCommitted(search);

  // ล้างค่าฟิลเตอร์ทั้งหมด และ commit ให้กลับเป็นค่ากลาง
  const clearSearch = () => {
    const empty = { q: "", category: "", minPrice: "", maxPrice: "" };
    setSearch(empty);
    setCommitted(empty);
  };

  // ========== โหลดสินค้าจาก backend ==========

  // รายการสินค้าที่ค้นหาได้จาก backend
  const [products, setProducts] = useState([]);
  // สถานะกำลังโหลด (ใช้โชว์ข้อความ "กำลังโหลด")
  const [loading, setLoading] = useState(true);
  // ข้อความ error ถ้าเรียก backend ล้มเหลว
  const [error, setError] = useState("");

  // ทุกครั้งที่ committed เปลี่ยน (กดค้นหา / ล้างฟิลเตอร์) ให้ยิง GET /search ใหม่
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("")
      try {
        // เรียก backend: GET /search พร้อม query params จาก committed
        const res = await api.get("/search", {
          params: {
            q: committed.q || "",
            category: committed.category || "",
            minPrice: committed.minPrice || "",
            maxPrice: committed.maxPrice || "",
          },
        });

        const rows = res.data?.data || [];
        // เก็บตรง ๆ เลย เพราะโครง ProID, Pro_Name ฯลฯ
        // มันตรงกับที่ ProductCard ใช้อยู่แล้ว :contentReference[oaicite:2]{index=2}
        setProducts(rows);
      } catch (err) {
        console.error(err);
        setError("โหลดสินค้าไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [committed]); // ใช้ committed เป็น dependency เพื่อให้ยิง API เมื่อกดค้นหาเท่านั้น

  // items ที่ส่งต่อให้ ProductGrid คือ products จาก backend ตรง ๆ
  const items = products;

  // ========== UI ==========

  // ถ้ายังโหลดอยู่ ให้โชว์ข้อความกำลังโหลดแทนเนื้อหาหลัก
  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-10 text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">ค้นหาสินค้า</h1>
        <p className="text-center">กำลังโหลดสินค้า...</p>
      </main>
    );
  }

  // ถ้าเกิด error จากการดึงข้อมูล ให้แสดงข้อความ error
  if (error) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-10 text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">ค้นหาสินค้า</h1>
        <p className="text-center text-red-400">{error}</p>
      </main>
    );
  }

  // หน้าปกติ: แสดง SearchBar + ปุ่มล้างฟิลเตอร์ + ProductGrid ที่ใช้ผลลัพธ์จาก backend
  return (
    <main className="max-w-7xl mx-auto px-6 py-10 text.white">
      <h1 className="text-3xl font-bold mb-6 text-center">ค้นหาสินค้า</h1>

      {/* ส่ง state search + setter + callback onSubmit ให้ SearchBar */}
      <SearchBar value={search} onChange={setSearch} onSubmit={handleSubmit} />

      <div className="text-right mb-6">
        <button
          onClick={clearSearch}
          className="text-sm text-teal-400 hover:text-teal-300 underline"
        >
          ล้างค่าการค้นหา
        </button>
      </div>

      {/* แสดงผลลัพธ์การค้นหาในรูป ProductGrid */}
      <ProductGrid
        title={items.length ? `พบ ${items.length} รายการ` : "ไม่พบสินค้าที่ตรงเงื่อนไข"}
        items={items}
        showAllButton={false}
      />
    </main>
  );
}
