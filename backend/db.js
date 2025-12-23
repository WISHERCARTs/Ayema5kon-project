const mysql = require("mysql2");
const dotenv = require("dotenv");

// โหลดตัวแปรสภาพแวดล้อมจากไฟล์ .env เข้ามาไว้ใน process.env
dotenv.config();

//MySQL connection
const dbConn = mysql.createConnection({
  // host ของ MySQL server (เช่น localhost หรือ hostname/server จริง)
  host: process.env.MYSQL_HOST,
  // username ที่ใช้ล็อกอินเข้า MySQL
  user: process.env.MYSQL_USERNAME,
  // password ของ user ที่ใช้เชื่อมต่อ
  password: process.env.MYSQL_PASSWORD,
  // ชื่อ database ที่จะใช้เป็นหลักใน connection นี้
  database: process.env.MYSQL_DATABASE,
});

// พยายามเชื่อมต่อกับ MySQL ทันทีตอนรันแอป
dbConn.connect((err) => {
  if (err) {
    // ถ้าเชื่อมต่อไม่ได้ ให้ log error แล้ว kill process ทิ้งเลย
    console.error("Cannot connect to MySQL:", err.message);
    process.exit(1);
  }
  // ถ้าเชื่อมต่อสำเร็จ log ชื่อ database ที่ connect อยู่
  console.log(`Connected DB: ${process.env.MYSQL_DATABASE}`);
});

// export dbConn ออกไปให้ไฟล์อื่น (เช่น routes ต่างๆ) เอาไปใช้ยิง query ได้
module.exports = dbConn;
