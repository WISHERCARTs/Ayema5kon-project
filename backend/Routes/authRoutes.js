// backend/routes/authRoutes.js

const express = require("express");
const jwt = require("jsonwebtoken");
const dbConn = require("../db");
const router = express.Router(); // สร้าง router สำหรับกลุ่ม route auth แยกจาก main app

// helper สำหรับเขียน log ลง AuthLog
function logAuthEvent(userId, action, req) {
  const logData = {
    UserID: userId || null,
    Action: action,
    IPAddress: req.ip || null,
    UserAgent: req.headers["user-agent"] || null,
  };

  dbConn.query("INSERT INTO AuthLog SET ?", logData, (err) => {
    if (err) {
      // ถ้า log พัง ห้ามไป break flow หลัก
      console.error("AuthLog insert error:", err);
    }
    // ไม่มี res.json ตรงนี้ เพราะไม่อยากกระทบ response เดิม
  });
}

// POST /api/auth/login
//ส่วนนี้ไม่สามารถทำได้ใน Postman ต้องทำในหน้าเว็บไซต์
router.post("/login", (req, res) => {
  const { username, password } = req.body; // ดึง username, password จาก body ที่ client ส่งมา

  if (!username || !password) {
    // ถ้าขาด username หรือ password ให้ตอบ 400 ทันที
    return res
      .status(400)
      .json({ error: true, message: "Missing credentials" });
  }

  dbConn.query(
    "SELECT * FROM Useradmin WHERE UA_Username = ?",
    [username], // ใช้ parameterized query กัน SQL injection
    (err, rows) => {
      if (err) {
        console.error("DB error:", err); // log error ฝั่ง server
        return res.status(500).json({ error: true, message: "DB error" }); // ตอบ error 500 กลับไป
      }
      if (rows.length === 0) {
        
        // ถ้าไม่เจอ user ตาม username ให้ถือว่า login ไม่ผ่าน
        logAuthEvent(user.UserID, "LOGIN_FAIL", req);
        return res
          .status(401)
          .json({ error: true, message: "Invalid username or password" });
      }

      const user = rows[0]; // ดึง row แรกมาใช้เพราะ username ควร unique

      if (password !== user.UA_Password) {
        // เช็กรหัสผ่านแบบ plain text เทียบกับ UA_Password ใน DB
        logAuthEvent(user.UserID, "LOGIN_FAIL", req);
        return res
          .status(401)
          .json({ error: true, message: "Invalid username or password" });
      }

      const rawRole = user.UA_Role || "user"; // ถ้าใน DB ไม่มี role ให้ default เป็น user
      const normalizedRole = rawRole.toString().trim().toLowerCase(); // normalize ให้เป็นตัวพิมพ์เล็ก ใช้ในระบบได้ง่าย

      const payload = {
        userId: user.UserID,  // ถ้าใน DB ชื่อคอลัมน์ต่างจากนี้ ปรับให้ตรงตรงนี้
        role: normalizedRole, // ฝัง role ลงไปใน payload ของ token
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h", // token มีอายุ 2 ชั่วโมง
      });
      
      logAuthEvent(user.UserID, "LOGIN_SUCCESS", req);
      return res.json({
        error: false,
        token, // ส่ง JWT token กลับไปให้ client เอาไปเก็บ (เช่น localStorage)
        user: {
          id: user.UserID, // id หลักของ user จากตาราง Useradmin
          username: user.UA_Username,
          role: normalizedRole,           // "admin" หรือ "user"
          email: user.UA_email || null,   // ถ้าไม่มี email ให้เป็น null
        },
      });
    }
  );
});

// POST /api/auth/register เพิ้มขึ้นมา 
//ส่วนนี้ไม่สามารถทำได้ใน Postman ต้องทำในหน้าเว็บไซต์
router.post("/register", (req, res) => {
  const { username, password, email } = req.body; // ดึงข้อมูลสมัครสมาชิกจาก body

  if (!username || !password) {
    // บังคับให้มี username และ password เสมอ
    return res.status(400).json({
      error: true,
      message: "Username and password are required",
    });
  }

  // เช็คว่า username ซ้ำไหม
  dbConn.query(
    "SELECT 1 FROM Useradmin WHERE UA_Username = ?",
    [username], // query ตรวจว่ามี username นี้อยู่แล้วหรือยัง
    (err, rows) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ error: true, message: "DB error" });
      }
      if (rows.length > 0) {
        // ถ้ามี row แสดงว่า username ถูกใช้ไปแล้ว
        return res
          .status(400)
          .json({ error: true, message: "Username is already taken" });
      }

      const newUser = {
        UA_Username: username,
        UA_Password: password,    // เก็บ password แบบ plain text (ถ้าจะ secure ต้อง hash เพิ่มเองในอนาคต)
        UA_Role: "User",          // สมัครใหม่เป็น user เสมอ
        UA_FName: null,           // ให้เป็น null ไว้ก่อน ถ้ายังไม่เก็บชื่อจริง
        UA_LName: null,
        UA_Status: "Active",      // สถานะ default เป็น Active
        UA_email: email || null,  // ถ้าไม่มี email ส่งมาให้เป็น null
      };

      dbConn.query(
        "INSERT INTO Useradmin SET ?",
        newUser, // insert object newUser เข้า table Useradmin
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("DB error at INSERT:", insertErr);
            return res
              .status(500)
              .json({ error: true, message: "DB insert error" });
          }

          // หลังจาก insert เสร็จ ดึงข้อมูล user ที่เพิ่งสร้างขึ้นมาอีกครั้ง
          dbConn.query(
            "SELECT * FROM Useradmin WHERE UA_Username = ?",
            [username],
            (selErr, rows2) => {
              if (selErr) {
                console.error("DB error at SELECT:", selErr);
                return res
                  .status(500)
                  .json({ error: true, message: "DB error" });
              }

              const user = rows2[0]; // ได้ user ที่เพิ่งสมัครใหม่มา
              const rawRole = user.UA_Role || "user";
              const normalizedRole = rawRole.toString().trim().toLowerCase(); // normalize role ก่อนใช้

              const payload = {
                userId: user.UserID, // UserID ไม่ใช่ UA_ID
                role: normalizedRole, // role ที่ใช้ในระบบ
              };

              const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h", // token สำหรับ user ใหม่มีอายุ 2 ชั่วโมงเช่นกัน
              });

              return res.status(201).json({
                error: false,
                token, // ส่ง token หลังสมัครเสร็จให้ login auto ได้เลย
                user: {
                  id: user.UserID, // UserID ไม่ใช่ UA_ID
                  username: user.UA_Username,
                  role: normalizedRole,           // "user"
                  email: user.UA_email || null,
                },
              });
            }
          );
        }
      );
    }
  );
});

module.exports = router; // export router ออกไปให้ไฟล์หลักเอาไปใช้ mount เป็น /api/auth
