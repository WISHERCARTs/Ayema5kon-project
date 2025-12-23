// src/pages/Cart.jsx
import { useCart } from "../lib/cart";
import useRequireAuthAction from "../lib/useRequireAuthAction";
import { useNavigate, Link } from "react-router-dom";

export default function Cart() {
  const { items, remove, coupon, setCoupon, subtotal, discount, total } = useCart();
  // ดึงข้อมูลและฟังก์ชันเกี่ยวกับตะกร้าจาก CartContext:
  // items = รายการสินค้าที่อยู่ในตะกร้า
  // remove = ฟังก์ชันลบสินค้าออกจากตะกร้า
  // coupon/setCoupon = state โค้ดส่วนลดและตัว set
  // subtotal = ราคารวมก่อนหักส่วนลด
  // discount = จำนวนเงินส่วนลด
  // total = ราคารวมหลังหักส่วนลด

  const nav = useNavigate();
  // ใช้เปลี่ยนหน้าไป route อื่นแบบโปรแกรมมิ่ง เช่น /checkout/qr

  const requireAuth = useRequireAuthAction();
  // hook สำหรับ wrap action ที่ต้องล็อกอินก่อน ถ้าเป็น guest จะ redirect ไป /login

  const isEmpty = items.length === 0 || total <= 0;
  // ใช้เช็คว่าตะกร้าถือว่า "ว่าง" ไหม
  // ถ้าไม่มี item หรือ total <= 0 จะถือว่าว่างและ disable ปุ่มจ่ายเงิน

  return (
    <section className="max-w-7xl mx-auto px-6 py-10 text-white">
      <h1 className="text-2xl font-semibold mb-6">ตะกร้าของฉัน</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* รายการสินค้า */}
        <div className="lg:col-span-2 bg-[#2a2a2a] rounded-xl p-6">
          {items.length === 0 ? (
            // ถ้าไม่มีสินค้าในตะกร้า แสดงข้อความตะกร้าว่าง พร้อมลิงก์ให้ไปหน้าสินค้า
            <div className="text-gray-400">
              ตะกร้าว่าง —{" "}
              <Link to="/products" className="text-teal-300 hover:text-teal-200 underline">
                ไปเลือกซื้อสินค้า
              </Link>
            </div>
          ) : (
            // ถ้ามีสินค้า ให้ map รายการออกมาเป็น list
            <ul className="divide-y divide-white/10">
              {items.map((it) => (
                <li key={it.id} className="py-4 flex items.center justify-between">
                  <div>
                    {/* ชื่อสินค้า */}
                    <div className="font-medium">{it.name}</div>
                    {/* แสดงจำนวนของสินค้าตัวนี้ในตะกร้า */}
                    <div className="text-sm text-gray-400">จำนวน: {it.qty}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* แสดงราคาต่อหน่วยของ item ใช้ toFixed(2) ให้เป็นทศนิยม 2 ตำแหน่ง */}
                    <div className="text-teal-300">{it.price.toFixed(2)} ฿</div>
                    {/* ปุ่มลบ item นี้ออกจากตะกร้า */}
                    <button onClick={() => remove(it.id)} className="text-rose-400 hover:text-rose-300">
                      ลบ
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4">
            {/* ลิงก์กลับไปหน้าสินค้าเพื่อเลือกซื้อเพิ่ม */}
            <Link to="/products" className="text-teal-300 hover:text-teal-200">
              &laquo; เลือกซื้อสินค้าเพิ่มเติม
            </Link>
          </div>
        </div>

        {/* สรุปการสั่งซื้อ */}
        <aside className="bg-[#2a2a2a] rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-center">สรุปการสั่งซื้อ</h2>

          {/* แสดงยอดรวม ราคาก่อนลด ส่วนลด และยอดสุทธิ */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>ราคาสินค้า</span>
              <span>{subtotal.toFixed(2)} ฿</span>
              {/* subtotal มาจาก context คำนวณจาก sum(price * qty) */}
            </div>
            <div className="flex justify-between text-rose-300">
              <span>Sale Discount</span>
              <span>-{discount.toFixed(2)} ฿</span>
              {/* discount คือจำนวนเงินที่ลดจากโค้ดส่วนลด ถ้าไม่มีโค้ดจะเป็น 0 */}
            </div>
            <div className="border-t border-white/10 my-2"></div>
            <div className="flex justify-between text-teal-300 font-semibold">
              <span>ราคาทั้งหมด</span>
              <span>{total.toFixed(2)} ฿</span>
              {/* total = subtotal - discount โดยไม่ให้ติดลบ */}
            </div>
          </div>

          {/* โค้ดส่วนลด */}
          <div className="text-sm">โค้ดส่วนลด</div>
          <div className="flex gap-2 text-sm mb-4">
            <input
              value={coupon}
              // ผูกค่า input กับ state coupon ใน context
              onChange={(e) => setCoupon(e.target.value)}
              // ทุกครั้งที่แก้ text จะอัปเดต coupon และ trigger useEffect ใน cart.jsx ไปเช็ค backend
              placeholder="ใส่โค้ดส่วนลด (เช่น 20241101)"
              className="flex-1 rounded-lg px-3 py-2 bg-black/30 border border-white/10"
            />
          </div>

          {/* วิธีการชำระ */}
          <div className="space-y-3">
            <div className="text-sm">วิธีการชำระ</div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isEmpty}
                // ถ้าตะกร้าว่างจะ disable ปุ่ม
                className={`rounded-lg px-3 py-2 border border-white/10 ${
                  isEmpty ? "bg-black/20 cursor-not-allowed" : "bg-black/30 hover:bg-white/10"
                }`}
                onClick={() =>
                  // ใช้ requireAuth wrap การนำทางไปหน้า credit card
                  // ถ้า user ยังเป็น guest จะถูก redirect ไปหน้า login ก่อน
                  requireAuth(() => nav(`/credit-card?amount=${total.toFixed(2)}`))
                }
              >
                บัตรเครดิต / เดบิต
              </button>

              <button
                type="button"
                disabled={isEmpty}
                className={`rounded-lg px-3 py-2 border border-white/10 ${
                  isEmpty ? "bg-black/20 cursor-not-allowed" : "bg-black/30 hover:bg-white/10"
                }`}
                onClick={() =>
                  // ไปหน้า checkout แบบ QR พร้อมส่ง amount ผ่าน query string
                  requireAuth(() => nav(`/checkout/qr?amount=${total.toFixed(2)}`))
                }
              >
                พร้อมเพย์
              </button>
            </div>

            {/* ลิงก์ไปอ่านวิธีการสั่งซื้อ/ชำระเงิน */}
            <Link to="/how-to-pay" className="text-teal-300 hover:text-teal-200 text-sm">
              วิธีการสั่งซื้อ / ชำระเงิน
            </Link>
          </div>

          {/* ปุ่มดำเนินการสั่งซื้อ */}
          <button
            type="button"
            disabled={isEmpty}
            // ปุ่มใหญ่สำหรับเริ่ม checkout ด้วย QR ถ้าตะกร้าว่างจะกดไม่ได้
            className={`w-full mt-2 rounded-lg py-2 font-semibold ${
              isEmpty ? "bg-teal-800/50 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-600"
            }`}
            onClick={() =>
              // ใช้ requireAuth เหมือนปุ่มด้านบน
              requireAuth(() => nav(`/checkout/qr?amount=${total.toFixed(2)}`))
            }
          >
            ดำเนินการสั่งซื้อ
          </button>
        </aside>
      </div>
    </section>
  );
}
