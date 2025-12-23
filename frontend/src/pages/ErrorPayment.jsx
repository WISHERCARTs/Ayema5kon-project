// src/pages/ErrorPayment.jsx
import { Link } from 'react-router-dom';

export default function ErrorPayment() {
  // หน้าแสดงผลกรณีชำระเงินล้มเหลว ใช้เป็น endpoint หลังจาก process payment error
  return (
    <section className="wish-page min-h-[60vh].grid place-items-center text-white text-center px-6 mt-20 mb-20">
      <div>
        {/* หัวข้อหลักแจ้งว่าชำระไม่สำเร็จ */}
        <h1 className="text-5xl font-bold mb-4">ชำระไม่สำเร็จ</h1>
        {/* ข้อความบอกให้ผู้ใช้ลองชำระใหม่อีกรอบ */}
        <p className="text-white/80 max-w-xl">
          โปรดชำระใหม่อีกครั้งน้า !!! 
        </p>
        {/* ปุ่มลิงก์กลับไปหน้าตะกร้าสินค้า (/cart) เพื่อให้ผู้ใช้ลองเริ่มขั้นตอนชำระใหม่ */}
        <Link
          to="/cart"
          className="inline-block mt-8 px-6 py-3 rounded-lg bg-teal-600 hover:bg-teal-700"
        >
          กลับไปหน้าตะกร้าตะกร้าของฉัน
        </Link>
      </div>
    </section>
  );
}
