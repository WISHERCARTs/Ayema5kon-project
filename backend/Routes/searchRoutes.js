// backend/routes/searchRoutes.js
const express = require("express");
const app = express(); // ประกาศ instance express (ไฟล์นี้ใช้งานหลักๆ ผ่าน router)
const router = express.Router(); // ใช้ router แยกชุด route /search ออกจากไฟล์หลัก
const dbconn = require("../db"); // import การเชื่อมต่อฐานข้อมูล

// Testing Search
// method : GET
// body:  raw json
// http://localhost:3000/api/search
router.get("/search", (req, res) => {
  const { q = "", all, category, minPrice, maxPrice } = req.query;
  // ดึง query string จาก URL เช่น /search?q=minecraft&category=101&minPrice=500&maxPrice=1500
  // q = keyword ค้นหาตามชื่อสินค้า
  // all = ถ้า truthy จะ ignore filter อื่นแล้วดึงทั้งหมด
  // category = CatID ที่ใช้ filter สินค้า
  // minPrice, maxPrice = price range สำหรับ filter ราคาสินค้า

  let sql = "SELECT * FROM product WHERE 1=1";
  const params = [];
  // เริ่มต้นด้วย WHERE 1=1 เพื่อให้ต่อ AND ตามเงื่อนไขต่างๆ ได้ง่าย
  // params ไว้เก็บค่าที่จะ bind เข้า ? ใน SQL ป้องกัน SQL injection

  if (q) {
    sql += " AND Pro_Name LIKE ?";
    params.push(`%${q}%`);
    // ถ้า user ส่ง q มา จะค้นหาจากชื่อสินค้าด้วย LIKE '%q%'
    // ใช้ ? + params แทนการต่อ string ตรงๆ ให้ปลอดภัยขึ้น
  }

  if (category && category != " ") {
    sql += " AND CatID = ?";
    params.push(category);
    // ถ้ามี category และไม่ใช่สตริงว่าง ก็ filter ด้วย CatID
  }

  if (minPrice) {
    sql += " AND Pro_Price >= ?";
    params.push(Number(minPrice));
    // ถ้ามี minPrice ให้ filter ราคาต่ำสุดด้วย Pro_Price >= minPrice
    // แปลงเป็น Number ให้แน่ใจว่าเป็นตัวเลขก่อนส่งเข้า query
  }

  if (maxPrice) {
    sql += " AND Pro_Price <= ?";
    params.push(Number(maxPrice));
    // ถ้ามี maxPrice ให้ filter ราคาสูงสุดด้วย Pro_Price <= maxPrice
  }

  if (all) {
    sql = " Select * From Product";
    params.push();
    // ถ้าส่ง all มาด้วย (เช่น ?all=1) จะ override SQL ก่อนหน้า แล้วดึง product ทั้งหมดแทน
    // การ params.push() แบบไม่ใส่ค่าไม่กระทบอะไร แต่ก็ไม่ได้ใช้จริงใน query นี้
  }

  // ใช้ callback แทน async/await
  dbconn.query(sql, params, (err, rows) => {
    // dbconn.query จะเอา sql + params ไปยิง MySQL
    // rows = ผลลัพธ์จากการค้นหา (array ของ product)
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({
        success: false,
        message: "ค้นหาสินค้าไม่สำเร็จ",
      });
      // ถ้า DB พังหรือ query ผิด ให้ตอบ 500 พร้อมข้อความ error ฝั่ง backend
    }

    return res.status(200).json({
      success: true,
      data: rows,
      // ถ้าสำเร็จ ส่ง status 200 + success = true + data = list ของสินค้า
    });
  });
});

module.exports = router; // export router ให้ไฟล์หลักไป mount เป็น /api หรือ path ตาม config
