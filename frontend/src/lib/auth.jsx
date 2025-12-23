// frontend/src/lib/auth.jsx
import { createContext, useContext, useState } from "react";
import api from "./api";

const AuthContext = createContext();
// context กลางสำหรับเก็บสถานะ auth (user + token) ให้ทั้งแอปใช้ร่วมกัน

function loadInitialAuth() {
  // ฟังก์ชันช่วยโหลดสถานะ auth เริ่มต้นจาก localStorage
  if (typeof window === "undefined") {
    // กันกรณีรันฝั่ง server (SSR) ที่ไม่มี window/localStorage
    return { user: { role: "guest" }, token: null };
  }

  try {
    const saved = localStorage.getItem("auth");
    if (!saved) return { user: { role: "guest" }, token: null };
    // ถ้ายังไม่เคยเก็บ auth ไว้เลย ให้เริ่มจาก guest

    const parsed = JSON.parse(saved);
    // แปลง string เป็น object

    return {
      user: parsed.user || { role: "guest" },
      token: parsed.token || null,
      // ถ้ามีข้อมูล user/token ใน storage ก็ใช้เลย
    };
  } catch (e) {
    console.error("Invalid auth in storage:", e);
    // ถ้า parse พัง (ข้อมูลเสีย) ให้ fallback กลับเป็น guest
    return { user: { role: "guest" }, token: null };
  }
}

export function AuthProvider({ children }) {
  const [{ user, token }, setAuth] = useState(() => loadInitialAuth());
  // ใช้ state เก็บ { user, token } ทั้งชุด
  // ค่าเริ่มต้นโหลดจาก localStorage ผ่าน loadInitialAuth

  // คำนวณว่าล็อกอินอยู่จริงๆ
  const isAuthenticated =
    !!token &&
    (user?.role || "guest").toString().trim().toLowerCase() !== "guest";
  // ถือว่า "ล็อกอินแล้ว" ก็ต่อเมื่อมี token และ role ไม่ใช่ guest

  // helper ใช้ทั้ง login + register
  const setAuthAndStore = (rawUser, tk) => {
    // map รูปแบบ user จาก backend ให้เป็นรูปแบบที่ frontend ใช้
    const mappedUser = {
      id: rawUser.id ?? rawUser.id ?? "",
      name: rawUser.name ?? rawUser.username ?? "",
      username: rawUser.username ?? rawUser.name ?? "",
      email: rawUser.email ?? null,
      role: (rawUser.role || "user").toString().trim().toLowerCase(),
    };

    // อัปเดต state context
    setAuth({ user: mappedUser, token: tk });
    // เซฟลง localStorage เพื่อให้ refresh หน้าแล้วยังจำได้
    localStorage.setItem("auth", JSON.stringify({ user: mappedUser, token: tk }));

    return mappedUser;
  };

  // login ยิงไป backend
  const login = async (username, password) => {
    // call ไปที่ backend /api/auth/login ด้วย api instance
    const res = await api.post("/auth/login", { username, password });
    const { token: tk, user: rawUser } = res.data;
    // backend จะต้องส่ง { token, user } กลับมา
    return setAuthAndStore(rawUser, tk);
    // map user + เก็บ token ลง state และ localStorage แล้วส่ง mappedUser กลับ
  };

  // register ยิงไป backend แล้ว login ให้เลย
  const register = async (username, email, password) => {
    // call ไปที่ /api/auth/register
    const res = await api.post("/auth/register", { username, email, password });
    const { token: tk, user: rawUser } = res.data;
    // backend ส่ง user ที่เพิ่งสมัคร + token กลับมา
    return setAuthAndStore(rawUser, tk);
  };

  const loginAsUser = (username, password) => login(username, password);
  // alias เผื่ออยากแยกความหมาย login user ปกติ

  const loginAsAdmin = (username, password) => login(username, password);
  // alias เผื่อเรียก login admin แต่จริงๆ ไปใช้ login ตัวเดียวกัน

  const logout = () => {
    // ล้าง state กลับไปเป็น guest
    setAuth({ user: { role: "guest" }, token: null });
    // ลบข้อมูล auth ที่เก็บไว้ใน localStorage
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        register,
        loginAsUser,
        loginAsAdmin,
        logout,
        // export function / state ทั้งหมดให้ component อื่นใช้ผ่าน useAuth()
      }}
    >
      {children}
      {/* ครอบ children ทั้งแอปไว้ใน provider นี้ เพื่อให้ทุกที่เรียก useAuth ได้ */}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
// hook ใช้งาน auth ง่าย ๆ: const { user, login, logout, isAuthenticated } = useAuth();
