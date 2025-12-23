// frontend/src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import api from "../lib/api";

export default function Profile() {
  const { user, logout } = useAuth();      // ดึงข้อมูล user ปัจจุบันและฟังก์ชัน logout จาก context
  const nav = useNavigate();
  const loc = useLocation();

  // ถ้าเป็น guest → เด้งไป login
  useEffect(() => {
    if (user.role === "guest" && loc.pathname !== "/login") {
      // ถ้ายังไม่ login และไม่ใช่หน้า /login ให้ redirect ไปหน้า login
      // แนบ state.from = "/profile" ไว้ให้ login เสร็จเด้งกลับหน้าโปรไฟล์
      nav("/login", { state: { from: "/profile" }, replace: true });
    }
  }, [user.role, loc.pathname, nav]);

  // ยังเป็น guest อยู่ ระหว่าง redirect กลับ null ไม่ render อะไร
  if (user.role === "guest") return null;

  // -------- state โปรไฟล์จาก DB --------
  const [profile, setProfile] = useState(null); // เก็บ row โปรไฟล์ของ user จากตาราง useradmin
  const [loading, setLoading] = useState(true); // สถานะกำลังโหลดโปรไฟล์
  const [error, setError] = useState("");       // เก็บ error เวลาโหลดโปรไฟล์พัง

  const [editing, setEditing] = useState(false); // mode แก้ไขฟอร์มโปรไฟล์
  const [saving, setSaving] = useState(false);   // flag กำลังบันทึกข้อมูล

  // -------- state คีย์ที่เคยได้รับ (History) --------
  const [keys, setKeys] = useState([]);          // เก็บลิสต์ key ที่เคยได้รับ (จาก cdkey.mykeys)
  const [keysLoading, setKeysLoading] = useState(false); // สถานะกำลังโหลด key
  const [keysError, setKeysError] = useState("");        // error ตอนโหลด key

  // ดึงข้อมูลโปรไฟล์จาก DB ตาม user.id (UserID)
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");
        // ยิงไป backend ขอข้อมูล useradmin ตาม UserID
        const res = await api.get(`/useradmin/getinfo/${user.id}`);
        // เซ็ตโปรไฟล์ ถ้าไม่มีข้อมูลให้เป็น null
        setProfile(res.data.data || null);
      } catch (err) {
        console.error(err);
        setError("โหลดข้อมูลโปรไฟล์ไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };

    // โหลดโปรไฟล์เมื่อมี user.id พร้อมใช้
    if (user?.id) {
      loadProfile();
    }
  }, [user?.id]);

  // ดึงคีย์จาก backend ตาม user.id
  // สมมติ backend มี route: GET /api/cdkey/mykeys/:userId
  useEffect(() => {
    const loadKeys = async () => {
      if (!user?.id) return; // ไม่มี id ก็ไม่โหลด

      try {
        setKeysLoading(true);
        setKeysError("");
        // ดึงรายการคีย์ของ user จาก backend
        const res = await api.get(`/cdkey/mykeys/${user.id}`);
        // backend แนะนำให้ส่ง array ใน res.data.data
        setKeys(res.data?.data || []);
      } catch (err) {
        console.error("load keys error", err);
        setKeysError("โหลดรายการคีย์ไม่สำเร็จ");
        setKeys([]); // ถ้าพังเคลียร์เป็น array ว่าง
      } finally {
        setKeysLoading(false);
      }
    };

    loadKeys();
  }, [user?.id]);

  const handleLogout = () => {
    // ลบ token/auth ออกจาก state + localStorage ผ่าน context
    logout();
    // ส่งไปหน้า login หลัง logout เสร็จ
    nav("/login", { replace: true });
  };

  // เปลี่ยนค่าฟอร์ม (4 ช่องที่ต้องแก้)
  const handleChange = (e) => {
    const { name, value } = e.target;
    // อัปเดต field ใน profile ตามชื่อ input
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // กด Save → update ลง DB
  const handleSave = async () => {
    if (!profile) return;
    try {
      setSaving(true);
      await api.put("/useradmin/updateinfo", {
        useradmin: {
          ...profile,
          // กัน undefined → เป็น null ได้ เพื่อไม่ให้ backend เก็บ undefined
          UA_Username: profile.UA_Username,
          UA_FName: profile.UA_FName || null,
          UA_LName: profile.UA_LName || null,
          UA_Email: profile.UA_Email || null,
        },
      });
      // บันทึกเสร็จออกจากโหมดแก้ไข
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("บันทึกโปรไฟล์ไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  // -------- state.loading/error ของทั้งหน้า --------
  if (loading) {
    // ระหว่างโหลดโปรไฟล์ แสดงหน้ารอโหลด
    return (
      <main className="max-w-7xl mx-auto px-6 py-10 text-white">
        <h1 className="text-center text-5xl font-semibold mb-10">Profile</h1>
        <p>กำลังโหลดข้อมูลโปรไฟล์...</p>
      </main>
    );
  }

  if (error || !profile) {
    // ถ้าโหลดพัง หรือไม่เจอแถวโปรไฟล์ แสดงข้อความ error
    return (
      <main className="max-w-7xl mx-auto px-6 py-10 text-white">
        <h1 className="text-center text-5xl font-semibold.mb-10">Profile</h1>
        <p className="text-red-400">
          {error || "ไม่พบข้อมูลโปรไฟล์ในระบบ"}
        </p>
      </main>
    );
  }

  // ประกอบชื่อเต็มจาก UA_FName และ UA_LName
  const fullName =
    `${profile.UA_FName || ""} ${profile.UA_LName || ""}`.trim() ||
    "(ไม่ระบุชื่อ)";

  return (
    <section className="max-w-7xl mx-auto px-6 py-10 text-white">
      <h1 className="text-center text-5xl font-semibold mb-10">Profile</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* -------- กล่องโปรไฟล์ (UI เดิม) -------- */}
        <div className="bg-gray-600 rounded-xl shadow p-6">
          <h1 className="text-3xl font-semibold mb-4 text-teal-300">
            My Profile
          </h1>

          {/* แสดงข้อมูลโปรไฟล์ปกติ หรือฟอร์มแก้ไข ขึ้นกับ editing */}
          {!editing ? (
            <>
              {/* โหมดอ่านอย่างเดียว */}
              <div className="space-y-2">
                <div>
                  <span className="text-white/70">Username: </span>
                  {profile.UA_Username}
                </div>
                <div>
                  <span className="text-white/70">Name: </span>
                  {fullName}
                </div>
                <div>
                  <span className="text-white/70">Role: </span>
                  {profile.UA_Role}
                </div>
                <div>
                  <span className="text-white/70">Email: </span>
                  {profile.UA_Email || "-"}
                </div>
              </div>

              {/* ปุ่ม Log out + ปุ่มเข้าโหมดแก้ไข */}
              <div className="flex gap-3">
                <button
                  className="mt-6 px-4 py-2 rounded bg-red-500 hover:bg-red-600"
                  onClick={handleLogout}
                >
                  Log out
                </button>
                <button
                  className="mt-6 px-4 py-2 rounded bg-blue-500 hover:bg-blue-600"
                  onClick={() => setEditing(true)}
                >
                  แก้ไข
                </button>
              </div>
            </>
          ) : (
            <>
              {/* โหมดแก้ไขโปรไฟล์ */}
              <div className="space-y-3">
                {/* UA_Username */}
                <div className="grid gap-1">
                  <label className="text-sm text-white/80">Username</label>
                  <input
                    name="UA_Username"                        // key ที่ใช้ map กับ profile.UA_Username
                    value={profile.UA_Username || ""}         // แสดงค่าปัจจุบันหรือ string ว่าง
                    onChange={handleChange}                   // เวลาแก้ input ให้ไปอัปเดต profile state
                    className="px-3 py-2 rounded bg-black/20 border border-white/10 text-white"
                    placeholder="username"
                  />
                </div>

                {/* UA_FName */}
                <div className="grid gap-1">
                  <label className="text-sm text-white/80">
                    ชื่อ (First name)
                  </label>
                  <input
                    name="UA_FName"
                    value={profile.UA_FName || ""}
                    onChange={handleChange}
                    className="px-3 py-2 rounded bg-black/20 border border-white/10 text-white"
                    placeholder="ชื่อจริง"
                  />
                </div>

                {/* UA_LName */}
                <div className="grid gap-1">
                  <label className="text-sm text-white/80">
                    นามสกุล (Last name)
                  </label>
                  <input
                    name="UA_LName"
                    value={profile.UA_LName || ""}
                    onChange={handleChange}
                    className="px-3 py-2 rounded bg-black/20 border border-white/10 text-white"
                    placeholder="นามสกุล"
                  />
                </div>

                {/* UA_Email */}
                <div className="grid gap-1">
                  <label className="text-sm text-white/80">Email</label>
                  <input
                    name="UA_Email"
                    type="email"
                    value={profile.UA_Email || ""}
                    onChange={handleChange}
                    className="px-3 py-2 rounded bg-black/20 border border-white/10 text-white"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* ปุ่ม Save / Cancel */}
              <div className="flex gap-3">
                <button
                  className="mt-6 px-4 py-2 rounded bg-teal-600 hover:bg-teal-700.disabled:opacity-60"
                  onClick={handleSave}
                  disabled={saving} // ตอนกำลัง save ปิดปุ่มกันคลิกซ้ำ
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  className="mt-6 px-4 py-2 rounded bg-stone-400 text-white hover:bg-stone-500"
                  onClick={() => setEditing(false)} // ออกจากโหมดแก้ไขโดยไม่เซฟ
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>

        {/* -------- History: แสดงคีย์จาก DB (ใช้ layout เดิม) -------- */}
        <div className="bg-slate-200 rounded-xl shadow p-6 lg:col-span-2">
          <h2 className="text-black text-lg font-semibold mb-4">
            History / คีย์ที่เคยได้รับ
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-sky-600 text-white">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">สินค้า</th>
                  <th className="p-3">Key</th>
                  <th className="p-3">วันที่ได้รับ</th>
                </tr>
              </thead>
              <tbody className="text-black">
                {keysLoading && (
                  // ระหว่างโหลด key แสดงข้อความกำลังโหลด
                  <tr>
                    <td className="p-3" colSpan={4}>
                      กำลังโหลดรายการคีย์...
                    </td>
                  </tr>
                )}

                {!keysLoading && keysError && (
                  // โหลด key พัง แสดง error
                  <tr>
                    <td className="p-3 text-red-600" colSpan={4}>
                      {keysError}
                    </td>
                  </tr>
                )}

                {!keysLoading &&
                  !keysError &&
                  keys.map((k, idx) => (
                    // แสดงแต่ละ key ใน history
                    <tr key={k.KeyID || k.id || idx} className="border-t">
                      <td className="p-3">{idx + 1}</td>
                      <td className="p-3">
                        {k.Pro_Name || k.product || "-"}      {/* ชื่อสินค้า */}
                      </td>
                      <td className="p-3 font-mono">
                        {k.CD_SerialCode || k.code || "-"}    {/* serial code */}
                      </td>
                      <td className="p-3">
                        {(k.CD_DateAdded || k.createdAt || "").slice(0, 10)}
                        {/* ตัดวันที่ให้เหลือเฉพาะ YYYY-MM-DD */}
                      </td>
                    </tr>
                  ))}

                {!keysLoading && !keysError && keys.length === 0 && (
                  // โหลดสำเร็จแต่ไม่มี key ให้โชว์ข้อความว่าไม่มี
                  <tr>
                    <td className="p-3" colSpan={4}>
                      ยังไม่มีคีย์ในบัญชี
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
