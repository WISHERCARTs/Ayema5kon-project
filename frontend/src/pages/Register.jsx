// frontend/src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function Register() {
  // state เก็บค่าฟอร์ม register: username / email / password
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { register } = useAuth();   // ดึงฟังก์ชัน register จาก auth context (จะไปเรียก /api/auth/register ให้)
  const nav = useNavigate();

  // อัปเดตค่าในฟอร์มตามชื่อ field (name attribute)
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // กด submit ฟอร์มสมัครสมาชิก
  const handleSubmit = async (e) => {
    e.preventDefault(); // กัน reload หน้า

    try {
      // สมัคร + login อัตโนมัติ 
      // ยิงไป POST /api/auth/register ผ่าน useAuth().register
      const newUser = await register(
        form.username,
        form.email,
        form.password
      );

      // สมัครเสร็จ newUser.role จะเป็น "user" (ตาม backend)
      // จากนั้น redirect ไปหน้า home
      nav("/", { replace: true });
    } catch (err) {
      console.error(err);
      // ถ้า register พัง (เช่น username ซ้ำ หรือ server ล่ม) ให้เด้ง alert แจ้งผู้ใช้
      alert("สมัครสมาชิกไม่สำเร็จ (อาจชื่อซ้ำ หรือ server error)");
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center  text-white px-6 -mt-20 -mb-13">
      <div className="w-full max-w-md">
        {/* หัวข้อบนหน้า Register */}
        <h1 className="text-4xl font-bold text-center mb-8">
          Create an account
        </h1>

        {/* ฟอร์มสมัครสมาชิก ผูก onSubmit กับ handleSubmit */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#2e2e2e] rounded-2xl p-8 shadow-lg space-y-5"
        >
          {/* Username */}
          <div>
            <label className="block font-semibold.mb-1">Username</label>
            <input
              type="text"
              name="username"                       // ผูกกับ form.username
              value={form.username}
              onChange={handleChange}               // เปลี่ยนค่าฟอร์มผ่าน handleChange
              placeholder="Enter your username"
              className="w-full px-4 py-3 rounded-lg bg-[#d9d9d9] text-gray-900 font-semibold placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"                          // ผูกกับ form.email
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg bg-[#d9d9d9] text-gray-900 font-semibold placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"                      // ผูกกับ form.password
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your.password"
              className="w-full px-4 py-3 rounded-lg bg-[#e7e3e3] text-gray-900 font-semibold placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* ปุ่ม Submit ฟอร์ม สมัครสมาชิก */}
          <button
            type="submit"
            className="w-full bg-[#05677e] hover:bg-[#088199] py-3 rounded-lg font-bold text-white transition"
          >
            Sign up
          </button>

          {/* ลิงก์กลับไปหน้า Login ถ้ามีบัญชีอยู่แล้ว */}
          <p className="text-center text-sm mt-2 text-gray-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#1fffcb] font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
