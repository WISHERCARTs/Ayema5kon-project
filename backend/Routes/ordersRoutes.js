// backend/routes/OrdersRoutes.js
const express = require("express");
const app = express(); // สร้าง instance ของ express แต่ไฟล์นี้ใช้ router เป็นหลัก
const router = express.Router(); // ใช้ router แยกกลุ่ม route ของ Orders
const dbConn = require("../db"); // import การเชื่อมต่อฐานข้อมูล MySQL
const axios = require("axios") // เตรียมไว้ใช้ call API ภายนอก (ตอนนี้ยังไม่ได้ใช้ในไฟล์นี้)
const QRcode = require('qrcode') // เตรียมไว้ generate QR code (ยังไม่ได้ถูกเรียกใช้ใน route ด้านล่าง)
const generatepayload = require('promptpay-qr') // ใช้ทำ payload promptpay QR (ยังไม่มีการใช้ในไฟล์นี้ตอนนี้)

// POST /api/Orders/insertinfo

// Testing Insert Orders Info
// method : Insert
// body: raw json
// http://localhost:3000/api/orders/insertinfo
// {
//     "orders":{
//     "OrdID": 998,
//     "Ord_Total_Price": 1590,
//     "Ord_Quantity": 1,
//     "UserID": 2
//     }
// }

// {
//   "orders":{
//   "OrdID": 999,
//   "Ord_Total_Price": 1000,
//   "Ord_Quantity": 3,
//    "UserID": 3
//       }
// }
router.post("/orders/insertinfo", (req, res) => {
  const Orders = req.body.orders; // ดึง object orders จาก body ที่ client ส่งมา
  if (!Orders) {
    // ถ้าไม่มี field orders ใน body ให้ตอบ 400 กลับไป
    return res
      .status(400)
      .send({ error: true, message: "Please provide Orders data (orders)." });
  }

  dbConn.query("INSERT INTO Orders SET ? ", Orders, (error, results) => {
    // ใช้ SET ? ให้ MySQL map key ใน object Orders เข้ากับ column ในตาราง Orders
    if (error) {
      console.error("DB error at INSERT:", error); // log error เมื่อ insert ไม่สำเร็จ
      return res.status(500).send({ error: true, message: "Database error" }); // ตอบ 500 ถ้าฐานข้อมูลมีปัญหา
    }
    return res.send({
      error: false,
      data: { affectedRows: results.affectedRows, insertId: results.insertId }, // affectedRows = จำนวนแถวที่ insert, insertId = id ล่าสุด
      message: "New Orders has been created successfully.",
    });
  });
});

// Testing Update Orders Info
// method : PUT
// body: raw json
// http://localhost:3000/api/orders/updateinfo
// {
//     "orders":{
//     "OrdID": 102,
//     "Ord_Total_Price": 590,
//     "Ord_Quantity": 1,
//     "UserID": 2
//     }
// }

// {
//   "orders":{
//   "OrdID": 103,
//   "Ord_Total_Price": 1990,
//   "Ord_Quantity": 7,
//    "UserID": 3
//       }
// }

router.put("/orders/updateinfo", (req, res) => {
  const Orders = req.body.orders; // ข้อมูล orders ที่จะเอามา update
  const OrdersID = Orders?.OrdID; // ใช้ OrdID เป็น key ระบุว่าแถวไหนต้องถูก update

  if (!Orders || !OrdersID) {
    // ถ้าไม่มี object orders หรือไม่มี OrdID ให้ reject ทันที
    return res.status(400).send({
      error: true,
      message: "Please provide product data with OrdID.",
    });
  }

  dbConn.query(
    "UPDATE Orders SET ? WHERE OrdID = ?",
    [Orders, OrdersID], // ใช้ Orders เป็นค่า SET และใช้ OrdID เป็นเงื่อนไขใน WHERE
    (error, results) => {
      if (error) {
        console.error("DB error at UPDATE:", error); // log error ตอน update ล้มเหลว
        return res
          .status(500)
          .send({ error: true, message: "Database error" }); // ตอบ 500 ถ้า DB มีปัญหา
      }
      return res.send({
        error: false,
        data: { affectedRows: results.affectedRows }, // จำนวนแถวที่ถูก update
        message: "Orders has been updated successfully.",
      });
    }
  );
});

// Testing Delete
// method : DELETE
// body: raw json
// http://localhost:3000/api/orders/deleteinfo
// {
//     "OrdID": 998,
// }

// {
//   "OrdID": 999,
// }
router.delete("/orders/deleteinfo", (req, res) => {
  const OrdersID = req.body.OrdID; // รับ OrdID จาก body เพื่อบอกว่าจะลบ order ไหน

  if (!OrdersID) {
    // ถ้าไม่ส่ง OrdID มาให้ตอบ 400
    return res
      .status(400)
      .send({ error: true, message: "Please provide OrdID." });
  }

  dbConn.query(
    "DELETE FROM Orders WHERE OrdID = ?",
    [OrdersID], // ใช้ OrdID เป็น parameter ใน WHERE
    (error, results) => {
      if (error) {
        console.error("DB error at DELETE:", error); // log error ตอน delete ล้มเหลว
        return res
          .status(500)
          .send({ error: true, message: "Database error" }); // ตอบ 500 ถ้าฐานข้อมูลมีปัญหา
      }
      return res.send({
        error: false,
        data: { affectedRows: results.affectedRows }, // จำนวนแถวที่ถูกลบออก
        message: "Orders has been deleted successfully.",
      });
    }
  );
});

// Testing Get Orders Info Id
// method : GET
// body: raw json
// http://localhost:3000/api/orders/getinfo/101
// http://localhost:3000/api/orders/getinfo/102
router.get("/orders/getinfo/:id", (req, res) => {
  const OrdersID = req.params.id; // รับ id จาก path parameter

  if (!OrdersID) {
    // กันกรณีไม่มี id ใน params (ปกติ route แบบนี้จะมีเสมอ)
    return res
      .status(400)
      .send({ error: true, message: "Please provide Orders id." });
  }

  dbConn.query(
    "SELECT * FROM Orders WHERE OrdID = ?",
    [OrdersID], // ใช้ OrdID จาก URL ไป query หาข้อมูล order
    (error, results) => {
      if (error) {
        console.error("DB error at SELECT by id:", error); // log error ตอน select fail
        return res
          .status(500)
          .send({ error: true, message: "Database error" }); // ตอบ 500 ถ้ามีปัญหาฐานข้อมูล
      }
      return res.send({
        error: false,
        data: results[0] || null, // ถ้ามีผลลัพธ์ส่งแถวแรก ถ้าไม่เจอให้เป็น null
        message: "Orders retrieved.",
      });
    }
  );
});

// Testing Get All
// method : GET
// body: raw json
// http://localhost:3000/api/orders/getall
router.get("/orders/getall", (req, res) => {
  dbConn.query("SELECT * FROM Orders", (error, results) => {
    // ดึง order ทั้งหมดจาก table Orders
    if (error) {
      console.error("DB error at SELECT all:", error); // log error ตอน select all fail
      return res
        .status(500)
        .send({ error: true, message: "Database error" }); // ตอบ 500 ถ้า DB มีปัญหา
    }
    return res.send({
      error: false,
      data: results, // ส่ง array ของ order ทั้งหมดกลับไป
      message: "Orders list.",
    });
  });
});

module.exports = router; // export router ให้ไฟล์หลักไป mount เป็น /api/orders หรือ path ตาม config
