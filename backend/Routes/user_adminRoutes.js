// backend/routes/useradminRoutes.js
const express = require("express");
const app = express(); // สร้าง instance express (ไฟล์นี้ใช้ router เป็นหลัก)
const router = express.Router(); // ใช้ router แยก route ของ useradmin ออกจาก main app
const dbConn = require("../db"); // import การเชื่อมต่อฐานข้อมูล

// POST /api/useradmin/insertinfo
// Testing Insert
// method : POST
// body: raw json
// http://localhost:3000/api/useradmin/insertinfo
// {
//     "useradmin": {
//     "UserID": 603,
//     "UA_Username": "admin001",
//     "UA_Password": "123456",
//     "UA_Role": "Administrator",
//     "UA_FName": "Somchai",
//     "UA_LName": "Suksan",
//     "UA_Status": "Active"
//     }
// }
// {
//     "useradmin": {
//     "UserID": 604,
//     "UA_Username": "admin007",
//     "UA_Password": "654321",
//     "UA_Role": "Administrator",
//     "UA_FName": "Chai",
//     "UA_LName": "Sard",
//     "UA_Status": "Active"
//     }
// }


router.post("/useradmin/insertinfo", (req, res) => {
  const useradmin = req.body.useradmin; // ดึง object useradmin จาก body ที่ client ส่งมา
  if (!useradmin) {
    // ถ้าไม่ส่ง field useradmin มาใน body ให้ response 400 กลับไป
    return res
      .status(400)
      .send({ error: true, message: "Please provide useradmin data (useradmin)." });
  }

  dbConn.query("INSERT INTO useradmin SET ? ", useradmin, (error, results) => {
    // ใช้ syntax SET ? ให้ MySQL map key ใน object useradmin เข้ากับ column ใน table useradmin
    if (error) {
      console.error("DB error at INSERT:", error); // log error กรณี insert ไม่สำเร็จ
      return res.status(500).send({ error: true, message: "Database error" }); // ตอบ 500 ถ้าฐานข้อมูลมีปัญหา
    }
    return res.send({
      error: false,
      data: { affectedRows: results.affectedRows, insertId: results.insertId }, // affectedRows = จำนวนแถวที่ insert, insertId = PK ล่าสุด
      message: "New useradmin has been created successfully.",
    });
  });
});

// Testing Update
// method : PUT
// body: raw json
// http://localhost:3000/api/useradmin/updateinfo
// {
//     "useradmin": {
//     "UserID": 603,
//     "UA_Username": "admin001",
//     "UA_Password": "123456",
//     "UA_Role": "Administrator",
//     "UA_FName": "James",
//     "UA_LName": "Dean",
//     "UA_Status": "Active"
//     }
// }
// {
//     "useradmin": {
//     "UserID": 604,
//     "UA_Username": "admin007",
//     "UA_Password": "654321",
//     "UA_Role": "Administrator",
//     "UA_FName": "Wish",
//     "UA_LName": "OK",
//     "UA_Status": "Active"
//     }
// }

router.put("/useradmin/updateinfo", (req, res) => {
  const useradmin = req.body.useradmin; // รับข้อมูล useradmin ที่ต้องการอัปเดตจาก body
  const useradminId = useradmin?.UserID; // ใช้ UserID เป็น key บอกว่า record ไหนต้องถูกอัปเดต

  if (!useradmin || !useradminId) {
    // ถ้าไม่มี object useradmin หรือไม่มี UserID ให้ reject ด้วย 400
    return res.status(400).send({
      error: true,
      message: "Please provide useradmin data with UserID.",
    });
  }

  dbConn.query(
    "UPDATE useradmin SET ? WHERE UserID = ?",
    [useradmin, useradminId], // ใช้ useradmin เป็นค่า SET และใช้ UserID เป็นเงื่อนไขใน WHERE
    (error, results) => {
      if (error) {
        console.error("DB error at UPDATE:", error); // log error ตอน update ล้มเหลว
        return res
          .status(500)
          .send({ error: true, message: "Database error" }); // ตอบ 500 ถ้าฐานข้อมูลพัง
      }
      return res.send({
        error: false,
        data: { affectedRows: results.affectedRows }, // จำนวนแถวที่ถูก update
        message: "useradmin has been updated successfully.",
      });
    }
  );
});

router.delete("/useradmin/deleteinfo", (req, res) => {
  const useradminId = req.body.UserID; // รับ UserID จาก body เพื่อระบุว่าจะลบ user คนไหน

  if (!useradminId) {
    // ถ้าไม่ส่ง UserID มาให้ตอบ 400
    return res
      .status(400)
      .send({ error: true, message: "Please provide UserID." });
  }

  dbConn.query(
    "DELETE FROM useradmin WHERE UserID = ?",
    [useradminId], // ใช้ UserID เป็น parameter ใน WHERE
    (error, results) => {
      if (error) {
        console.error("DB error at DELETE:", error); // log error ตอน delete ไม่ผ่าน
        return res
          .status(500)
          .send({ error: true, message: "Database error" }); // ตอบ 500 ถ้าฐานข้อมูลมีปัญหา
      }
      return res.send({
        error: false,
        data: { affectedRows: results.affectedRows }, // จำนวนแถวที่ถูกลบออกจาก table
        message: "useradmin has been deleted successfully.",
      });
    }
  );
});

// Testing GET UserAdmin Info by ID
// method : GET
// body: raw json
// http://localhost:3000/api/useradmin/getinfo/1
// http://localhost:3000/api/useradmin/getinfo/2

router.get("/useradmin/getinfo/:id", (req, res) => {
  const useradminId = req.params.id; // รับ id จาก path parameter

  if (!useradminId) {
    // ถ้าไม่มี id ใน params (เคสนี้ปกติจะมีเสมอ) ให้กันไว้ก่อน
    return res
      .status(400)
      .send({ error: true, message: "Please provide useradmin id." });
  }

  dbConn.query(
    "SELECT * FROM useradmin WHERE UserID = ?",
    [useradminId], // ใช้ UserID จาก URL ไป query หา useradmin 1 record
    (error, results) => {
      if (error) {
        console.error("DB error at SELECT by id:", error); // log error ตอน select fail
        return res
          .status(500)
          .send({ error: true, message: "Database error" }); // ตอบ 500 ถ้าฐานข้อมูลมีปัญหา
      }
      return res.send({
        error: false,
        data: results[0] || null, // ถ้ามีผลลัพธ์ส่งแถวแรก ถ้าไม่มีก็ส่ง null
        message: "useradmin retrieved.",
      });
    }
  );
});

// Testing GET All
// method : GET
// body: raw json
// http://localhost:3000/api/useradmin/getall
router.get("/useradmin/getall", (req, res) => {
  dbConn.query("SELECT * FROM useradmin", (error, results) => {
    // ดึง useradmin ทั้งหมดจาก table useradmin
    if (error) {
      console.error("DB error at SELECT all:", error); // log error ตอน select all fail
      return res
        .status(500)
        .send({ error: true, message: "Database error" }); // ตอบ 500 ถ้าฐานข้อมูลมีปัญหา
    }
    return res.send({
      error: false,
      data: results, // ส่ง list useradmin ทั้งหมดกลับไป
      message: "useradmin list.",
    });
  });
});

module.exports = router; // export router ให้ไฟล์หลักเอาไป mount เป็น /api/useradmin หรือ prefix ตาม config
