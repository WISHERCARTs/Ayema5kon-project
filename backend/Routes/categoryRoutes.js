// backend/routes/categoryRoutes.js
const express = require("express");
const app = express(); // สร้าง instance ของ express แต่ในไฟล์นี้ใช้แค่ router เป็นหลัก
const router = express.Router(); // ใช้ router แยกกลุ่ม route ของ Category ออกจากไฟล์หลัก
const dbConn = require("../db"); // import การเชื่อมต่อฐานข้อมูลจากไฟล์ db

// POST /api/category/insertinfo
// Testing insert
// method : post
// http://localhost:3000/api/category/insertinfo
// body: raw json
// {
//     "category": {
//         "CatID": 888,
//         "Cat_Name": "James",
//         "Cat_Description": "ff"
//     }
// }
// and
// {
//     "category": {
//         "CatID": 999,
//         "Cat_Name": "Noble",
//         "Cat_Description": "gg"
//     }
// }
// post insertinfo
router.post("/category/insertinfo", (req, res) => {
  const category = req.body.category; // ดึง object category จาก body ที่ client ส่งมา

  if (!category) {
    // ถ้า body ไม่มี field category ให้ตอบ 400 กลับไป
    return res
      .status(400)
      .send({ error: true, message: "Please provide Category data (Category)." });
  }

  dbConn.query("INSERT INTO Category SET ? ", category, (error, results) => {
    // ใช้ syntax SET ? ให้ MySQL map key ของ object category เข้ากับคอลัมน์เอง
    if (error) {
      console.error("DB error at INSERT:", error); // log error ไว้ฝั่ง server
      return res.status(500).send({ error: true, message: "Database error" }); // ตอบ error ถ้า insert ไม่สำเร็จ
    }
    return res.send({
      // ถ้า insert สำเร็จ ส่งผลลัพธ์กลับไปให้ client
      error: false,
      data: { affectedRows: results.affectedRows, insertId: results.insertId }, // affectedRows คือจำนวน row ที่โดน insert, insertId คือ id ล่าสุด
      message: "New Category has been created successfully.",
    });
  });
});

// PUT /api/category/updateinfo
// Testing UPDATE
// method : PUT
// http://localhost:3000/api/category/updateinfo
// body: raw json
// {
//     "category": {
//         "CatID": 888,
//         "Cat_Name": "James",
//         "Cat_Description": "555555555555555555555"
//     }
// }
// and
// {
//     "category": {
//         "CatID": 999,
//         "Cat_Name": "Noble",
//         "Cat_Description": "1231543215346456743235423"
//     }
// }
// put updateinfo
router.put("/category/updateinfo", (req, res) => {
  const category = req.body.category; // รับข้อมูล category ทั้งก้อนจาก body
  const categoryId = category?.CatID; // ดึง CatID จาก object เพื่อนำไปใช้ใน WHERE

  if (!category || !categoryId) {
    // ถ้าไม่มี object category หรือไม่มี CatID ให้ reject ทันที
    return res.status(400).send({
      error: true,
      message: "Please provide category data with CatID.",
    });
  }

  dbConn.query(
    "UPDATE Category SET ? WHERE CatID = ?",
    [category, categoryId], // ส่ง object category เป็นค่า SET และใช้ CatID เป็น condition ใน WHERE
    (error, results) => {
      if (error) {
        console.error("DB error at UPDATE:", error); // log ข้อผิดพลาดจาก DB
        return res
          .status(500)
          .send({ error: true, message: "Database error" }); // ตอบ 500 ถ้า update fail
      }
      return res.send({
        error: false,
        data: { affectedRows: results.affectedRows }, // affectedRows บอกว่ามี record ที่ถูก update กี่แถว
        message: "Category has been updated successfully.",
      });
    }
  );
});

// POST /api/category/deleteinfo
// Testing insert
// method : post
// http://localhost:3000/api/category/deleteinfo
// body: raw json
// {
//         "CatID": 999
//     }
// and
// {
//         "CatID": 888
//     }
// delete deleteinfo
router.delete("/category/deleteinfo", (req, res) => {
  const categoryID = req.body.CatID; // ใช้ CatID จาก body เป็นตัวบอกว่าจะลบ row ไหน

  if (!categoryID) {
    // ถ้าไม่ส่ง CatID มาให้ตอบ 400
    return res
      .status(400)
      .send({ error: true, message: "Please provide CatID." });
  }

  dbConn.query(
    "DELETE FROM Category WHERE CatID = ?",
    [categoryID], // ใช้ CatID เป็น parameter ใน WHERE
    (error, results) => {
      if (error) {
        console.error("DB error at DELETE:", error); // log error DB ตอนลบ
        return res
          .status(500)
          .send({ error: true, message: "Database error" }); // ตอบ 500 ถ้า delete ล้มเหลว
      }
      return res.send({
        error: false,
        data: { affectedRows: results.affectedRows }, // ดูจำนวนแถวที่ถูกลบจาก affectedRows
        message: "Category has been deleted successfully.",
      });
    }
  );
});

// Testing GET Category ID
// method : GET
// http://localhost:3000/api/category/getinfo/1
// http://localhost:3000/api/category/getinfo/2
// body: raw json
router.get("/category/getinfo/:id", (req, res) => {
  const categoryID = req.params.id; // รับพารามิเตอร์ id จาก URL path

  if (!categoryID) {
    // ถ้าไม่มี id ใน params ให้ตอบ error
    return res
      .status(400)
      .send({ error: true, message: "Please provide category id." });
  }

  dbConn.query(
    "SELECT * FROM Category WHERE CatID = ?",
    [categoryID], // ใช้ CatID จาก params ไป query หา record เดียว
    (error, results) => {
      if (error) {
        console.error("DB error at SELECT by id:", error); // log error ถ้า select fail
        return res
          .status(500)
          .send({ error: true, message: "Database error" }); // ตอบ 500 ให้ client
      }
      return res.send({
        error: false,
        data: results[0] || null, // ถ้าเจออย่างน้อย 1 แถว ใช้อันแรก ไม่งั้นส่ง null
        message: "Category retrieved.",
      });
    }
  );
});

// Testing GET All
// method : GET
// http://localhost:3000/api/category/getall
// body: raw json
// getall
router.get("/category/getall", (req, res) => {
  dbConn.query("SELECT * FROM Category", (error, results) => {
    // query ดึงข้อมูลทุก row จากตาราง Category
    if (error) {
      console.error("DB error at SELECT all:", error); // log error เวลา select fail
      return res
        .status(500)
        .send({ error: true, message: "Database error" }); // ตอบ 500 ถ้ามีปัญหาฐานข้อมูล
    }
    return res.send({
      error: false,
      data: results, // ส่ง result ทั้ง array กลับให้ client
      message: "Category list.",
    });
  });
});

module.exports = router; // export router ออกไปให้ไฟล์หลักนำไปใช้ mount เป็น /api/category หรือ path ที่กำหนด
