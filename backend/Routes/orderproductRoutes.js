// backend/routes/orderProductRoutes.js
const express = require("express");
const app = express(); // สร้าง instance ของ express แต่ในไฟล์นี้ใช้ router เป็นหลัก
const router = express.Router(); // ใช้ router แยกกลุ่ม route ของ orderProduct
const dbConn = require("../db"); // import การเชื่อมต่อฐานข้อมูล

// POST /api/orderProduct/insertinfo
//ส่วนนี้ไม่สามารถทำได้ใน Postman เนื่องจากติด Foreign Key ใน Database ต้องทำในหน้าเว็บไซต์

router.post("/orderproduct/insertinfo", (req, res) => {
  const orderProduct = req.body.orderproduct; // ดึง object orderproduct จาก body ที่ client ส่งมา
  if (!orderProduct) {
    // ถ้าไม่มี orderproduct ใน body ให้ตอบ 400
    return res
      .status(400)
      .send({ error: true, message: "Please provide OrderProduct data (orderproduct)." });
  }

  dbConn.query("INSERT INTO orderProduct SET ? ", orderProduct, (error, results) => {
    // ใช้ SET ? map key ใน object orderProduct เข้ากับ column ใน table orderProduct
    if (error) {
      console.error("DB error at INSERT:", error); // log error ฐานข้อมูลตอน insert ไม่ผ่าน
      return res.status(500).send({ error: true, message: "Database error" }); // ตอบ 500 ถ้า DB มีปัญหา
    }
    return res.send({
      error: false,
      data: { affectedRows: results.affectedRows, insertId: results.insertId }, // affectedRows = จำนวน row ที่ insert, insertId = PK ล่าสุด
      message: "New orderProduct has been created successfully.",
    });
  });
});

// PUT /api/orderProduct/updateinfo
//ส่วนนี้ไม่สามารถทำได้ใน Postman เนื่องจากติด Foreign Key ใน Database ต้องทำในหน้าเว็บไซต์

router.put("/orderproduct/updateinfo", (req, res) => {
  const orderProduct = req.body.orderproduct; // ข้อมูล orderproduct ที่จะเอามา update
  const orderProductProID = orderProduct?.ProID; // ใช้ ProID เป็นส่วนหนึ่งของ key จาก body
  const orderProductOrdID = orderProduct?.OrdID; // ใช้ OrdID เป็นอีกส่วนของ key จาก body

  if (!orderProduct || !orderProductOrdID || !orderProductProID) {
    // เช็คว่ามี object และมีทั้ง OrdID, ProID ก่อนค่อยทำ
    return res.status(400).send({
      error: true,
      message: "Please provide product data with ProID or OrdID.",
      // ข้อความบอก "or" แต่ if เช็คแบบต้องมีทั้งคู่ (AND) จริงๆ ตามเงื่อนไขนี้
    });
  }

  dbConn.query(
    "UPDATE orderProduct SET ? WHERE ProID = ? OR OrdID = ?",
    [orderProduct, orderProductProID, orderProductOrdID], // ใช้ข้อมูลทั้งหมดใน orderProduct เป็นค่า SET และใช้ ProID หรือ OrdID เป็นเงื่อนไข
    (error, results) => {
      if (error) {
        console.error("DB error at UPDATE:", error); // log error ตอน update fail
        return res
          .status(500)
          .send({ error: true, message: "Database error" }); // ตอบ 500 ถ้า DB มีปัญหา
      }
      return res.send({
        error: false,
        data: { affectedRows: results.affectedRows }, // แสดงจำนวน row ที่ถูก update
        message: "orderProduct has been updated successfully.",
      });
    }
  );
});

// Testing delete
//ส่วนนี้ไม่สามารถทำได้ใน Postman เนื่องจากติด Foreign Key ใน Database ต้องทำในหน้าเว็บไซต์

router.delete("/orderproduct/deleteinfo", (req, res) => {
  const orderProductProID = orderProduct?.ProID;
  const orderProductOrdID = orderProduct?.OrdID;
  // ตรงนี้ใช้ตัวแปร orderProduct แต่ไม่มีการประกาศจาก req.body เหมือนด้านบน จะทำให้ ReferenceError ทันทีตอนเรียก route
  // ถ้าจะใช้จาก body เหมือนกันควรอ่านจาก req.body ก่อน แล้วค่อยดึง ProID/OrdID แต่ตอนนี้ยังไม่ได้ทำ (แค่คอมเมนต์ไว้ ไม่แก้โค้ด)

  if (!orderProductProID||orderProductOrdID) {
    // เงื่อนไขนี้เขียนแบบไม่มีเว้นวรรคชัดเจน และ logic ตอนนี้คือ:
    // ถ้าไม่มี ProID หรือ OrdID มีค่า truthy จะเข้า if
    // น่าจะตั้งใจเช็คว่า "ถ้าไม่มี ProID และไม่มี OrdID" แต่เขียนผิด logic ตรงนี้ (บอกไว้ในคอมเมนต์เฉยๆ)
    return res
      .status(400)
      .send({ error: true, message: "Please provide ProID or OrdID." });
  }

  dbConn.query(
    "DELETE FROM orderProductOrdID WHERE ProID = ? OR OrdID = ?",
    [orderProductProID,orderProductOrdID],
    (error, results) => {
      // ชื่อ table ใน DELETE ตอนนี้เป็น orderProductOrdID ซึ่งต่างจาก table อื่นที่ใช้ชื่อ orderProduct
      // ถ้าใน DB ไม่มี table ชื่อนี้จริงจะ error ตลอด
      if (error) {
        console.error("DB error at DELETE:", error); // log error ตอน delete fail
        return res
          .status(500)
          .send({ error: true, message: "Database error" }); // ตอบ 500 ถ้า DB มีปัญหา
      }
      return res.send({
        error: false,
        data: { affectedRows: results.affectedRows }, // แสดงจำนวน row ที่ถูกลบ
        message: "orderProduct has been deleted successfully.",
      });
    }
  );
});

// Testing Get OrderProduct ID Info
// method : GET
// body: raw json
// http://localhost:3000/api/orderproduct/getinfo/101
// http://localhost:3000/api/orderproduct/getinfo/102

router.get("/orderproduct/getinfo/:id", (req, res) => {
  const orderProductProID = req.params.id;
  const orderProductOrdID = req.params.id;
  // ทั้งสองตัวใช้ค่าจาก params ตัวเดียวกัน (id เดียว) คือเอาไปแมทช์ทั้ง ProID และ OrdID พร้อมกัน

  if (!orderProductProID||!orderProductOrdID) {
    // เงื่อนไขนี้ ถ้า id มีค่ามาแล้วจริงๆ ทั้งสองตัวก็ truthy เหมือนกัน จะไม่เข้า if เลย
    // แต่ถ้า params.id ไม่มีมา ทั้งสองตัวจะ falsy แล้วเป็น (!false || !false) -> true เลยเข้า if
    return res
      .status(400)
      .send({ error: true, message: "Please provide orderProduct id." });
  }

  dbConn.query(
    "SELECT * FROM orderProduct WHERE ProID = ? || OrdID = ?",
    [orderProductProID,orderProductOrdID], // ใช้ id เดียวไปเทียบทั้ง ProID และ OrdID ผ่าน OR
    (error, results) => {
      if (error) {
        console.error("DB error at SELECT by id:", error); // log error ตอน select fail
        return res
          .status(500)
          .send({ error: true, message: "Database error" }); // ตอบ 500 ถ้า DB มีปัญหา
      }
      return res.send({
        error: false,
        data: results[0] || null, // ถ้ามี row ส่งแถวแรก ไม่มีก็ส่ง null
        message: "orderProduct retrieved.",
      });
    }
  );  
});

// Testing Get All
// method : GET
// body: raw json
// http://localhost:3000/api/orderproduct/getall
router.get("/orderproduct/getall", (req, res) => {
  dbConn.query("SELECT * FROM orderProduct", (error, results) => {
    // ดึงข้อมูล orderProduct ทุก row จาก table orderProduct
    if (error) {
      console.error("DB error at SELECT all:", error); // log error ตอน select fail
      return res
        .status(500)
        .send({ error: true, message: "Database error" }); // ตอบ 500 ถ้า DB ล่มหรือ query พัง
    }
    return res.send({
      error: false,
      data: results, // ส่ง array ของ orderProduct ทั้งหมดกลับไป
      message: "orderProduct list.",
    });
  });
});

module.exports = router; // export router ไปให้ไฟล์หลักเอาไป mount เป็น /api/orderproduct หรือ path ที่ต้องการ
