// frontend/src/pages/Admin/Products.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api";

export default function AdminProducts() {
  // state หลัก
  const [products, setProducts] = useState([]);         // เก็บรายการสินค้าจาก backend
  const [loading, setLoading] = useState(true);         // flag ใช้บอกว่ากำลังโหลดอยู่
  const [error, setError] = useState("");               // เก็บข้อความ error ถ้าโหลด fail

  // filter + search
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | inactive
  const [search, setSearch] = useState("");                // ข้อความค้นหาตามชื่อ / ProID

  // form add / edit
  const [isFormOpen, setIsFormOpen] = useState(false); // คุมการเปิด/ปิด modal ฟอร์ม
  const [editingId, setEditingId] = useState(null);    // ProID ตอนแก้ไข (null = เพิ่มใหม่)
  const [form, setForm] = useState({
    Pro_Name: "",
    Pro_Price: "",
    Pro_Status: "active",
    Pro_Image: "",
  });
  // form state สำหรับ input ใน modal ทั้งเพิ่ม + แก้

  // โหลดสินค้า จาก backend
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/product/getall");
      // server ฝั่งนายส่ง { error, data, message }
      const rows = res.data.data || [];
      setProducts(rows); // เก็บรายการสินค้าลง state
    } catch (err) {
      console.error(err);
      setError("โหลดรายการสินค้าไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // เรียกโหลดสินค้า 1 ครั้งตอน component mount
    loadProducts();
  }, []);

  // handle เปลี่ยนค่าฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    // อัปเดตค่าฟอร์มตามชื่อ field (name) ที่ผูกไว้กับ input/select
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // กดปุ่ม "เพิ่มสินค้าใหม่"
  const handleOpenAdd = () => {
    // เคลียร์ editingId ให้เป็น null เพื่อบอกว่าเป็นโหมดเพิ่ม
    setEditingId(null);
    // รีเซ็ตฟอร์มให้ว่าง
    setForm({
      Pro_Name: "",
      Pro_Price: "",
      Pro_Status: "active",
      Pro_Image: "",
    });
    // เปิด modal ฟอร์ม
    setIsFormOpen(true);
  };

  // กดปุ่ม "แก้ไข" แถวใดแถวหนึ่ง
  const handleOpenEdit = (p) => {
    // เก็บ ProID ที่กำลังแก้ไขอยู่
    setEditingId(p.ProID);
    // เซ็ตฟอร์มให้มีค่าเริ่มจากสินค้าที่เลือก
    setForm({
      Pro_Name: p.Pro_Name || "",
      Pro_Price: p.Pro_Price ?? "",
      Pro_Status: (p.Pro_Status || "active").toLowerCase(),
      Pro_Image: p.Pro_Image || "",
    });
    // เปิด modal ฟอร์มโหมดแก้ไข
    setIsFormOpen(true);
  };

  // submit form (ทั้งเพิ่ม + แก้)
  const handleSubmit = async (e) => {
    e.preventDefault(); // กันไม่ให้ form reload หน้า

    try {
      // แปลงเป็น number ถ้าอยากชัวร์
      const priceNum = Number(form.Pro_Price || 0);

      const payload = {
        ...form,
        Pro_Price: priceNum,
        Pro_Status: form.Pro_Status.toLowerCase(),
      };
      // เตรียม payload ที่จะส่งให้ backend

      if (editingId == null) {
        // INSERT
        await api.post("/product/insertinfo", {
          product: payload,
        });
      } else {
        // UPDATE
        await api.put("/product/updateinfo", {
          product: {
            ...payload,
            ProID: editingId, // ใส่ ProID ที่กำลังแก้เพื่อให้ backend รู้ว่าจะ update แถวไหน
          },
        });
      }

      // ปิดฟอร์ม + รีเซ็ตโหมดแก้ไข
      setIsFormOpen(false);
      setEditingId(null);
      // โหลดรายการสินค้าล่าสุดมาแสดงใหม่
      await loadProducts();
    } catch (err) {
      console.error(err);
      alert("บันทึกสินค้าไม่สำเร็จ");
    }
  };

  // ลบสินค้า
  const handleDelete = async (id) => {
    // ยืนยันก่อนลบ
    if (!window.confirm("ต้องการลบสินค้านี้จริง ๆ ใช่ไหม ?")) return;

    try {
      await api.delete("/product/deleteinfo", {
        data: { ProID: id }, // axios.delete ต้องใส่ body ผ่าน field data
      });
      // ลบสำเร็จแล้ว reload รายการ
      await loadProducts();
    } catch (err) {
      console.error(err);
      alert("ลบสินค้าไม่สำเร็จ");
    }
  };

  // toggle active/inactive (เปลี่ยนสถานะ)
  const handleToggleStatus = async (p) => {
    try {
      const newStatus =
        (p.Pro_Status || "active").toLowerCase() === "active"
          ? "inactive"
          : "active";
      // ถ้าปัจจุบัน active -> เปลี่ยนเป็น inactive, ถ้าไม่ใช่ก็กลับเป็น active

      await api.put("/product/updateinfo", {
        product: {
          ...p,
          Pro_Status: newStatus, // ส่งข้อมูลสินค้าเดิมทั้งตัว แต่เปลี่ยนสถานะใหม่
        },
      });
      // เปลี่ยนสถานะสำเร็จแล้ว reload รายการ
      await loadProducts();
    } catch (err) {
      console.error(err);
      alert("เปลี่ยนสถานะสินค้าไม่สำเร็จ");
    }
  };

  // filter + search
  const filteredProducts = useMemo(() => {
    const s = search.toLowerCase().trim();
    // เตรียม keyword สำหรับค้นหา (ตัวเล็ก + trim)

    return products.filter((p) => {
      const statusNorm = (p.Pro_Status || "active").toLowerCase();
      const hitStatus =
        statusFilter === "all" ? true : statusNorm === statusFilter;
      // ถ้า filter = all -> ผ่านทุกตัว
      // ถ้าไม่ใช่ all -> ต้องมีสถานะตรงกับ filter

      const hitSearch =
        !s ||
        (p.Pro_Name || "").toLowerCase().includes(s) ||
        String(p.ProID || "").includes(s);
      // ถ้าไม่มี keyword -> ผ่าน
      // ถ้ามี -> เช็คชื่อตัวเล็ก หรือ ProID มี keyword นั้นอยู่ไหม

      return hitStatus && hitSearch;
    });
  }, [products, statusFilter, search]);
  // ใช้ useMemo เพื่อลดการคำนวณซ้ำทุก render ถ้า deps ยังเหมือนเดิม

  if (loading) {
    // ระหว่างโหลดสินค้าให้แสดงข้อความโหลดแทนทั้งหน้า
    return (
      <main className="p-6 text-white">
        <h1 className="text-2xl font-semibold mb-4">จัดการสินค้า</h1>
        <p>กำลังโหลดสินค้า...</p>
      </main>
    );
  }

  if (error) {
    // ถ้าโหลด fail ให้แสดงข้อความ error
    return (
      <main className="p-6 text-white">
        <h1 className="text-2xl font-semibold mb-4">จัดการสินค้า</h1>
        <p className="text-red-400">{error}</p>
      </main>
    );
  }

  return (
    <main className="p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">จัดการสินค้า</h1>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded bg-teal-600 hover:bg-teal-700 text-sm"
        >
          + เพิ่มสินค้าใหม่
        </button>
        {/* ปุ่มเปิด modal สำหรับเพิ่มสินค้าใหม่ */}
      </div>

      {/* filter bar */}
      <div className="bg-[#1f2933] rounded-lg p-4 mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="ค้นหาด้วยชื่อเกม / ProID"
          className="px-3 py-2 rounded bg-black/30 text-sm flex-1 min-w-[200px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          // พิมพ์แล้วอัปเดต state search -> ส่งผลไป filteredProducts
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded bg-black/30 text-sm"
        >
          <option value="all">ทุกสถานะ</option>
          <option value="active">active</option>
          <option value="inactive">inactive</option>
        </select>

        <span className="text-xs text-gray-400 self-center">
          แสดง {filteredProducts.length} จากทั้งหมด {products.length} รายการ
          {/* แสดงจำนวนที่ผ่าน filter เทียบกับทั้งหมด */}
        </span>
      </div>

      {/* ตาราง */}
      <div className="overflow-x-auto bg-[#111827] rounded-lg shadow">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-black/40 text-gray-300">
              <th className="px-3 py-2 text-left">ProID</th>
              <th className="px-3 py-2 text-left">ชื่อสินค้า</th>
              <th className="px-3 py-2 text-right">ราคา (บาท)</th>
              <th className="px-3 py-2 text-center">สถานะ</th>
              <th className="px-3 py-2 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              // ถ้า filter แล้วไม่เหลือรายการเลย
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-4 text-center text-gray-400"
                >
                  ไม่พบสินค้า
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr
                  key={p.ProID}
                  className="border-t border-white/5 hover:bg-white/5"
                >
                  <td className="px-3 py-2">{p.ProID}</td>
                  <td className="px-3 py-2">{p.Pro_Name}</td>
                  <td className="px-3 py-2 text-right">
                    {Number(p.Pro_Price || 0).toLocaleString("th-TH")}
                    {/* แปลงราคาเป็นรูปแบบมีคอมม่า ตาม locale ไทย */}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => handleToggleStatus(p)}
                      className={`px-2 py-1 rounded text-xs ${
                        (p.Pro_Status || "active").toLowerCase() === "active"
                          ? "bg-green-600/70"
                          : "bg-gray-600/70"
                      }`}
                    >
                      {(p.Pro_Status || "active").toLowerCase()}
                      {/* แสดงสถานะปัจจุบัน และกดเพื่อ toggle ได้ */}
                    </button>
                  </td>
                  <td className="px-3 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="px-2 py-1 text-xs rounded bg-blue-600/80 hover:bg-blue-700"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(p.ProID)}
                      className="px-2 py-1 text-xs rounded bg-red-600/80 hover:bg-red-700"
                    >
                      ลบ
                    </button>
                    {/* ปุ่มแก้ไข/ลบ ต่อ 1 แถวสินค้า */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ฟอร์มเพิ่ม/แก้ไข */}
      {isFormOpen && (
        // แสดง modal overlay เมื่อ isFormOpen = true
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-[#111827] rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
              {/* เปลี่ยนหัวข้อ modal ตามโหมด เพิ่ม/แก้ */}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text.sm mb-1">ชื่อสินค้า</label>
                <input
                  type="text"
                  name="Pro_Name"
                  className="w-full px-3 py-2 rounded bg-black/40 text-sm"
                  value={form.Pro_Name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1">ราคา (บาท)</label>
                <input
                  type="number"
                  name="Pro_Price"
                  className="w-full px-3 py-2 rounded bg.black/40 text-sm"
                  value={form.Pro_Price}
                  onChange={handleChange}
                  min={0}
                  step={1}
                  required
                />
                {/* bg.black/40 ตรงนี้พิมพ์ผิดจาก bg-black/40 แต่ไม่แตะตามที่ขอ */}
              </div>

              <div>
                <label className="block text-sm mb-1">สถานะ</label>
                <select
                  name="Pro_Status"
                  className="w-full px-3 py-2 rounded bg-black/40 text-sm"
                  value={form.Pro_Status}
                  onChange={handleChange}
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">รูปภาพ (URL)</label>
                <input
                  type="text"
                  name="Pro_Image"
                  className="w-full px-3 py-2 rounded bg-black/40 text-sm"
                  value={form.Pro_Image}
                  onChange={handleChange}
                  placeholder="/assets/....jpg"
                />
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
                  {editingId ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
                  {/* ปุ่ม submit ฟอร์ม ทั้งเพิ่ม/แก้ */}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
