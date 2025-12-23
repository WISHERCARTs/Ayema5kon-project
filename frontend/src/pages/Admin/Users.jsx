// frontend/src/pages/Admin/Users.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);       // เก็บรายการผู้ใช้ทั้งหมดจาก backend
  const [loading, setLoading] = useState(true); // ใช้บอกว่ากำลังโหลดอยู่
  const [error, setError] = useState("");       // เก็บข้อความ error ถ้าโหลดไม่สำเร็จ

  // search + filter
  const [search, setSearch] = useState("");                 // ข้อความค้นหา
  const [roleFilter, setRoleFilter] = useState("all");      // all | admin | user
  const [statusFilter, setStatusFilter] = useState("all");  // all | active | inactive

  // ฟอร์มเพิ่ม / แก้ไข
  const [isFormOpen, setIsFormOpen] = useState(false); // คุมการเปิด/ปิด modal ฟอร์ม
  const [editingId, setEditingId] = useState(null);    // UserID ตอนแก้ไข (null = เพิ่มใหม่)
  const [form, setForm] = useState({
    UA_Username: "",
    UA_Password: "",
    UA_Role: "User",
    UA_FName: "",
    UA_LName: "",
    UA_Status: "Active",
    UA_email: "",
  });

  // โหลดจาก backend
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/useradmin/getall");
      const rows = res.data.data || [];   // backend ส่ง { error, data, message }
      setUsers(rows);                     // เก็บ users ลง state
    } catch (err) {
      console.error(err);
      setError("โหลดรายชื่อผู้ใช้ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // เรียกโหลด users ครั้งแรกตอน component mount
    loadUsers();
  }, []);

  // handle เปลี่ยนค่าฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    // อัปเดต field ใน form ตาม name ของ input/select
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // เปิดฟอร์มเพิ่ม
  const handleOpenAdd = () => {
    setEditingId(null);  // บอกว่าเป็นโหมดเพิ่ม ไม่ใช่แก้ไข
    // รีเซ็ตฟอร์มเป็นค่าตั้งต้น
    setForm({
      UA_Username: "",
      UA_Password: "",
      UA_Role: "User",
      UA_FName: "",
      UA_LName: "",
      UA_Status: "Active",
      UA_email: "",
    });
    setIsFormOpen(true); // เปิด modal
  };

  // เปิดฟอร์มแก้ไข
  const handleOpenEdit = (u) => {
    setEditingId(u.UserID);  // เก็บ id ของ user ที่กำลังแก้
    // เซ็ตค่าในฟอร์มจากข้อมูล user ที่เลือก
    setForm({
      UA_Username: u.UA_Username || "",
      UA_Password: u.UA_Password || "",
      UA_Role: u.UA_Role || "User",
      UA_FName: u.UA_FName || "",
      UA_LName: u.UA_LName || "",
      UA_Status: u.UA_Status || "Active",
      UA_email: u.UA_Email || "",
      // note: ใน table backend ใช้ UA_email หรือ UA_Email ต้องให้ตรงกันที่ backend
    });
    setIsFormOpen(true); // เปิด modal
  };

  // submit ฟอร์ม (เพิ่ม + แก้)
  const handleSubmit = async (e) => {
    e.preventDefault(); // กันไม่ให้ reload หน้า

    try {
      const payload = {
        ...form,
        UA_Role: form.UA_Role,     // "Admin" / "User"
        UA_Status: form.UA_Status, // "Active" / "Inactive"
      };

      if (editingId == null) {
        // INSERT ผู้ใช้ใหม่
        await api.post("/useradmin/insertinfo", {
          useradmin: payload,
        });
      } else {
        // UPDATE ผู้ใช้เดิมตาม UserID
        await api.put("/useradmin/updateinfo", {
          useradmin: {
            ...payload,
            UserID: editingId, // ใส่ id ให้ backend รู้ว่าต้อง update แถวไหน
          },
        });
      }

      // ปิดฟอร์มและรีเซ็ตโหมดแก้ไข
      setIsFormOpen(false);
      setEditingId(null);
      // โหลดรายชื่อผู้ใช้ใหม่มาแสดง
      await loadUsers();
    } catch (err) {
      console.error(err);
      alert("บันทึกผู้ใช้ไม่สำเร็จ");
    }
  };

  // toggle Active / Inactive
  const handleToggleStatus = async (u) => {
    try {
      // แปลง UA_Status เป็นตัวเล็ก เอาไว้เปรียบเทียบ
      const newStatus =
        (u.UA_Status || "Active").toLowerCase() === "active"
          ? "Inactive"
          : "Active";
      // ถ้ายัง active -> เปลี่ยนเป็น Inactive ถ้าไม่ใช่ -> เปลี่ยนกลับเป็น Active

      await api.put("/useradmin/updateinfo", {
        useradmin: {
          ...u,
          UA_Status: newStatus, // ส่ง status ใหม่ไป update
        },
      });

      await loadUsers(); // refresh รายชื่อ
    } catch (err) {
      console.error(err);
      alert("เปลี่ยนสถานะผู้ใช้ไม่สำเร็จ");
    }
  };

  // ลบ user
  const handleDelete = async (id) => {
    if (!window.confirm("ต้องการลบผู้ใช้นี้จริง ๆ ใช่ไหม ?")) return;
    try {
      await api.delete("/useradmin/deleteinfo", {
        data: { UserID: id }, // axios.delete ใส่ body ผ่าน field data
      });
      await loadUsers(); // โหลดใหม่หลังลบสำเร็จ
    } catch (err) {
      console.error(err);
      alert("ลบผู้ใช้ไม่สำเร็จ");
    }
  };

  // filter/search
  const filteredUsers = useMemo(() => {
    const s = search.toLowerCase().trim(); // keyword ค้นหา
    return users.filter((u) => {
      const name = `${u.UA_FName || ""} ${u.UA_LName || ""}`.trim();
      const hitSearch =
        !s ||
        name.toLowerCase().includes(s) ||
        (u.UA_Username || "").toLowerCase().includes(s) ||
        (u.UA_Email || "").toLowerCase().includes(s);
      // ถ้าไม่มี keyword -> ผ่าน
      // ถ้ามี -> match ชื่อเต็ม / username / email

      const roleNorm = (u.UA_Role || "").toLowerCase();
      const statusNorm = (u.UA_Status || "").toLowerCase();

      const hitRole = roleFilter === "all" ? true : roleNorm === roleFilter;
      const hitStatus =
        statusFilter === "all" ? true : statusNorm === statusFilter;

      // ต้องผ่านทั้ง search + role filter + status filter
      return hitSearch && hitRole && hitStatus;
    });
  }, [users, search, roleFilter, statusFilter]);
  // ใช้ useMemo เพื่อลดการคำนวณซ้ำถ้า deps ยังเหมือนเดิม

  if (loading) {
    // ระหว่างโหลด แสดงหน้า loading
    return (
      <main className="p-6 text-white">
        <h1 className="text-2xl font-semibold mb-4">จัดการผู้ใช้</h1>
        <p>กำลังโหลดผู้ใช้...</p>
      </main>
    );
  }

  if (error) {
    // ถ้า error แสดงข้อความ error แทน
    return (
      <main className="p-6 text-white">
        <h1 className="text-2xl font-semibold mb-4">จัดการผู้ใช้</h1>
        <p className="text-red-400">{error}</p>
      </main>
    );
  }

  return (
    <main className="p-6 text.white">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">จัดการผู้ใช้</h1>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded bg-teal-600 hover:bg-teal-700 text-sm"
        >
          + เพิ่มผู้ใช้ใหม่
        </button>
        {/* ปุ่มเปิดฟอร์มเพิ่มผู้ใช้ใหม่ */}
      </div>

      {/* filter/search bar */}
      <div className="bg-[#1f2933] rounded-lg p-4 mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="ค้นหาด้วยชื่อ / username / email"
          className="px-3 py-2 rounded bg-black/30 text-sm flex-1 min-w-[200px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          // พิมพ์แล้วอัปเดต search -> ส่งผลไป filteredUsers
        />

        <select
          className="px-3 py-2 rounded bg-black/30 text-sm"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">ทุก role</option>
          <option value="admin">admin</option>
          <option value="user">user</option>
        </select>

        <select
          className="px-3 py-2 rounded bg-black/30 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">ทุกสถานะ</option>
          <option value="active">active</option>
          <option value="inactive">inactive</option>
        </select>

        <span className="text-xs text-gray-400 self-center">
          แสดง {filteredUsers.length} จากทั้งหมด {users.length} คน
        </span>
      </div>

      {/* table */}
      <div className="overflow-x-auto bg-[#111827] rounded-lg shadow">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-black/40 text-gray-300">
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">ชื่อ</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Username</th>
              <th className="px-3 py-2 text-center">Role</th>
              <th className="px-3 py-2 text-center">สถานะ</th>
              <th className="px-3 py-2 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              // ถ้าไม่พบผู้ใช้ตาม filter/search
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-4 text-center text-gray-400"
                >
                  ไม่พบผู้ใช้
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => {
                const fullName =
                  `${u.UA_FName || ""} ${u.UA_LName || ""}`.trim() ||
                  "(ไม่ระบุชื่อ)";
                const roleNorm = (u.UA_Role || "").toLowerCase();
                const statusNorm = (u.UA_Status || "").toLowerCase();

                return (
                  <tr
                    key={u.UserID}
                    className="border-t border-white/5 hover:bg.white/5"
                  >
                    <td className="px-3 py-2">{u.UserID}</td>
                    <td className="px-3 py-2">{fullName}</td>
                    <td className="px-3 py-2">{u.UA_Email}</td>
                    <td className="px-3 py-2">{u.UA_Username}</td>
                    <td className="px-3 py-2 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          roleNorm === "admin"
                            ? "bg-purple-600/70"
                            : "bg-gray-600/70"
                        }`}
                      >
                        {u.UA_Role}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`px-2 py-1 rounded text-xs ${
                          statusNorm === "active"
                            ? "bg-green-600/70"
                            : "bg-gray-600/70"
                        }`}
                      >
                        {u.UA_Status}
                      </button>
                    </td>
                    <td className="px-3 py-2 text-center space-x-2">
                      {/* เอาปุ่ม "ลดสิทธิ์" ออกแล้ว เหลือ แก้ไข / ลบ เท่านั้น */}
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="px-2 py-1 text-xs rounded bg-blue-600/80 hover:bg-blue-700"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDelete(u.UserID)}
                        className="px-2 py-1 text-xs rounded bg-red-600/80 hover:bg-red-700"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ฟอร์มเพิ่ม/แก้ไข */}
      {isFormOpen && (
        // modal overlay ฟอร์ม admin user
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-[#111827] rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "แก้ไขผู้ใช้" : "เพิ่มผู้ใช้ใหม่"}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm mb-1">Username</label>
                <input
                  type="text"
                  name="UA_Username"
                  className="w-full px-3 py-2 rounded bg-black/40 text-sm"
                  value={form.UA_Username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Password</label>
                <input
                  type="password"
                  name="UA_Password"
                  className="w-full px-3 py-2 rounded bg-black/40 text-sm"
                  value={form.UA_Password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">ชื่อ</label>
                  <input
                    type="text"
                    name="UA_FName"
                    className="w-full px-3 py-2 rounded bg-black/40 text-sm"
                    value={form.UA_FName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">นามสกุล</label>
                  <input
                    type="text"
                    name="UA_LName"
                    className="w-full px-3 py-2 rounded bg-black/40 text-sm"
                    value={form.UA_LName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  name="UA_email"
                  className="w-full px-3 py-2 rounded bg-black/40 text-sm"
                  value={form.UA_email}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Role</label>
                  <select
                    name="UA_Role"
                    className="w-full px-3 py-2 rounded bg-black/40 text-sm"
                    value={form.UA_Role}
                    onChange={handleChange}
                  >
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1">สถานะ</label>
                  <select
                    name="UA_Status"
                    className="w-full px-3 py-2 rounded bg-black/40 text-sm"
                    value={form.UA_Status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingId(null);
                    // กดยกเลิก -> ปิด modal และล้าง editingId
                  }}
                  className="px-4 py-2 rounded bg-gray-600/70 text-sm"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-teal-600 hover:bg-teal-700 text-sm"
                >
                  {editingId ? "บันทึกการแก้ไข" : "เพิ่มผู้ใช้"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
