// src/components/ProductGrid.jsx
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

export default function ProductGrid({ title, items = [], showAllButton = true }) {
  // title: ข้อความหัวข้อของ section
  // items: array ของสินค้า (ใช้ map แสดงเป็นการ์ด)
  // showAllButton: ถ้า true จะแสดงปุ่ม "ดูรายการสินค้าทั้งหมด"

  return (
    <section className="bg-[#1a1a1a] text-white py-8">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-semibold mb-4">{title}</h2>
        {/* แสดงหัวข้อ section ตาม title ที่ส่งเข้ามา */}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
          {items.map((item, i) => (
            // map สินค้าทุกชิ้นมาเป็น ProductCard
            // ใช้ ProID เป็น key ถ้ามี ถ้าไม่มี fallback เป็น index i
            <ProductCard key={item.ProID ?? i} item={item} />
          ))}
        </div>

        {showAllButton && (
          // ถ้า showAllButton เป็น true จะแสดงปุ่มลิงก์ไปหน้า /products
          <div className="text-center">
            <Link
              to="/products"
              className="bg-teal-400 hover:bg-teal-500 text-black font-medium px-6 py-2 rounded-full"
            >
              ดูรายการสินค้าทั้งหมด &gt;&gt;
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
