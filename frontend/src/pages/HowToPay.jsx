export default function HowToPay() {
  // หน้าอธิบายขั้นตอนสั่งซื้อ/ชำระเงินแบบ static ใช้แสดงข้อมูลอย่างเดียว
  return (
    <section className="flex max-w-3xl mx-auto mt-13 mb-12 px-6 py-12 text-black">
      {/* กล่องเนื้อหาหลักของหน้า */}
      <div className="bg-gray-200 px-20 py-12 rounded-lg">
        {/* หัวข้อหลักของหน้า */}
        <h1 className="text-2xl font-semibold mb-6">วิธีการสั่งซื้อ (how to pay)</h1>

        {/* ลิสต์ขั้นตอนการสั่งซื้อแบบลำดับ 1–6 */}
        <ol className="list-decimal ml-6 space-y-3 text-black/90">
          <li>เข้าสู่เว็บไซต์ → (Option) Login/Sign up เพื่อบันทึกประวัติคำสั่งซื้อ</li>
          <li>ค้นหา/เลือกเกมที่ต้องการ → กด <b>Buy Now</b> หรือ <b>Add to Cart</b></li>
          <li>ตรวจสอบตะกร้า → กรอกอีเมลสำหรับรับ Key ดิจิทัล</li>
          <li>เลือกวิธีชำระเงิน (เช่น บัตรเดบิต/เครดิต, PromptPay, โอนธนาคาร, PayPal)</li>
          <li>ชำระเงินสำเร็จ → ระบบแสดง CD-Key ทันที และส่งสำเนาไปยังอีเมล</li>
          <li>นำ Key ไปกรอกในแพลตฟอร์มที่เกี่ยวข้อง (Steam/PS/Xbox)</li>
        </ol>

        {/* กล่องเคล็ดลับด้านล่าง แสดงข้อความเสริมว่าให้ login ก่อนจะดีกว่า */}
        <div className="bg-teal-300 px-12 rounded-lg">
          <p className="text-sm text-black mt-6">
            เคล็ดลับ: แนะนำให้ล็อกอินก่อนซื้อ เพื่อดูประวัติ “คีย์ของฉัน” ภายหลังได้สะดวก
          </p>
        </div>
      </div>
    </section>
  );
}
