// backend/routes/cd_keyRoutes.js
const express = require("express");
const app = express(); // สร้าง instance express แต่ไฟล์นี้ใช้ router เป็นหลัก
const router = express.Router(); // สร้าง router สำหรับกลุ่ม route cdkey
const dbConn = require("../db"); // import การเชื่อมต่อฐานข้อมูล

// POST /api/cdkey/insertinfo
// Testing insert
// method : post
// http://localhost:3000/api/cdkey/insertinfo
// body: raw json
// {
//     "cdkey": {
//             "KeyID": 999,
//     "CD_SerialCode": "ABCD-EFGH-IJKL-EEEE",
//     "CD_Status": "Active",
//     "CD_DateAdded": "2025-01-01"
//     }
// }
//
// {
//     "cdkey": {
//             "KeyID": 888,
//     "CD_SerialCode": "A7E0-KI8P-L1CW-FFFF",
//     "CD_Status": "Inactive",
//     "CD_DateAdded": "2025-01-02"
//     }
// }
// cdkey post

router.post("/cdkey/insertinfo", (req, res) => {
  const cdkey = req.body.cdkey; // ดึง object cdkey จาก body ที่ client ส่งมา
  if (!cdkey) {
    // ถ้าไม่ส่ง cdkey มาใน body ให้ตอบ 400
    return res
      .status(400)
      .send({ error: true, message: "Please provide cdkey data (cdkey)." });
  }

  dbConn.query("INSERT INTO cdkey SET ? ", cdkey, (error, results) => {
    // ใช้ syntax SET ? ให้ MySQL map key ของ object cdkey เข้ากับคอลัมน์ในตาราง cdkey
    if (error) {
      console.error("DB error at INSERT:", error); // log error ฐานข้อมูลตอน insert พลาด
      return res.status(500).send({ error: true, message: "Database error" }); // ตอบ 500 ถ้า DB มีปัญหา
    }
    return res.send({
      error: false,
      data: { affectedRows: results.affectedRows, insertId: results.insertId }, // affectedRows = จำนวนแถวที่ insert, insertId = id ล่าสุด
      message: "New cdkey has been created successfully.",
    });
  });
});

// Testing update
// method : PUT
// http://localhost:3000/api/cdkey/updateinfo
// test case require keyID (FK) before update 
router.put("/cdkey/updateinfo", (req, res) => {
  const cdkey = req.body.cdkey; // รับข้อมูล cdkey ทั้ง object จาก body
  const cdkeyID = cdkey?.KeyID; // ใช้ KeyID เป็นตัวระบุ row ที่จะ update

  if (!cdkey || !cdkeyID) {
    // ถ้าไม่มี cdkey object หรือไม่มี KeyID ให้ reject
    return res.status(400).send({
      error: true,
      message: "Please provide cdkey data with KeyID.",
    });
  }

  dbConn.query(
    "UPDATE cdkey SET ? WHERE KeyID = ?",
    [cdkey, cdkeyID], // ส่ง cdkey เป็นค่าที่จะ SET และใช้ KeyID ในเงื่อนไข WHERE
    (error, results) => {
      if (error) {
        console.error("DB error at UPDATE:", error); // log error ตอน update ล้มเหลว
        return res
          .status(500)
          .send({ error: true, message: "Database error" }); // ตอบ 500 ถ้ามีปัญหาฐานข้อมูล
      }
      return res.send({
        error: false,
        data: { affectedRows: results.affectedRows }, // แสดงจำนวนแถวที่ถูก update
        message: "cdkey has been updated successfully.",
      });
    }
  );
});

// Testing delete
// method : delete
// http://localhost:3000/api/cdkey/deleteinfo
// body: raw json
// {
//   "KeyID": 888
// }
// cdkey delete
router.delete("/cdkey/deleteinfo", (req, res) => {
  const cdkeyID = req.body.KeyID; // รับ KeyID จาก body มาระบุแถวที่ต้องการลบ

  if (!cdkeyID) {
    // ถ้าไม่ส่ง KeyID มาให้ตอบ 400
    return res
      .status(400)
      .send({ error: true, message: "Please provide KeyID." });
  }

  dbConn.query(
    "DELETE FROM cdkey WHERE KeyID = ?",
    [cdkeyID], // ใช้ KeyID เป็น parameter ใน WHERE
    (error, results) => {
      if (error) {
        console.error("DB error at DELETE:", error); // log error DB ตอนลบ
        return res
          .status(500)
          .send({ error: true, message: "Database error" }); // ตอบ 500 ถ้ามีปัญหา DB
      }
      return res.send({
        error: false,
        data: { affectedRows: results.affectedRows }, // affectedRows = จำนวนแถวที่โดนลบ
        message: "cdkey has been deleted successfully.",
      });
    }
  );
});

// Testing GET Info ID
// method : GET
// http://localhost:3000/api/cdkey/getinfo/1
// http://localhost:3000/api/cdkey/getinfo/2
// body: raw json
// getinfo id 1
router.get("/cdkey/getinfo/:id", (req, res) => {
  const cdkeyID = req.params.id; // รับ id จาก path parameter

  if (!cdkeyID) {
    // ถ้าไม่มี id ใน params ให้ตอบ error กลับไป
    return res
      .status(400)
      .send({ error: true, message: "Please provide cdkey id." });
  }

  dbConn.query(
    "SELECT * FROM cdkey WHERE KeyID = ?",
    [cdkeyID], // ใช้ KeyID จาก URL ไป query หาข้อมูล cdkey ตัวเดียว
    (error, results) => {
      if (error) {
        console.error("DB error at SELECT by id:", error); // log error ถ้า select fail
        return res
          .status(500)
          .send({ error: true, message: "Database error" }); // ตอบ 500 ถ้า DB มีปัญหา
      }
      return res.send({
        error: false,
        data: results[0] || null, // ถ้ามีผลลัพธ์ ใช้แถวแรก ถ้าไม่มีให้เป็น null
        message: "cdkey retrieved.",
      });
    }
  );
});

// Testing GET All
// method : GET
// http://localhost:3000/api/cdkey/getall
// body: raw json
// getall
router.get("/cdkey/getall", (req, res) => {
  dbConn.query("SELECT * FROM cdkey", (error, results) => {
    // query ดึง cdkey ทั้งหมดจากตาราง
    if (error) {
      console.error("DB error at SELECT all:", error); // log error ตอน select fail
      return res
        .status(500)
        .send({ error: true, message: "Database error" }); // ตอบ 500 ถ้ามีปัญหา DB
    }
    return res.send({
      error: false,
      data: results, // ส่ง array ของ cdkey ทั้งหมดกลับไป
      message: "cdkey list.",
    });
  });
});

// Testing GET UserID Keys
// method : GET
// body: raw json
// http://localhost:3000/api/cdkey/mykeys/1
// http://localhost:3000/api/cdkey/mykeys/2
router.get("/cdkey/mykeys/:userId", (req, res) => {
  const userId = req.params.userId; // รับ userId จาก path parameter

  if (!userId) {
    // ถ้าไม่มี userId ใน params ให้ตอบ 400
    return res
      .status(400)
      .send({ error: true, message: "Please provide userId." });
  }

  const sql = `
    SELECT 
    o.OrdID,
    o.UserID,
    o.Ord_Total_Price,
    o.Ord_Quantity,
    p.ProID,
    p.Pro_Name,
    p.Pro_Price,
    ck.KeyID,
    ck.CD_SerialCode,
    ck.CD_Status,
    ck.CD_DateAdded
    FROM Orders o
    LEFT JOIN OrderProduct op ON o.OrdID = op.OrdID
    LEFT JOIN Product p ON op.ProID = p.ProID
    LEFT JOIN CDKey ck ON ck.OrdID = o.OrdID
    WHERE o.UserID = ?
    ORDER BY o.OrdID;
  `; // query รวมข้อมูล order, product, และ cdkey ทั้งหมดของ user คนเดียว

  dbConn.query(sql, [userId], (error, results) => {
    if (error) {
      console.error("DB error at MYKEYS:", error); // log error ถ้าดึง mykeys fail
      return res
        .status(500)
        .send({ error: true, message: "Database error" }); // ตอบ 500 ถ้ามีปัญหา DB
    }

    return res.send({
      error: false,
      data: results, // ส่งรายการ key ทั้งหมดที่สัมพันธ์กับ userId นี้กลับไป
      message: "my keys list.",
    });
  });
});

module.exports = router; // export router ไปให้ไฟล์หลักใช้ mount เป็น /api/cdkey หรือ path ตาม config
