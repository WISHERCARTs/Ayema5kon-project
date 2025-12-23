// src/pages/CreditCardPayment.jsx
import { useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useCart } from "../lib/cart";

export default function CreditCardPayment() {
  const { total } = useCart();           // ดึงยอดรวมจากตะกร้า (ใช้เป็น fallback ถ้าไม่มี amount ใน URL)
  const { search } = useLocation();      // เอา query string จาก URL มาอ่าน ?amount=...
  const nav = useNavigate();             // ใช้เปลี่ยนหน้าไป /thank-you หลัง submit

  // ถ้ามี ?amount=xxx ใน URL ก็ใช้ค่านั้น ไม่งั้นใช้ total จากตะกร้า
  const amount = useMemo(() => {
    const a = Number(new URLSearchParams(search).get("amount"));
    return Number.isFinite(a) && a > 0 ? a : total;
  }, [search, total]);

  const handleSubmit = (e) => {
    e.preventDefault();
    nav("/thank-you"); // ไปหนเา thankyou
  };

  return (
    <section className="max-w-3xl mx-auto mt-24 mb-16 px-6 py-12 text-white">
      <div className="bg-gray-800 rounded-2xl p-8 shadow-xl space-y-8">
        {/* หัวข้อบนสุด */}
        <header className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold">
            CREDIT CARD / DEBIT CARD
          </h1>
          <div className="text-xs sm:text-sm text-white/70">
            <span className="font-semibold">Username:</span>{" "}
            <span>demo_user</span>
            {/* ถ้ามี username จริงใน auth ค่อยมาเปลี่ยนทีหลัง */}
          </div>
        </header>

        {/* ฟอร์มหลัก */}
        {/* ทั้ง block ด้านล่างคือฟอร์มเก็บข้อมูลบัตรแบบ mock ยังไม่ได้เชื่อมระบบจ่ายจริง */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First / Last name */}
          {/* กล่องกรอกชื่อจริงและนามสกุลผู้ถือบัตร */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                FIRST NAME
              </label>
              <input
                type="text"
                placeholder="Enter your first name"
                className="w-full px-4 py-3 rounded-lg bg-[#dcdcdc] text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                LAST NAME
              </label>
              <input
                type="text"
                placeholder="Enter your last name"
                className="w-full px-4 py-3 rounded-lg bg-[#dcdcdc] text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          {/* Card number */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              CARD NUMBER
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="•••• •••• •••• ••••"
              className="w-full px-4 py-3 rounded-lg bg-[#dcdcdc] text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Valid until + CVV */}
          {/* แยกฝั่งซ้ายวันหมดอายุ ฝั่งขวา CVV */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                VALID UNTIL
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full px-4 py-3 rounded-lg bg-[#dcdcdc] text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">CVV</label>
              <input
                type="password"
                inputMode="numeric"
                placeholder="•••"
                maxLength={4}
                className="w-full px-4 py-3 rounded-lg bg-[#dcdcdc] text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          {/* สรุปยอด + ปุ่มจ่าย */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
            {/* แสดงยอดรวมที่ต้องชำระ ใช้ amount ที่คำนวณด้านบน */}
            <div className="text-right sm:text-left">
              <p className="text-sm text-white/70">Total:</p>
              <p className="text-2xl font-bold text-[oklch(78%_0.16_170)]">
                {amount.toFixed(2)} Baht
              </p>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 rounded-lg bg-[#05677e] hover:bg-[#088199] font-bold text-white transition"
            >
              ดำเนินการชำระเงิน
            </button>
          </div>

          {/* ลิงก์กลับตะกร้า */}
          <div className="text-sm text-white/70 pt-2">
            <Link to="/cart" className="hover:text-teal-300 underline">
              &laquo; กลับไปตะกร้าสินค้า
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
