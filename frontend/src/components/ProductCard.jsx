// การ์ดสินค้า 1 ใบ
// src/components/ProductCard.jsx
import { Link } from "react-router-dom";

export default function ProductCard({ item }) {
  // รับ prop item ซึ่งคือ object สินค้า 1 ชิ้นจาก parent (เช่น product list)
  return (
    <Link to={`/product/${item.ProID}`} className="block">
      {/* คลิกการ์ดแล้วจะนำไปหน้า detail ของสินค้าตาม ProID (/product/:id) */}
      <div className="bg-gray-100 rounded-xl overflow-hidden shadow hover:scale-105 transition">
        <img
          src={item.Pro_Image}
          alt={item.Pro_Name}
          className="w-full h-36 object-cover rounded-xl p-0.5"
        />
        {/* ใช้ Pro_Image เป็นรูปของสินค้า และ Pro_Name เป็น alt text */}

        <div className="p-3 text-center pt-8 pb-8">
          <h3 className="font-medium text-gray-800 line-clamp-1">
            {item.Pro_Name}
            {/* แสดงชื่อสินค้า จาก field Pro_Name */}
          </h3>
          <p className="text-gray-600 text-sm">
            ฿{item.Pro_Price}
            {/* แสดงราคาสินค้า จาก field Pro_Price */}
          </p>
        </div>
      </div>
    </Link>
  );
}
