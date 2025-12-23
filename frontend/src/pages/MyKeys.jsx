// pages/MyKeys.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function MyKeys() {
  const { user, isAuthenticated } = useAuth(); // ดึงข้อมูล user ปัจจุบัน + flag ว่าล็อกอินอยู่ไหม
  const nav = useNavigate();
  const [items, setItems] = useState([]);      // เก็บรายการ key ที่โหลดมาจาก backend
  const [loading, setLoading] = useState(true); // flag แสดงว่ากำลังโหลดข้อมูลอยู่

  // ถ้ายังไม่ login → เด้งไป /login
  // effect นี้ทำหน้าที่เป็น guard หน้า /keys ถ้าไม่ authenticated ให้ redirect ไปหน้า login
  useEffect(() => {
    if (!isAuthenticated) {
      nav("/login", { state: { from: "/keys" } });
      // ส่ง state.from = "/keys" ไปด้วย เพื่อหลังล็อกอินจะได้เด้งกลับมาหน้านี้
    }
  }, [isAuthenticated, nav]);

  // โหลด key ของ user จาก backend
  // effect นี้จะยิง API ไปดึงคีย์ของ user ตาม user.id เมื่อ user เปลี่ยนหรือพร้อมใช้งาน
  useEffect(() => {
    const load = async () => {
      if (!user?.id) return; // ถ้ายังไม่มี id (เช่นระหว่าง init) ไม่ต้องโหลด

      try {
        setLoading(true);
        const res = await api.get(`/cdkey/mykeys/${user.id}`);
        // backend ตอบ { error, data, message } ใช้ data เป็นรายการ key
        setItems(res.data?.data || []);
      } catch (err) {
        console.error("load mykeys.error", err);
        setItems([]); // ถ้า error ให้เคลียร์รายการเป็น array ว่าง
      } finally {
        setLoading(false); // จบการโหลด ไม่ว่าจะ success หรือ fail
      }
    };

    if (user?.id) load(); // call load เฉพาะเมื่อมี user.id แล้ว
  }, [user?.id]);

  // ถ้ายังไม่ authenticated ให้ return null (เพราะมี effect รีไดเรกต์ไป login อยู่แล้ว)
  if (!isAuthenticated) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-10 mb-80">
      <h1 className="text-2xl font-semibold mb-6">คีย์ของฉัน</h1>

      {loading ? (
        // ระหว่างโหลดข้อมูล แสดงข้อความกำลังโหลด
        <p className="text-white">กำลังโหลดคีย์...</p>
      ) : (
        // โหลดเสร็จแล้ว แสดงตารางรายการ key
        <div className="overflow-x-auto bg-gray-100 rounded-xl shadow">
          <table className="min-w-full text-left">
            <thead className="bg-sky-700 text-white text-xl">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">สินค้า</th>
                <th className="p-3">Key</th>
                <th className="p-3">วันที่ได้รับ</th>
              </tr>
            </thead>
            <tbody className="text-black text-xl">
              {items.map((k, idx) => (
                // map แสดงแต่ละ key ในรูปแบบตาราง
                <tr key={k.KeyID} className="border-t">
                  <td className="p-3">{idx + 1}</td>                   {/* ลำดับที่ */}
                  <td className="p-3">{k.Pro_Name}</td>               {/* ชื่อเกม/สินค้า */}
                  <td className="p-3 font-mono">{k.CD_SerialCode}</td> {/* CD key ที่ซื้อมา */}
                  <td className="p-3">
                    {String(k.CD_DateAdded).slice(0, 10)}
                    {/* แสดงวันที่เพิ่ม key โดยตัดให้เหลือเฉพาะ YYYY-MM-DD */}
                  </td>
                </tr>
              ))}
              {items.length === 0 && !loading && (
                // ถ้าโหลดเสร็จแล้วแต่ไม่มี key ให้แจ้งว่า “ยังไม่มีคีย์ในบัญชี”
                <tr>
                  <td className="p-3" colSpan={4}>
                    ยังไม่มีคีย์ในบัญชี
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
