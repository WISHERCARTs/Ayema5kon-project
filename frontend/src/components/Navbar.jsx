// src/components/Navbar.jsx
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { useCart } from "../lib/cart";
import useRequireAuthAction from "../lib/useRequireAuthAction";
import React, { useEffect, useState } from "react";
import api from "../lib/api";

// utility class เดียว ใช้กับปุ่มวงกลมทุกอัน
const circleBtn =
  "inline-grid place-items-center size-12 rounded-full bg-white/10 hover:bg-white/20 ring-1 ring-white/10 transition";

export default function Navbar() {
  const { user, logout } = useAuth();   // ดึงข้อมูล user ปัจจุบัน + ฟังก์ชัน logout จาก context auth
  const { items } = useCart();          // ดึงรายการสินค้าในตะกร้าจาก cart context

  // normalize role
  const role = (user?.role || "guest").toString().trim().toLowerCase(); // แปลง role ให้เป็น string ตัวเล็กไว้ใช้เทียบ
  const isAdmin = role === "admin";    // ใช้เช็คว่า user นี้เป็น admin หรือไม่
  const isGuest = role === "guest";    // ใช้เช็คว่า user ยังไม่ได้ login

  const requireAuth = useRequireAuthAction(); // hook เอาไว้ wrap action ที่ต้อง login ก่อน
  const nav = useNavigate();                  // ใช้เปลี่ยนหน้าแบบ programmatic (เช่น nav("/cart"))

  const [players, setPlayers] = useState(null); // เก็บจำนวนผู้เล่นออนไลน์จาก API Steam (เริ่มต้นยังไม่มีข้อมูล)

  const fetchPlayerCount = async () => {
    try {
      // api client ฝั่ง frontend เรียกไปหลังบ้านที่ route /steam
      // backend จะไปคุยกับ Steam API แล้วตอบกลับมาเป็น player_count
      const { data } = await api.get("/steam");
      console.log(data);
      setPlayers(data.player_count); // เก็บจำนวนผู้เล่นลง state
    } catch (err) {
      console.error("Error fetching player count:", err); // ถ้าดึงไม่สำเร็จ log error ไว้
    }
  };

  useEffect(() => {
    // เรียกดึงจำนวนผู้เล่นครั้งเดียวตอน component mount
    fetchPlayerCount();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#454444]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8 text-white">
        {/* LEFT: Logo */}
        <Link to="/" className="flex items-center gap-3">
          {/* คลิกโลโก้แล้วกลับหน้าหลัก ("/") */}
          <img src="/assets/logo.png" alt="logo" className="h-20 w-auto" />
        </Link>
        
        {/*Number(players).toLocaleString("th-TH") ใส่ลูกน้ำคั่นหลักพันให้อัตโนมัติ*/}
        <div>
          {players !== null ? (
            <h2>
              {/* แสดงจำนวนผู้เล่น ถ้ามีข้อมูลแล้ว */}
              ผู้เล่นออนไลน์บน Steam : {Number(players).toLocaleString("en-US")}
            </h2>
          ) : (
            // ระหว่างที่ยังโหลดไม่เสร็จ (players ยังเป็น null) แสดง Loading…
            <p>Loading...</p>
          )}
        </div>

        {/* CENTER: Menu */}
        <nav className="hidden md:flex items-center gap-7 text-lg font-semibold">
          {/* ลิงก์ไปหน้าแสดงสินค้าทั้งหมด */}
          <NavLink to="/products" className="hover:text-teal-300">สินค้าทั้งหมด</NavLink>
          {/* ลิงก์ไปหน้าวิธีชำระเงิน */}
          <NavLink to="/how-to-pay" className="hover:text-teal-300">วิธีชำระเงิน</NavLink>
          {/* ลิงก์ไปหน้าคีย์ของฉัน (ต้องมีระบบเช็คสิทธิ์ใน route อีกทีว่าใครเข้าได้) */}
          <NavLink to="/keys" className="hover:text-teal-300">คีย์ของฉัน</NavLink>

          {isAdmin && (
            <>
              {/* เมนูพิเศษ สำหรับ admin เท่านั้น */}
              <NavLink to="/admin/users" className="text-teal-300">User</NavLink>
              <NavLink to="/admin/products" className="text-teal-300">Product</NavLink>
              {/* ปุ่ม logout สำหรับ admin (จริงๆ ใช้ได้กับ user ทุกประเภทถ้าอยู่ตรงนี้) */}
              <button onClick={logout} className="text-orange-400 hover:text-orange-300">
                Logout
              </button>
            </>
          )}
        </nav>

        {/* RIGHT: วงกลมเท่ากันทั้งหมด */}
        <div className="flex items-center gap-4">
          {/* Search circle */}
          <Link to="/search" aria-label="ค้นหา" className={circleBtn}>
            {/* กดแล้วไปหน้า /search */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24" width="22" height="22"
              fill="currentColor" className="text-white"
            >
              <path d="M18.9 16.776A10.539 10.539 0 1 0 16.776 18.9l5.1 5.1L24 21.88l-5.1-5.1ZM10.5 18A7.5 7.5 0 1 1 18 10.5 7.507 7.507 0 0 1 10.5 18Z" />
            </svg>
          </Link>

          {/* Login / Username pill */}
          {isGuest ? (
            // ถ้ายังไม่ได้ login แสดงปุ่ม Login
            <NavLink
              to="/login"
              className="px-5 py-2 rounded-xl bg-[#27F1CA] text-black font-semibold hover:brightness-95"
            >
              Login
            </NavLink>
          ) : (
            // ถ้า login แล้ว แสดงชื่อ user แทน และคลิกเพื่อไปหน้า profile
            <NavLink
              to="/profile" // ✅ เมื่อ login แล้วให้คลิกชื่อเพื่อเข้าโปรไฟล์
              className="px-4 py-2 rounded-xl bg-[#27F1CA] text-black font-semibold hover:brightness-95"
            >
              {user.name}
            </NavLink>
          )}

          {/* Cart circle + badge (ต้อง login ก่อนถึงเข้าได้) */}
          <button
            type="button"
            onClick={() => requireAuth(() => nav("/cart"))}
            // เวลาโดนกด จะเรียก requireAuth ด้วย callback ที่อยากทำ (nav("/cart"))
            // ถ้า user login แล้ว -> จะเรียก callback แล้วพาไปหน้า /cart
            // ถ้า user ยังไม่ login -> hook ภายในสามารถ redirect ไปหน้า login หรือแสดง popup ตามที่เขียนไว้
            aria-label="ตะกร้า"
            className={`${circleBtn} relative`}
          >
            <svg
              stroke="currentColor" fill="none" viewBox="0 0 24 24"
              width="22" height="22" className="text-white"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 text-xs grid place-items-center rounded-full bg-rose-500 text-white">
              {/* แสดงจำนวนชิ้นในตะกร้า จาก context cart */}
              {items.length}
            </span>
          </button>

        </div>
      </div>
    </header>
  );
}
