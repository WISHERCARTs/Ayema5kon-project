import { Outlet, NavLink } from "react-router-dom";

export default function AdminLayout() {
  // layout หลักสำหรับทุกหน้าใน /admin ใช้เป็นโครงครอบ Sidebar + Content
  return (
    <div className="min-h-screen bg-[#111] text-white grid lg:grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside className="bg-[#161616] border-r border-white/10 p-4 sticky top-0 h-screen">
        <div className="text-xl font-semibold mb-4">Admin Panel</div>
        <nav className="grid gap-2">
          <NavLink
            to="/admin/products"
            className={({isActive}) =>
              // ใช้ NavLink แบบ function className เพื่อปรับสไตล์ตามสถานะ active
              `px-3 py-2 rounded-lg ${isActive ? "bg-teal-600" : "hover:bg-white/10"}`
            }
          >
            {/* ลิงก์ไปหน้า manage products ฝั่ง admin */}
            Products
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({isActive}) =>
              // ใช้ pattern เดียวกันกับ products: ถ้า route /admin/users ตรง -> isActive = true
              `px-3 py-2 rounded-lg ${isActive ? "bg-teal-600" : "hover:bg-white/10"}`
            }
          >
            {/* ลิงก์ไปหน้า manage users ฝั่ง admin */}
            Users
          </NavLink>
        </nav>
      </aside>

      {/* Content */}
      <main className="p-6">
        {/* Outlet = ที่สำหรับ render หน้าย่อยของ route /admin เช่น /admin/products, /admin/users */}
        <Outlet />
      </main>
    </div>
  );
}
