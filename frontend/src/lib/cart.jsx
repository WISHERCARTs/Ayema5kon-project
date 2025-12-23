// src/lib/cart.jsx หลัง state items
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "./api";

const CartContext = createContext();
// context กลางสำหรับเก็บสถานะตะกร้าทั้งระบบ

export function CartProvider({ children }) {
  // โหลด items จาก localStorage
  const [items, setItems] = useState(() => {
    // init ตอน mount รอบแรก: พยายามอ่าน "cart.items" จาก localStorage
    try {
      const raw = localStorage.getItem("cart.items");
      return raw ? JSON.parse(raw) : [];
    } catch {
      // ถ้า parse พัง หรือข้อมูลไม่ดี -> เริ่มจาก array ว่าง
      return [];
    }
  });

  // โค้ดส่วนลด (ที่พิมพ์ในตะกร้า)
  const [coupon, setCoupon] = useState(
    () => localStorage.getItem("cart.coupon") || ""
    // init coupon จาก localStorage ถ้าเคยพิมพ์ไว้ก่อนหน้า
  );

  // จำนวนเงินส่วนลดที่ได้จาก backend
  const [discount, setDiscount] = useState(0);

  // เซฟ items ลง localStorage ทุกครั้งที่เปลี่ยน
  useEffect(() => {
    localStorage.setItem("cart.items", JSON.stringify(items));
  }, [items]);

  // เซฟ coupon ลง localStorage ทุกครั้งที่เปลี่ยน
  useEffect(() => {
    localStorage.setItem("cart.coupon", coupon);
  }, [coupon]);

  // เคลียร์ของแปลก ๆ ครั้งแรก
  useEffect(() => {
    // เช็คว่ามี item ไหน field ไม่ถูกต้องไหม (เช่น price ไม่ใช่ number หรือไม่มี id)
    const bad = items.some(
      (it) => typeof it.price !== "number" || typeof it.id === "undefined"
    );
    if (bad) {
      // ถ้าเจอของแปลก -> ล้าง storage + เคลียร์ตะกร้า
      localStorage.removeItem("cart.items");
      setItems([]);
    }
    // dependency [] -> ทำแค่ครั้งเดียวตอน mount
  }, []);

  // ================= เช็คโค้ดส่วนลดกับ backend =================
  useEffect(() => {
    // ถ้าไม่ได้กรอกโค้ด -> ไม่ลด
    if (!coupon) {
      setDiscount(0);
      return;
    }

    let cancelled = false; // flag กัน setState หลัง unmount

    (async () => {
      try {
        const res = await api.get("/discountcode/check", {
          params: { code: coupon },
          // ส่ง code ไปให้ backend ผ่าน query string ?code=...
          // ฝั่ง backend ต้องอ่านจาก req.query.code ให้ตรงกับตรงนี้
        });

        if (cancelled) return;

        if (res.data?.valid) {
          // ถ้า backend บอกว่าโค้ด valid
          setDiscount(Number(res.data.discountPrice) || 0);
          // ตั้ง discount เป็นตัวเลขจาก discountPrice
        } else {
          setDiscount(0); // โค้ดไม่ถูกต้อง / หมดอายุ
        }
      } catch (err) {
        console.error("check discount error", err);
        if (!cancelled) setDiscount(0);
        // ถ้าเรียก backend พัง ให้ถือว่าไม่มีส่วนลด
      }
    })();

    return () => {
      // cleanup: ถ้า effect ถูกยกเลิกก่อนคำตอบกลับมา -> ตั้ง cancelled = true
      cancelled = true;
    };
  }, [coupon]);
  // ทุกครั้งที่ coupon เปลี่ยน -> re-check กับ backend

  // ================= สรุปราคา =================
  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.price * it.qty, 0),
    [items]
    // รวมราคาก่อนลด = sum(price * qty) ของทุก item
  );

  const totalQty = useMemo(
    () => items.reduce((s, it) => s + it.qty, 0),
    [items]
    // รวมจำนวนชิ้นทั้งหมดในตะกร้า
  );

  const total = Math.max(subtotal - discount, 0);
  // ราคาสุทธิ = subtotal - discount (แต่ไม่ให้ติดลบ)

  // ================= ฟังก์ชันจัดการตะกร้า =================
  const add = (product, qty = 1) => {
    // เพิ่มสินค้าลงตะกร้า (รับ object product + จำนวนที่จะเพิ่ม)
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.id === product.id);
      if (idx >= 0) {
        // ถ้ามีสินค้า id นี้อยู่แล้ว -> เพิ่ม qty ทับตัวเดิม
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      // ถ้ายังไม่มี -> ดึง field ที่ต้องใช้แล้ว push เข้า array
      const { id, name, price, image } = product;
      return [...prev, { id, name, price, image, qty }];
    });
  };

  const setQty = (id, qty) => {
    // ตั้งจำนวนใหม่ของสินค้าตาม id
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, qty: Math.max(1, qty) } : x))
      // ถ้าเจอ id ที่ตรง -> อัปเดต qty (แต่ไม่ให้ต่ำกว่า 1)
    );
  };

  const remove = (id) =>
    // ลบสินค้าตาม id ออกจากตะกร้า
    setItems((prev) => prev.filter((x) => x.id !== id));

  const clear = () => setItems([]);
  // เคลียร์ตะกร้าทั้งหมด

  const value = {
    items,
    add,
    setQty,
    remove,
    clear,
    coupon,
    setCoupon,
    subtotal,
    discount,
    total,
    totalQty,
    // export ทุกอย่างที่ component อื่นในแอปต้องใช้เกี่ยวกับ cart
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
    // ครอบ children ทั้งแอป/ส่วนที่อยากให้ใช้ cart ได้
  );
}

export const useCart = () => useContext(CartContext);
// hook ใช้งานง่าย ๆ: const { items, add, total } = useCart();
