// frontend/src/pages/Login.jsx
import { useState } from "react";
import { useAuth } from "../lib/auth";
import { useNavigate, useLocation, Link , Navigate } from "react-router-dom";

export default function Login() {
  const { login, user, isAuthenticated  } = useAuth(); // ดึงฟังก์ชัน login และสถานะ user ปัจจุบันจาก auth context
  const nav = useNavigate();                            // hook สำหรับเปลี่ยนหน้า
  const location = useLocation();                       // ใช้อ่าน state ที่ส่งมาจากหน้าเดิม (เช่น from)
  const from = location.state?.from || "/";             // ถ้าเดิมมาจากหน้าไหน ให้ย้อนกลับหน้าเดิมหลัง login ไม่งั้นไป "/"

  // ถ้าล็อกอินแล้ว ไม่ให้เห็นหน้า Login อีก ให้ redirect ตาม role
  if (isAuthenticated) {
    const role = (user.role || "").toLowerCase();
    const target = role === "admin" ? "/admin/products" : "/";
    return <Navigate to={target} replace />;
  }

  // state ฟอร์มเก็บ username / password จาก input
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  // อัปเดตค่าใน state ตามชื่อฟิลด์ที่กรอก
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // เมื่อ submit ฟอร์ม
  const handleSubmit = async (e) => {
    e.preventDefault(); // กันไม่ให้รีเฟรชหน้า

    try {
      // เรียก login จาก auth context ส่ง username/password ไป backend
      const user = await login(form.username, form.password);

      // ถ้า role เป็น admin -> ส่งไปหน้า admin
      // ถ้าไม่ใช่ -> กลับหน้าเดิมที่มา (from) หรือ "/" ถ้าไม่มี from
      if ((user.role || "").toLowerCase() === "admin") {
        nav("/admin/products", { replace: true });
      } else {
        nav(from, { replace: true });
      }
    } catch (err) {
      console.error(err);
      // ถ้า login fail ให้แจ้งเตือนแบบง่าย ๆ
      alert("เข้าสู่ระบบไม่สำเร็จ");
    }
  };

  return (
    // layout หลักของหน้า login
    <section className="min-h-screen flex flex-col items-center justify-center text.white px-6 -mt-20 -mb-13">
      <div className="w-full max-w-md ">
        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-8">Welcome back!</h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit} // ผูก submit ฟอร์มกับ handleSubmit
          className="bg-[#2e2e2e] rounded-2xl p-8 shadow-lg space-y-5"
        >
          {/* Username */}
          <div>
            <label className="block font-semibold mb-1">Username</label>
            <input
              type="text"
              name="username"                // ผูก name ให้ match กับ key ใน state form
              value={form.username}          // controlled input
              onChange={handleChange}        // เวลาเปลี่ยนค่าให้ไปอัปเดต state
              placeholder="Enter your username or email"
              className="w-full px-4 py-3 rounded-lg bg-[#d9d9d9] text-gray-900 font-semibold placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"                // ผูกกับ form.password
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-lg bg-[#e7e3e3] text-gray-900 font-semibold placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"                    // กดแล้วจะไป trigger handleSubmit
            className="w-full bg-[#05677e] hover:bg-[#088199] py-3 rounded-lg font-bold text-white transition"
          >
            Confirm
          </button>

          {/* Register link */}
          <p className="text-center text-sm mt-2 text-gray-300">
            Don’t have an account?{" "}
            <Link
              to="/register"                // กดแล้วไปหน้า register
              className="text-[#1fffcb] font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
