// backend/routes/productRoutes.js
const express = require("express");
const app = express(); // สร้าง instance express แต่ไฟล์นี้หลักๆ ใช้ router
const router = express.Router(); // ใช้ router แยกกลุ่ม route ที่เกี่ยวกับ product
const dbConn = require("../db"); // import การเชื่อมต่อฐานข้อมูล MySQL

// POST /api/product/insertinfo

// Testing insert
// method : insertinfo
// body: raw json
// http://localhost:3000/api/product/insertinfo
// {
//     "product": {
//         "ProID": 699,
//         "Pro_Name": "OG",
//         "Pro_Price": 1890,
//         "Pro_Platform": "PC",
//         "Pro_Status": "inactive",
//         "Pro_Publisher": "Larian Studios",
//         "Pro_Developer": "Larian Studios",
//         "Pro_Description": "RPG เทิร์นเบสดัดแปลงจากกฎ D&D เนื้อเรื่องเข้ม",
//         "Pro_ReleaseDate": "2023-08-03",
//         "Pro_Image": "/assets/steamimg.jpg",
//         "CatID": 102 
//     }
// }
// {
//     "product": {
//     "ProID": 698,
//     "Pro_Name": "RoBLOX1",
//     "Pro_Price": 890,
//     "Pro_Platform": "PC",
//     "Pro_Status": "active",
//     "Pro_Publisher": "Mojang",
//     "Pro_Developer": "Mojang",
//     "Pro_Description": "เกม sandbox สร้างโลกได้อิสระ เล่นเดี่ยว/ออนไลน์",
//     "Pro_ReleaseDate": "2011-11-18",
//     "Pro_Image": "/assets/steamimg.jpg",
//     "CatID": 104
//     }
// }

router.post("/product/insertinfo", (req, res) => {
  const product = req.body.product; // ดึง object product จาก body ที่ client ส่งมา
  if (!product) {
    // ถ้าไม่มี field product ใน body ให้ตอบ 400 ทันที
    return res
      .status(400)
      .send({ error: true, message: "Please provide product data (product)." });
  }

  dbConn.query("INSERT INTO Product SET ? ", product, (error, results) => {
    // ใช้ syntax SET ? ให้ MySQL map key ใน object product เข้า column ใน table Product อัตโนมัติ
    if (error) {
      console.error("DB error at INSERT:", error); // log error กรณี insert ไม่สำเร็จ
      return res.status(500).send({ error: true, message: "Database error" }); // ตอบ 500 ถ้าฐานข้อมูลมีปัญหา
    }
    return res.send({
      error: false,
      data: { affectedRows: results.affectedRows, insertId: results.insertId }, // affectedRows = จำนวน row ที่ insert, insertId = id ล่าสุด
      message: "New product has been created successfully.",
    });
  });
});

// Testing UPDATE
// method : PUT
// body: raw json
// http://localhost:3000/api/product/updateinfo
// {
//     "product": {
//         "ProID": 699,
//         "Pro_Name": "Beyond Divinity",
//         "Pro_Price": 1890,
//         "Pro_Platform": "PC",
//         "Pro_Status": "inactive",
//         "Pro_Publisher": "Larian Studios",
//         "Pro_Developer": "Larian Studios",
//         "Pro_Description": "RPG เทิร์นเบสดัดแปลงจากกฎ D&D เนื้อเรื่องเข้ม",
//         "Pro_ReleaseDate": "2023-08-03",
//         "Pro_Image": "/assets/steamimg.jpg",
//         "CatID": 102 
//     }
// }
//
// {
//     "product": {
//     "ProID": 698,
//     "Pro_Name": "Minecraft Bedrock Edition",
//     "Pro_Price": 890,
//     "Pro_Platform": "PC",
//     "Pro_Status": "active",
//     "Pro_Publisher": "Microsoft",
//     "Pro_Developer": "Mojang",
//     "Pro_Description": "เกม sandbox สร้างโลกได้อิสระ เล่นเดี่ยว/ออนไลน์",
//     "Pro_ReleaseDate": "2011-11-18",
//     "Pro_Image": "/assets/steamimg.jpg",
//     "CatID": 104
//     }
// }
router.put("/product/updateinfo", (req, res) => {
  const product = req.body.product; // รับข้อมูล product ที่ต้องการอัปเดตจาก body
  const productId = product?.ProID; // ใช้ ProID เป็น key ระบุว่าจะอัปเดตแถวไหน

  if (!product || !productId) {
    // ถ้าไม่มี object product หรือไม่มี ProID ให้ reject ด้วย 400
    return res.status(400).send({
      error: true,
      message: "Please provide product data with ProID.",
    });
  }

  dbConn.query(
    "UPDATE Product SET ? WHERE ProID = ?",
    [product, productId], // ใช้ product เป็นค่า SET และใช้ ProID เป็นเงื่อนไขใน WHERE
    (error, results) => {
      if (error) {
        console.error("DB error at UPDATE:", error); // log error ตอน update ล้มเหลว
        return res
          .status(500)
          .send({ error: true, message: "Database error" }); // ตอบ 500 ถ้าฐานข้อมูลมีปัญหา
      }
      return res.send({
        error: false,
        data: { affectedRows: results.affectedRows }, // จำนวน row ที่ถูก update
        message: "Product has been updated successfully.",
      });
    }
  );
});

// Testing delete
// method : DELETE
// body: raw json
// http://localhost:3000/api/product/deleteinfo
// {
//     "ProID": 699
// }
// {
//     "ProID": 698
// }
router.delete("/product/deleteinfo", (req, res) => {
  const productId = req.body.ProID; // รับ ProID จาก body เพื่อใช้ลบ product

  if (!productId) {
    // ถ้าไม่ส่ง ProID มาให้ตอบ 400
    return res
      .status(400)
      .send({ error: true, message: "Please provide ProID." });
  }

  dbConn.query(
    "DELETE FROM Product WHERE ProID = ?",
    [productId], // ใช้ ProID เป็น parameter ใน WHERE
    (error, results) => {
      if (error) {
        console.error("DB error at DELETE:", error); // log error ตอนลบไม่สำเร็จ
        return res
          .status(500)
          .send({ error: true, message: "Database error" }); // ตอบ 500 ถ้าฐานข้อมูลมีปัญหา
      }
      return res.send({
        error: false,
        data: { affectedRows: results.affectedRows }, // จำนวน row ที่ถูกลบ
        message: "Product has been deleted successfully.",
      });
    }
  );
});

// Testing get product id info
// method : GET
// body: raw json
// http://localhost:3000/api/product/getinfo/1
// http://localhost:3000/api/product/getinfo/2
router.get("/product/getinfo/:id", (req, res) => {
  const productId = req.params.id; // รับ id จาก path parameter

  if (!productId) {
    // ถ้าไม่มี id ใน params ให้ตอบ 400
    return res
      .status(400)
      .send({ error: true, message: "Please provide product id." });
  }

  dbConn.query(
    "SELECT * FROM Product WHERE ProID = ?",
    [productId], // ใช้ ProID จาก URL ไป query หา product ตัวเดียว
    (error, results) => {
      if (error) {
        console.error("DB error at SELECT by id:", error); // log error ตอน select by id fail
        return res
          .status(500)
          .send({ error: true, message: "Database error" }); // ตอบ 500 ถ้าฐานข้อมูลมีปัญหา
      }
      return res.send({
        error: false,
        data: results[0] || null, // ถ้ามี row ส่งแถวแรก ไม่มีก็ส่ง null
        message: "Product retrieved.",
      });
    }
  );
});

// Testing get product id info
// method : GET
// body: raw json
// http://localhost:3000/api/product/getall
// GET /product/getall  (จะถูกเรียกเป็น /api/product/getall จาก server.js)
router.get("/product/getall", (req, res) => {
  // 1) ดึงสินค้าทั้งหมด
  const sqlProducts = "SELECT * FROM Product"; // query หลักสำหรับดึง product list

  // 2) ดึง mapping ระหว่าง Product <-> Category
  const sqlMapping = `
    SELECT pc.ProID, c.CatID, c.Cat_Name
    FROM productcategory pc
    JOIN Category c ON pc.CatID = c.CatID
  `;
  // ตาราง productcategory ทำหน้าที่เป็นตารางกลาง many-to-many ระหว่าง Product กับ Category
  // ดึง ProID, CatID, Cat_Name ออกมาประกอบกัน

  dbConn.query(sqlProducts, (err1, products) => {
    if (err1) {
      console.error("DB error at SELECT Product:", err1); // log error ถ้าดึง product fail
      return res
        .status(500)
        .send({ error: true, message: "Database error (product)" }); // ตอบ 500 ถ้าฝั่ง product query พัง
    }

    dbConn.query(sqlMapping, (err2, mapping) => {
      if (err2) {
        console.error("DB error at SELECT mapping:", err2); // log error ถ้าดึง mapping fail
        return res
          .status(500)
          .send({ error: true, message: "Database error (mapping)" }); // ตอบ 500 ถ้าฝั่ง mapping พัง
      }

      // เอา mapping มา group ตาม ProID
      const map = {}; // object ใช้เก็บ list ของ category ต่อ product แต่ละตัว
      mapping.forEach((row) => {
        if (!map[row.ProID]) map[row.ProID] = []; // ถ้ายังไม่มี array สำหรับ ProID นี้ ให้สร้างใหม่
        map[row.ProID].push({
          CatID: row.CatID,
          Cat_Name: row.Cat_Name,
        }); // push category ที่เกี่ยวข้องเข้าไป
      });

      // ผูก categories เข้าไปในแต่ละ product
      const output = products.map((p) => ({
        ...p, // กระจายข้อมูล product เดิม
        categories: map[p.ProID] || [], // เพิ่ม field categories เป็น array ของหมวดหมู่ที่แมปได้ (ถ้าไม่เจอให้เป็น [])
      }));

      return res.send({
        error: false,
        data: output, // ส่ง product แต่ละตัวพร้อม array ของ categories กลับไป
        message: "Product list with categories.",
      });
    });
  });
});


module.exports = router; // export router ให้ไฟล์หลักเอาไป mount เป็น /api/product
