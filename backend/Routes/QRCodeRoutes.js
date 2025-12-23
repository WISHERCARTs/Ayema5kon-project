// code reference from https://youtu.be/psBmEOIGF6c?si=1CCAyJJfwxswl5Pq

const express = require("express");
const router = express.Router();
const QRcode = require('qrcode') // import ไลบรารี qrcode ไว้ใช้ generate รูป QR จาก text/payload
const generatepayload = require('promptpay-qr') // import ไลบรารีสร้าง payload สำหรับ PromptPay QR

// Testing QRCode Generated
// method : POST
// body: image
// http://localhost:3000/api/genqr
router.post('/genqr', async(req, res) => {
  const {amount} = req.body
  // ดึงจำนวนเงิน amount จาก body ที่ client ส่งมา เช่น { "amount": 100 }

  const payload =  await generatepayload("0947761119",{amount})
  // สร้าง payload สำหรับ PromptPay โดยใช้เบอร์ "0947761119" เป็นข้อมูลรับเงิน
  // generatepayload จะคืน string ตามมาตรฐาน QR PromptPay ฝังยอด {amount} เข้าไป

  const qrScan = await QRcode.toDataURL(payload)
  // แปลง payload ที่ได้ให้กลายเป็นรูป QR code ในรูปแบบ Data URL (base64 image)
  // qrScan จะเป็น string ยาวๆ ที่ขึ้นต้นด้วย "data:image/png;base64,...."

  return res.status(200).json({
    data: qrScan
    // ส่ง json กลับไปให้ฝั่ง frontend มี field data = รูป QR แบบ base64
    // ฝั่ง client สามารถเอาไปแสดงใน <img src={data}> ได้เลย
  })

})

module.exports = router; // export router ออกไปเพื่อให้ server หลักเอาไป mount เป็น /api หรือ prefix ที่ต้องการ
