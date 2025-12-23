// HeroSection.jsx
import { Link } from "react-router-dom";
// ใช้ Link สำหรับเปลี่ยนหน้าในฝั่ง frontend โดยไม่ reload ทั้งหน้า

export default function HeroSection() {
  // section แรกของหน้า (hero) ใช้แนะนำเว็บไซต์และพาไปยังหน้าหลัก ๆ
  return (
    <section className="bg-teal-600 py-2 text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left */}
        <div className="lg:col-span-6 space-y-6">
          <h1 className="text-balance text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            Aye! ma 5 kon
          </h1>

          <p className="text-regal-blue text-lg/relaxed max-w-2xl font-normal" >
            Aye! ma 5 kon คือ ร้านค้าออนไลน์ที่รวบรวม CD keys
            เกมลิขสิทธิ์แท้จากทั่วโลก ให้คุณเข้าถึงคลังเกมโปรดได้ง่ายและรวดเร็ว ไม่ว่าจะเป็นเกมใหม่ล่าสุด
            หรือเกมคลาสสิกหายาก เรามุ่งมั่นที่จะมอบประสบการณ์การซื้อที่ ปลอดภัย ราคาดี และพร้อมใช้งานทันที
            ให้การเข้าสู่โลกแห่งเกมของคุณเป็นเรื่องง่ายแค่คลิกเดียว.
          </p>

          <div className="flex flex-wrap gap-4">
            {/* ปุ่มหลัก */}
            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3
             bg-green-500 text-white ..."
            >
              {/* กดแล้วนำผู้ใช้ไปหน้าแสดงสินค้าทั้งหมด (/products) */}
              ดูสินค้าทั้งหมด
            </Link>
            {/* ปุ่มรอง */}
            <Link
              to="/about"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3
             border border-solid text-white/95 hover:text-white ..."
            >
              {/* กดแล้วนำผู้ใช้ไปหน้าเกี่ยวกับร้าน (/about) */}
              เกี่ยวกับเรา
            </Link>

          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-6">
          <div className="rounded-[28px] overflow-hidden ring-1 ring-white/20 shadow-xl">
            <img
              src="/assets/steamimg.jpg"
              alt="Steam games showcase"
              className="w-full h-full object-cover opacity-95"
            />
            {/* รูปภาพประกอบฝั่งขวา ใช้โชว์บรรยากาศเกม/ร้าน */}
          </div>
        </div>
      </div>
    </section>
  );
}
