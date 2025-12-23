// frontend/src/lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api", 
  // ทุก request ที่เรียกผ่าน api จะไปต่อท้ายจาก /api
  // เช่น api.get("/products") -> เรียกจริงคือ /api/products
});

// ใส่ token จาก localStorage ไปในทุก request
api.interceptors.request.use((config) => {
  const saved = localStorage.getItem("auth");
  // พยายามอ่านข้อมูล auth ที่เคยเซฟไว้ใน localStorage (เช่น { token, user })

  if (saved) {
    const { token } = JSON.parse(saved);
    // แปลง string จาก localStorage ให้เป็น object แล้วดึง token ออกมา

    if (token) {
      config.headers.Authorization = ` Bearer ${token} `;
      // ถ้ามี token ให้แนบ header Authorization ไปกับทุก request
      // ตอน backend รับจะใช้ header นี้ไป verify JWT
      // ตรงนี้มี space หน้า-หลัง Bearer อยู่ ถ้า backend parse เคร่งมากอาจต้องระวัง
    }
  }
  return config;
  // ต้อง return config กลับไปให้ axios ใช้ต่อ
});

export default api;
// export instance api ให้ไฟล์อื่น import ไปใช้ยิง HTTP request ทั่วทั้ง frontend
