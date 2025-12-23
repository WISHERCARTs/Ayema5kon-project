// src/lib/useRequireAuthAction.js

import { useAuth } from "./auth";
import { useNavigate, useLocation } from "react-router-dom";

export default function useRequireAuthAction() {
  const { user } = useAuth();               // ดึง user ปัจจุบันจาก auth context
  const nav = useNavigate();                // ใช้เปลี่ยนหน้าแบบ programmatic
  const location = useLocation();           // รู้ path ปัจจุบันที่ผู้ใช้กดปุ่มอยู่

  return (action) => {
    // คืนฟังก์ชันที่เอาไว้ wrap action ที่ "ต้องล็อกอินก่อน"
    if (user.role === "guest") {
      // ถ้าเป็น guest (ยังไม่ล็อกอิน) -> ส่งไปหน้า login
      nav("/login", { state: { from: location.pathname } });
      // แนบ state.from = path ปัจจุบัน เช่น "/cart" ไว้ให้หน้า login ใช้ redirect กลับภายหลัง
    } else {
      // ถ้าล็อกอินแล้ว -> รัน action ที่ส่งเข้ามาได้เลย
      action?.();
    }
  };
}
