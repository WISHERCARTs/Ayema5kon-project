// # route protection (RequireAdmin)

// src/lib/guards.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./auth";

export function RequireAdmin() {
  const { user } = useAuth();
  // ดึง user ปัจจุบันจาก auth context เพื่อใช้เช็ค role

  const loc = useLocation();
  // ใช้เก็บ location ปัจจุบัน (pathname) ไว้ เผื่อ redirect กลับมาทีหลัง

  if (user.role !== "admin") {
    // ถ้า role ไม่ใช่ admin -> ห้ามเข้า
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: loc.pathname }}
      />
    );
    // ส่งไปหน้า /login พร้อม state.from = path ที่มาจากเดิม
    // ฝั่งหน้า login สามารถอ่าน state.from แล้ว login เสร็จ redirect กลับได้
  }

  // ถ้าเป็น admin -> ผ่าน และ render route ลูกตรงนี้
  return <Outlet />;
}
