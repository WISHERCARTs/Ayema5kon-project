// code reference from https://youtu.be/psBmEOIGF6c?si=1CCAyJJfwxswl5Pq

const express = require('express')
const QRcode = require('qrcode')
const generatepayload = require('promptpay-qr')
const bodyParser = require('body-parser')
const _ = require('lodash')
const cors = require('cors')

const app = express();
const PORT = 3030 

app.use(cors())
// เปิด CORS ให้ client จาก origin อื่น (เช่น frontend ที่คนละ port) เรียก API นี้ได้

app.use(bodyParser.json())
// parse body ที่เป็น JSON แล้วแปลงใส่ req.body อัตโนมัติ

app.use(bodyParser.urlencoded( {extended : true}))
// parse body ที่ส่งมาแบบ form-urlencoded (เช่นจาก HTML form)

const server = app.listen(3030, () => {
  console.log(`Server listening on port : ${PORT}`);
  // สตาร์ท HTTP server ที่ port 3030 แล้ว log ขึ้น console
})

app.post('/generateQR', (req, res) => {
  // endpoint POST /generateQR สำหรับรับจำนวนเงินแล้วสร้าง QR PromptPay
    
  const amount = parseFloat(_.get(req, ["body", "amount"]));
  // ดึงค่า amount จาก req.body.amount โดยใช้ lodash.get กันกรณี path ไม่มี
  // แล้ว parseFloat แปลงเป็นตัวเลข (จำนวนเงิน)

  const mobilenumber = '0947761119';
  // เลขมือถือ PromptPay ที่ใช้รับเงิน (fix ไว้ในโค้ด)

  const payload = generatepayload(mobilenumber, { amount });
  // สร้าง payload ของ PromptPay QR ตามมาตรฐาน ใช้เบอร์ + amount เป็นข้อมูล

  const option = {
    color: {
      dark: '#000',
      light: '#fff'
    }
  }
  // options สำหรับกำหนดสีตอน gen รูป QR code

  QRcode.toDataURL(payload, option, (err, url) => {
    // แปลง payload ที่ได้ไปเป็นรูป QR code ในรูปแบบ Data URL (base64)
    // url คือ string ยาวที่เอาไป set เป็น src ของ <img> ได้โดยตรง

    if (err) {
      console.error("generate fail", err.message);
      process.exit(1);
      // ถ้า gen QR fail ให้ log error แล้ว kill process เลย
    }

    return res.status(200).json ({
      RespCode: 200,
      ResMessage: 'good',
      Result: url
      // ส่ง JSON กลับไปพร้อม status 200
      // Result = Data URL ของรูป QR code
    })
  
  })

})

module.exports = app;
// export app (instance ของ express) เผื่อเอาไปใช้ที่อื่น เช่น test หรือรวมกับ server ตัวหลัก
