// AdminSidebar.jsx
import { NavLink } from "react-router-dom";
// ใช้ NavLink สำหรับลิงก์ที่ผูกกับ routing และรู้สถานะ active ได้

export default function AdminSidebar(){
  // component Sidebar สำหรับฝั่ง Admin ใช้แสดงเมนูนำทางไปหน้าต่างๆ ของ admin
  return (
    <aside className="w-64 bg-white shadow-sm">
      <div className="p-4 text-xl font-semibold">Admin</div>
      <nav className="px-2 space-y-1">
        {/* <NavLink to="/admin/dashboard" className="block px-3 py-2 rounded hover:bg-gray-100">Dashboard</NavLink> */}
        {/* ตัวอย่างลิงก์ไปหน้า /admin/dashboard ที่ถูกคอมเมนต์ไว้ ยังไม่ได้ใช้ */}

        <NavLink to="/admin/products" className="block px-3 py-2 rounded hover:bg-gray-100">
          {/* ลิงก์ไปหน้า /admin/products สำหรับจัดการสินค้าในระบบฝั่ง admin */}
          Products
        </NavLink>

        <NavLink to="/admin/users" className="block px-3 py-2 rounded hover:bg-gray-100">
          {/* ลิงก์ไปหน้า /admin/users สำหรับจัดการผู้ใช้ในระบบฝั่ง admin */}
          Users
        </NavLink>
      </nav>
    </aside>
  );
}
