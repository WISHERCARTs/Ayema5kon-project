// backend/routes/discountcodeRoutes.js
const express = require("express");
const router = express.Router(); // สร้าง router สำหรับจัดการ route ของ DiscountCode
const dbConn = require("../db"); // import การเชื่อมต่อฐานข้อมูล MySQL

// Testing insert
// method : POST
// http://localhost:3000/api/discountcode/insertinfo
// body: raw json
// {
//     "discountcode": {
//                 "DisID": 999,
//     "Dis_Code": 20240000,
//     "Dis_DiscountPrice": 100.0,
//     "Dis_ExpiredDate": "2025-12-31"
//     }
// }
// {
//     "discountcode": {
//                 "DisID": 888,
//     "Dis_Code": 20241111,
//     "Dis_DiscountPrice": 50.0,
//     "Dis_ExpiredDate": "2025-12-31"
//     }
// }

// POST /api/discountcode/insertinfo
router.post("/discountcode/insertinfo", (req, res) => {
  const DiscountCode = req.body.discountcode; // ดึง object discountcode จาก body ที่ client ส่งมา
  if (!DiscountCode) {
    // ถ้า body ไม่มี field discountcode ให้ตอบ 400
    return res
      .status(400)
      .send({ error: true, message: "Please provide DiscountCode data (discountcode)." });
  }

  dbConn.query("INSERT INTO DiscountCode SET ? ", DiscountCode, (error, results) => {
    // ใช้ SET ? ให้ MySQL map key ใน DiscountCode เข้า column ในตาราง DiscountCode
    if (error) {
      console.error("DB error at INSERT:", error); // log error ถ้า insert ล้มเหลว
      return res.status(500).send({ error: true, message: "Database error" }); // ตอบ 500 เมื่อมีปัญหาฐานข้อมูล
    }
    return res.send({
      error: false,
      data: { affectedRows: results.affectedRows, insertId: results.insertId }, // affectedRows = จำนวนแถวที่ insert, insertId = id ล่าสุด
      message: "New DiscountCode has been created successfully.",
    });
  });
});

// Testing update
// method : PUT
// http://localhost:3000/api/discountcode/updateinfo
// body: raw json
// {
//     "discountcode": {
//     "DisID": 888,
//     "Dis_Code": 20241111,
//     "Dis_DiscountPrice": 250.0,
//     "Dis_ExpiredDate": "2025-12-31"
//     }
// }
// {
//     "discountcode": {
//     "DisID": 999,
//     "Dis_Code": 20240120,
//     "Dis_DiscountPrice": 150.0,
//     "Dis_ExpiredDate": "2025-12-31"
//     }
// }

router.put("/discountcode/updateinfo", (req, res) => {
  const DiscountCode = req.body.discountcode; // รับข้อมูล discountcode ทั้ง object จาก body
  const DiscountCodeId = DiscountCode?.DisID; // ใช้ DisID เป็นตัวระบุแถวที่จะ update

  if (!DiscountCode || !DiscountCodeId) {
    // ถ้าไม่มีข้อมูลหรือไม่มี DisID ให้ reject ด้วย 400
    return res.status(400).send({
      error: true,
      message: "Please provide DiscountCode data with DisID.",
    });
  }

  dbConn.query(
    "UPDATE DiscountCode SET ? WHERE DisID = ?",
    [DiscountCode, DiscountCodeId], // ส่ง object DiscountCode เป็นค่า SET และใช้ DisID ใน where
    (error, results) => {
      if (error) {
        console.error("DB error at UPDATE:", error); // log error ตอน update
        return res
          .status(500)
          .send({ error: true, message: "Database error" }); // ตอบ 500 ถ้าฐานข้อมูลมีปัญหา
      }
      return res.send({
        error: false,
        data: { affectedRows: results.affectedRows }, // จำนวนแถวที่ถูก update
        message: "DiscountCode has been updated successfully.",
      });
    }
  );
});

// Testing delete
// method : DELETE
// body: raw json
// http://localhost:3000/api/discountcode/deleteinfo
// {
//         "DisID": 999
//     }
// {
//         "DisID": 888
//     } 

router.delete("/discountcode/deleteinfo", (req, res) => {
  const DiscountCodeId = req.body.DisID; // รับ DisID จาก body เป็นตัวบอกว่าจะลบ record ไหน

  if (!DiscountCodeId) {
    // ถ้าไม่ส่ง DisID มาให้ตอบ 400
    return res
      .status(400)
      .send({ error: true, message: "Please provide DisID." });
  }

  dbConn.query(
    "DELETE FROM DiscountCode WHERE DisID = ?",
    [DiscountCodeId], // ใช้ DisID เป็น parameter ของ WHERE
    (error, results) => {
      if (error) {
        console.error("DB error at DELETE:", error); // log error ตอน delete ล้มเหลว
        return res
          .status(500)
          .send({ error: true, message: "Database error" }); // ตอบ 500 ถ้าฐานข้อมูลพัง
      }
      return res.send({
        error: false,
        data: { affectedRows: results.affectedRows }, // จำนวนแถวที่ถูกลบออกไป
        message: "DiscountCode has been deleted successfully.",
      });
    }
  );
});

// Testing GET ID
// method : GET
// body: raw json
// http://localhost:3000/api/discountcode/getinfo/1
// http://localhost:3000/api/discountcode/getinfo/2

router.get("/discountcode/getinfo/:id", (req, res) => {
  const DiscountCodeId = req.params.id; // รับ id จาก path parameter

  if (!DiscountCodeId) {
    // กรณีไม่เจอ id ใน params (ปกติจะมี) ให้กันตกไว้
    return res
      .status(400)
      .send({ error: true, message: "Please provide DiscountCode id." });
  }

  dbConn.query(
    "SELECT * FROM DiscountCode WHERE DisID = ?",
    [DiscountCodeId], // ใช้ DisID จาก URL ไป query
    (error, results) => {
      if (error) {
        console.error("DB error at SELECT by id:", error); // log error ตอน select
        return res
          .status(500)
          .send({ error: true, message: "Database error" }); // ตอบ 500 ถ้า DB มีปัญหา
      }
      return res.send({
        error: false,
        data: results[0] || null, // ถ้ามีอย่างน้อย 1 แถว ส่งแถวแรก ไม่มีก็ส่ง null
        message: "DiscountCode retrieved.",
      });
    }
  );
});

// Testing Get All
// method : GET
// body: raw json
// http://localhost:3000/api/discountcode/getall
// http://localhost:3000/api/discountcode/getall

router.get("/discountcode/getall", (req, res) => {
  dbConn.query("SELECT * FROM DiscountCode", (error, results) => {
    // ดึง DiscountCode ทั้งหมดจากตาราง
    if (error) {
      console.error("DB error at SELECT all:", error); // log error ตอน select
      return res
        .status(500)
        .send({ error: true, message: "Database error" }); // ตอบ 500 ถ้าฐานข้อมูลมีปัญหา
    }
    return res.send({
      error: false,
      data: results, // ส่ง array ของ discount code ทั้งหมดกลับไป
      message: "DiscountCode list.",
    });
  });
});

// Testing Check
// method : GET
// body: raw json
// http://localhost:3000/api/discountcode/check
// {
//     "Dis_Code": 20241101
// }
// {
//     "Dis_Code": 20241103
// }

// ตรวจสอบโค้ดส่วนลด
router.get("/discountcode/check", (req, res) => {
  const code = req.query.code || req.query.Dis_Code;; // ดึง Dis_Code จาก body เพื่อใช้ตรวจสอบโค้ด (ตอนใช้งานจริงฝั่ง frontend ต้องส่ง field นี้มา)

  if (!code) {
    // ถ้าไม่ส่ง code มาให้ตอบ 400 พร้อม message บอก format
    return res
      .status(400)
      .send({ error: true, message: "Please provide discount code (?code=...)" });
  }

  // ใช้ Dis_Code ในการค้นหา และเช็ควันหมดอายุ
  const sql = `
    SELECT DisID, Dis_Code, Dis_DiscountPrice, Dis_ExpiredDate, OrdID
    FROM DiscountCode
    WHERE Dis_Code = ?
      AND Dis_ExpiredDate >= CURDATE()
    LIMIT 1
  `; // query ตรวจว่าโค้ดมีอยู่จริง และวันหมดอายุยังไม่เลยวันนี้ (CURDATE) พร้อมดึงข้อมูลที่จำเป็น

  dbConn.query(sql, [code], (error, results) => {
    if (error) {
      console.error("DB error at CHECK:", error); // log error ถ้าตรวจโค้ดล้มเหลว
      return res.status(500).send({ error: true, message: "Database error" }); // ตอบ 500 ถ้ามีปัญหาฐานข้อมูล
    }

    if (results.length === 0) {
      // โค้ดไม่เจอ หรือหมดอายุแล้ว
      return res.send({
        error: false,
        valid: false,
        message: "Invalid or expired discount code",
      });
    }

    const row = results[0]; // ดึงแถวแรกมาใช้เป็นผลลัพธ์ของโค้ดส่วนลดนี้
    return res.send({
      error: false,
      valid: true, // flag บอกว่าโค้ดนี้ใช้ได้
      discountPrice: row.Dis_DiscountPrice, // มูลค่าส่วนลด
      data: row, // ส่งข้อมูลทั้งหมดของ discount code กลับไปเผื่อ frontend ใช้ต่อ
    });
  });
});

module.exports = router; // export router ให้ไฟล์หลักเอาไป mount เป็น /api/discountcode
