// backend/routes/steamApiRoutes.js
const express = require("express");
const app = express(); // สร้าง instance express แต่ในไฟล์นี้ใช้ router ในการทำงานหลัก
const router = express.Router(); // สร้าง router สำหรับ group route ที่เกี่ยวกับ Steam API
const axios = require("axios") // ใช้ axios สำหรับยิง HTTP request ออกไปยัง Steam API ภายนอก

// Testing Steam
// method : GET
// body:  raw json
// http://localhost:3000/api/steam
router.get("/steam", async (req, res) => {
  try {
    const resx = await axios.get(
      "https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=APPID"
    );
    // ยิง request แบบ GET ไปยัง Steam Web API
    // endpoint นี้ใช้เมธอด GetNumberOfCurrentPlayers เพื่อดึงจำนวนผู้เล่นที่ออนไลน์อยู่ตอนนี้ของเกมหนึ่งเกม
    // ต้องแทนที่ APPID ด้วย Steam AppID จริงของเกมที่ต้องการ เช่น 570 (Dota 2), 730 (CS:GO) ตอนใช้งานจริง

    const playerCount = resx.data.response.player_count;
    // อ่านค่าจาก response ของ Steam API
    // รูปแบบ data ที่กลับมาจะเป็น object ที่มี field response -> player_count
    // เก็บจำนวนผู้เล่นปัจจุบันไว้ในตัวแปร playerCount

    return res.status(200).json({ player_count: playerCount });
    // ส่งผลกลับไปหา client เป็น JSON เช่น { "player_count": 123456 }
    // status 200 แปลว่าเรียกสำเร็จ และ client ก็จะเอาไปแสดงต่อได้เลย
  } catch (err) {
    console.error(err);
    // ถ้ามี error จาก axios เช่น เรียก API ไม่ได้, network พัง, หรือ Steam API ล่ม จะเข้ามาที่ catch นี้

    return res.status(500).json({ error: "Steam API error" });
    // ตอบกลับด้วย status 500 ให้ client รู้ว่าเป็น error ภายใน server หรือ upstream (Steam API)
  }
});

module.exports = router; // export router ออกไปให้ไฟล์หลักเอาไป mount เป็น /api หรือ prefix ที่ต้องการ เช่น /api/steam
