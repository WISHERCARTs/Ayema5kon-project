import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../lib/cart";
import { useEffect } from "react";
import api from "../lib/api";
import { useState } from "react";

export default function QRPromptPay() {
  const { search } = useLocation();       // ดึง query string จาก URL (เช่น ?amount=100)
  const nav = useNavigate();
  const { total } = useCart();            // ดึงยอดรวมจากตะกร้า

  // คำนวณจำนวนเงินที่จะใช้สร้าง QR
  // ถ้า URL มี amount ที่เป็นตัวเลขมากกว่า 0 ให้ใช้ค่านั้น
  // ถ้าไม่มีก็ fallback ไปใช้ total จากตะกร้า
  const amount = useMemo(() => {
    const a = Number(new URLSearchParams(search).get("amount"));
    return Number.isFinite(a) && a > 0 ? a : total;
  }, [search, total]);


  const [img,setImg] = useState(null)     // เก็บค่า data URL (base64) รูป QR ที่ได้จาก backend

  // ฟังก์ชันยิง API ไป gen QR จาก backend
  const fetchQr = async() => {
    try {
      const resx = await api.post("/genqr",{
        amount:amount                     // ส่งจำนวนเงินไปให้ backend ใช้สร้าง payload PromptPay
      })

      // if(r)
      // console.log(resx);
      setImg(resx.data.data)             // สมมติ backend ตอบ { data: "data:image/png;base64,..." } เอามาเซ็ตเป็น src
    }catch(err) {
      nav("/ErrorPayment")              // ถ้า error ระหว่าง gen QR ให้เด้งไปหน้า ErrorPayment
    }
  }

  // เรียก fetchQr ครั้งเดียวตอน component.mount
  useEffect(() => {
    fetchQr()
  },[])

  // console.log(img);

  return (
    <section className="max-w-3xl mx-auto px-6 py-12 text-white">
      <h1 className="text-2xl font-semibold mb-6">PromptPay QR Code</h1>

      <div className="bg-[#2a2a2a] rounded-xl p-6 space-y-4">
        {/* แสดงจำนวนเงินที่ต้องจ่าย ตาม amount ที่คำนวณไว้ด้านบน */}
        <div className="text-3xl text-teal-300 font-bold">{amount.toFixed(2)} Baht</div>

        {/* ใช้ภาพ QR สมมติใน public/assets/qr.png หรือจะฝัง lib สร้าง QR ภายหลังก็ได้ */}
        {/* ตรงนี้ใช้ img จาก state ที่รับมาจาก backend (data URL) แสดงเป็นรูป QR ให้สแกน */}
        <div className="grid place-items-center">
          <img src={img} alt="QR PromptPay" className="w-64 h-64 bg-white rounded-lg" />
        </div>

        <div className="space-y-2 text.white/90">
          <h2 className="font-semibold">วิธีการจ่ายเงินด้วย QR PromptPay</h2>
          <ol className="list-decimal ml-6 space-y-1">
            <li>เปิดแอป Mobile Banking แล้วกด “สแกนจ่าย”</li>
            <li>หลังจากการสแกน โปรดตรวจสอบรายละเอียดราคา</li>
            <li>กดยืนยันเพื่อชำระเงิน</li>
          </ol>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => nav(`/thank-you?paid=1`)}  //ใส่ paid=1
            className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700"
          >
            ชำระเงินแล้ว
          </button>
          <button onClick={() => nav("/cart")} className="px-4 py-2 rounded-lg bg-white/10 hover:bg.white/20">
            กลับตะกร้า
          </button>

          <button onClick={() => nav("/ErrorPayment")} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-white/10">
            Error payment
          </button>

        </div>
      </div>
    </section>
  );
}
