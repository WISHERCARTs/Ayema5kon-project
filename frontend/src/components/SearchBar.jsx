// src/components/SearchBar.jsx
import { useEffect, useState } from "react";
import api from "../lib/api";

export default function SearchBar({ value, onChange, onSubmit }) {
  // value: object เก็บค่าฟิลเตอร์ทั้งหมด (q, category, minPrice, maxPrice)
  // onChange: callback ให้ parent อัปเดต state ฟิลเตอร์
  // onSubmit: callback ให้ parent ยิงคำค้นจริง (เช่น call /search)

  const [categories, setCategories] = useState([]);    // เก็บ list หมวดหมู่จาก backend
  const [loadingCat, setLoadingCat] = useState(true);  // flag โหลดหมวดหมู่
  const [catError, setCatError] = useState("");        // เก็บ error ถ้าโหลดหมวดหมู่ fail

  // helper สำหรับอัปเดต state ฟิลเตอร์
  const set = (k, v) => onChange({ ...value, [k]: v });
  // เวลาเรียก set("q", "abc") -> มันจะ merge value เดิม แล้วเปลี่ยนแค่ field q

  // โหลดหมวดหมู่จาก backend แทน mockCategories.json
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get("/category/getall");
        // backend ควรส่ง { error, data, message }
        setCategories(res.data?.data || []); // เก็บ data (array ของหมวดหมู่) ลง state
      } catch (err) {
        console.error(err);
        setCatError("โหลดหมวดหมู่ไม่สำเร็จ"); // ถ้า error ให้เก็บข้อความ error ไว้
      } finally {
        setLoadingCat(false); // ไม่ว่าจะ success หรือ fail หยุดสถานะ loading
      }
    };

    loadCategories(); // เรียกโหลดครั้งเดียวตอน mount
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();  // กัน form ส่งแบบ default (reload หน้า)
        onSubmit?.();        // ถ้า parent ส่ง onSubmit มาให้ เรียกมัน (ไว้ยิง API search จริง)
      }}
      className="text-black bg-sky-800 rounded-xl p-4 shadow mb-6 grid sm:grid-cols-2 lg:grid-cols-6 gap-3"
    >
      {/* คำค้นชื่อเกม */}
      <input
        className="bg-white border rounded px-3 py-2 col-span-2 lg:col-span-2"
        placeholder="Search"
        value={value.q || ""}                  // ผูกค่ากับ value.q
        onChange={(e) => set("q", e.target.value)} // เปลี่ยน q ผ่าน helper set
      />

      {/* หมวด = CatID (number) จาก DB */}
      <select
        className="bg-white border rounded px-3 py-2"
        value={value.category || ""}                     // ผูกค่ากับ value.category
        onChange={(e) => set("category", e.target.value)}// เวลาเลือกหมวดใหม่ ก็อัปเดต field category
        disabled={loadingCat || !!catError}              // ถ้ายังโหลด หรือ error -> disable dropdown
      >
        <option value=" ">
          ALL
        </option>

        {!loadingCat &&
          !catError &&
          categories.map((c) => (
            // สร้าง option จากหมวดหมู่ที่โหลดมาจาก backend
            <option key={c.CatID} value={String(c.CatID)}>
              {c.Cat_Name}
            </option>
          ))}
      </select>

      {/* ราคา */}
      <input
        className="bg-white border rounded px-3 py-2"
        type="number"
        placeholder="Min ฿"
        value={value.minPrice || ""}                   // ผูกค่าขั้นต่ำ
        onChange={(e) => set("minPrice", e.target.value)} // อัปเดต minPrice ใน filter
      />
      <input
        className="bg-white border rounded px-3 py-2"
        type="number"
        placeholder="Max ฿"
        value={value.maxPrice || ""}                   // ผูกค่าสูงสุด
        onChange={(e) => set("maxPrice", e.target.value)} // อัปเดต maxPrice ใน filter
      />

      {/* ปุ่มค้นหา */}
      <button className="bg-gray-300 text-black rounded px-4 py-2 lg:col-span-1 hover:brightness-95">
        ค้นหา
        {/* กดแล้วจะไปเข้า onSubmit ของ form ด้านบน -> call onSubmit จาก parent */}
      </button>
    </form>
  );
}
