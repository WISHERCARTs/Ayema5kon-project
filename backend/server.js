// backend/server.js
const express = require("express");
const dotenv = require("dotenv");
// const cors = require("cors");

dotenv.config(); 
// โหลดตัวแปรสภาพแวดล้อมจากไฟล์ .env เข้าไปใน process.env
// เช่น PORT, DB config, JWT_SECRET ฯลฯ

const app = express(); 
// สร้าง instance หลักของ express app สำหรับใช้รับ request ทั้งหมด

// app.use(cors());
// ถ้าจะให้ frontend คนละ origin (เช่น http://localhost:5173) เรียก API นี้ได้ ต้องเปิด cors ตรงนี้
// ตอนนี้โดนคอมเมนต์ไว้ แปลว่า default ไม่เปิด CORS

app.use(express.json());
// middleware สำหรับ parse JSON body จาก request (Content-Type: application/json)

app.use(express.urlencoded({ extended: true }));
// middleware สำหรับ parse body แบบ form-urlencoded (เช่น จาก HTML form ปกติ)

// import routes
const productRoutes = require("./Routes/productRoutes");
const categoryRoutes = require("./Routes/categoryRoutes");
const cd_keyRoutes = require("./Routes/cd_keyRoutes");
const discountcodeRoutes = require("./Routes/discountcodeRoutes");
const ordersRoutes = require("./Routes/ordersRoutes");
const steamApiRoutes = require("./Routes/steamApiRoutes");
const orderproductRoutes = require("./Routes/orderproductRoutes");
const user_adminRoutes = require("./Routes/user_adminRoutes");
const QRCodeRoutes = require("./Routes/QRCodeRoutes");
const searchRoutes = require("./Routes/searchRoutes");
// แต่ละบรรทัดด้านบนคือการ import router จากไฟล์ route ต่างๆ
// เส้นทางจริงในไฟล์ใช้โฟลเดอร์ "Routes" (R ใหญ่) ต้องตรงกับชื่อโฟลเดอร์ในโปรเจกต์เป๊ะ โดยเฉพาะบน server ที่ case-sensitive

// mount
app.use("/api", productRoutes);
app.use("/api", categoryRoutes);
app.use("/api", cd_keyRoutes);
app.use("/api", discountcodeRoutes);
app.use("/api", ordersRoutes);
app.use("/api", orderproductRoutes);
app.use("/api", user_adminRoutes);
app.use("/api", steamApiRoutes);
app.use("/api", QRCodeRoutes);
app.use("/api", searchRoutes)
// mount router ทั้งหมดเข้ากับ prefix "/api"
// เช่น route ใน productRoutes เขียนว่า router.get("/product/getall")
// สุดท้าย path จริงจะกลายเป็น /api/product/getall

const authRoutes = require("./Routes/authRoutes");
const { verifyToken, requireRole } = require("./middleware/auth");
// import router สำหรับ auth (login/register)
// และ import middleware ที่ใช้ตรวจ JWT + เช็ค role

app.use("/api/auth", authRoutes);
// mount authRoutes ด้วย prefix "/api/auth"
// เช่น ใน authRoutes มี router.post("/login") => path จริงคือ /api/auth/login

// ตัวอย่าง route ที่ต้อง login
app.get("/api/profile", verifyToken, (req, res) => {
  // verifyToken จะเช็ค JWT จาก header
  // ถ้า token ถูกต้อง จะ set req.user จาก payload { userId, role }
  res.json({ userId: req.user.userId, role: req.user.role });
  // ส่งข้อมูล userId และ role กลับให้ frontend ดู profile ของตัวเอง
});

// ตัวอย่าง route ที่ต้องเป็น admin เท่านั้น
app.get("/api/admin/secret", verifyToken, requireRole("admin"), (req, res) => {
  // verifyToken ก่อน แล้วค่อย requireRole("admin")
  // requireRole จะเช็คว่า req.user.role === "admin" หรือไม่
  res.json({ message: "Only admin can see this." });
  // ถ้าไม่ใช่ admin middleware จะ block ก่อนถึง handler นี้
});

const PORT = process.env.PORT || 3030;
// อ่าน PORT จาก .env ถ้าไม่มีให้ใช้ 3030 เป็นค่า default

app.listen(PORT, () => {
  console.log(`Server listening on port : ${PORT}`);
  // log ไว้ใน console ตอน server start สำเร็จ พร้อมบอกเลข port
});
