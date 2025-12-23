export default function AboutUs() {
  // component หน้าแนะนำทีม ใช้แสดงข้อมูลสมาชิกแบบ static (ไม่มี state/props)
  return (
    <section className="bg-[#222] text-white py-10">
      <div className="grid lg:grid-cols-1 max-w-7xl mx-auto px-6 py-10">

        {/* หัวข้อหลัก */}
        {/* ส่วนหัวบนสุดของหน้า แสดงคำว่า Our Team ตรงกลาง */}
        <h1 className="text-5xl sm:text-6xl font-light tracking-tight mb-8 text-center">
          <span className="text-[oklch(78%_0.16_170)] font-semibold">Our</span>{" "}
          <span className="text-white/95 font-semibold">Team</span>
        </h1>

        {/* คนที่ 1 */}
        {/* block สมาชิกคนที่ 1 แบ่งซ้าย-ขวา: ซ้ายเป็นข้อความ ขวาเป็นรูป */}
        <div className="grid lg:grid-cols-2 gap-12 items-center py-10">
          <div className="space-y-4 text-left">
            <p className="text-3xl sm:text-4xl font-light text-[oklch(78%_0.16_170)]">
              Hello I’m
            </p>
            <p className="text-4xl sm:text-5xl font-semibold text-[oklch(78%_0.16_170)]">
              Chanasorn Chirapongsaton
            </p>
            <p className="text-2xl sm:text-3xl font-light text-[oklch(78%_0.16_170)]">
              by 6787015
            </p>
            {/* แถวลิงก์ social ของคนที่ 1 */}
            <div className="flex items-center gap-4 pt-4">
              <a
                href="https://www.instagram.com/nebu1.su_"
                target="_blank" // เด้งไป tab ใหม่
              >
                <img
                  src="/assets/ig_icon.png"
                  alt="Instagram"
                  className="w-7.5 h-7.5 object-contain hover:scale-110 transition"
                />
              </a>
              <a
                href="https://www.facebook.com/chanasorn.sugus"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/assets/facebook.webp"
                  alt="Facebook"
                  className="w-12 h-12 object-contain hover:scale-110 transition"
                />
              </a>
            </div>

          </div>
          {/* รูปคนที่ 1 */}
          <div className="flex justify-center lg:justify-end">
            <img src="/assets/Su_img.png" alt="Teammate 1" className="w-[320px] rounded-full object-contain hover:scale-110 transition" />
          </div>
        </div>

        {/* คนที่ 2 */}
        {/* block สมาชิกคนที่ 2 กลับด้าน: ซ้ายเป็นรูป ขวาเป็นข้อความ */}
        <div className="grid lg:grid-cols-2 gap-12 items-center py-10">
          <div className="flex justify-center lg:justify-start">
            <img src="/assets/Wai_img.png" alt="Teammate 2" className="w-[320px] rounded-full object-contain hover:scale-110 transition" />
          </div>
          <div className="space-y-4 text-right">
            <p className="text-3xl sm:text-4xl font-light text-teal-400">
              Hello I’m
            </p>
            <p className="text-4xl sm:text-5xl font-semibold text-teal-400">
              Theerawat Puvekit
            </p>
            <p className="text-2xl sm:text-3xl font-light text-teal-400">
              by 6787044
            </p>
            {/* social ของคนที่ 2 */}
            <div className="flex justify-end gap-4 pt-4">
              <a
                href="https://www.instagram.com/__.waity.__"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/assets/ig_icon.png"
                  alt="Instagram"
                  className="w-8 h-12 object-contain hover:scale-110 transition"
                />
              </a>
              <a
                href="https://www.facebook.com/theerawat.puvekit"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/assets/facebook.webp"
                  alt="Facebook"
                  className="w-12 h-12 object-contain hover:scale-110 transition"
                />
              </a>
            </div>
          </div>
        </div>

        {/* คนที่ 3 */}
        {/* block สมาชิกคนที่ 3 layout เดียวกับคนที่ 1: ข้อความซ้าย รูปขวา */}
        <div className="grid lg:grid-cols-2 gap-12 items-center py-10">
          <div className="space-y-4 text-left">
            <p className="text-3xl sm:text-4xl font-light text-sky-400">Hello I’m</p>
            <p className="text-4xl sm:text-5xl font-semibold text-sky-400">Wish Nakthong</p>
            <p className="text-2xl sm:text-3xl font-light text-sky-400 ">by 6787074</p>
            {/* social ของคนที่ 3 */}
            <div className="flex items-center gap-4 pt-4">
            <a
              href="https://www.instagram.com/wishercarts"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/assets/ig_icon.png"
                alt="Instagram"
                className="w-7.5 h-7.5 object-contain hover:scale-110 transition"
              />
            </a>
            <a
              href="https://www.facebook.com/wish.nakthong/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/assets/facebook.webp"
                alt="Facebook"
                className="w-12 h-12 object-contain hover:scale-110 transition"
              />
            </a>
          </div>
          </div>
          {/* รูปคนที่ 3 */}
          <div className="flex justify-center lg:justify-end">
            <img src="/assets/Wish_img.png" alt="Teammate 3" className="w-[320px] rounded-full object-contain hover:scale-110 transition" />
          </div>
          
          
        </div>

        {/* คนที่ 4 */}
        {/* block สมาชิกคนที่ 4 layout แบบรูปซ้าย ข้อความขวา */}
        <div className="grid lg:grid-cols-2 gap-12 items-center py-10">
          <div className="flex justify-center lg:justify-start">
            <img src="/assets/Boom_img.png" alt="Teammate 4" className="w-[320px] rounded-full object-contain hover:scale-110 transition" />
          </div>
          <div className="space-y-4 text-right">
            <p className="text-3xl sm:text-4xl font-light text-pink-400">Hello I’m</p>
            <p className="text-4xl sm:text-5xl font-semibold text-pink-400">Saksit Jittasopee</p>
            <p className="text-2xl sm:text-3xl font-light text-pink-400">by 6787077</p>
            {/* social ของคนที่ 4 */}
            <div className="flex justify-end gap-4 pt-4">
              <a
                href="https://www.instagram.com/saksitjittasopee"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/assets/ig_icon.png"
                  alt="Instagram"
                  className="w-8 h-12 object-contain hover:scale-110 transition"
                />
              </a>
              <a
                href="https://www.facebook.com/saksit.jittasopee.1#"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/assets/facebook.webp"
                  alt="Facebook"
                  className="w-12 h-12 object-contain hover:scale-110 transition"
                />
              </a>
            </div>

          </div>
        </div>

        {/* คนที่ 5 */}
        {/* block สมาชิกคนที่ 5 layout แบบข้อความซ้าย รูปขวา ปิดท้ายหน้า */}
        <div className="grid lg:grid-cols-2 gap-12 items-center py-10">
          <div className="space-y-4 text-left">
            <p className="text-3xl sm:text-4xl font-light text-yellow-400">Hello I’m</p>
            <p className="text-4xl sm:text-5xl font-semibold text-yellow-400">Polpipat Yimjan</p>
            <p className="text-2xl sm:text-3xl font-light text-yellow-400">by 6787093</p>
            {/* social ของคนที่ 5 */}
            <div className="flex items-center gap-4 pt-4">
            <a
              href="https://www.instagram.com/ice_yimjan"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/assets/ig_icon.png"
                alt="Instagram"
                className="w-7.5 h-7.5 object-contain hover:scale-110 transition"
              />
            </a>
            <a
              href="https://www.facebook.com/DrackKerN"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/assets/facebook.webp"
                alt="Facebook"
                className="w-12 h-12 object-contain hover:scale-110 transition"
              />
            </a>
          </div>
          </div>
          {/* รูปคนที่ 5 */}
          <div className="flex justify-center lg:justify-end">
            <img src="/assets/Ice_img.png" alt="Teammate 5" className="w-[320px] rounded-full object-contain hover:scale-110 transition" />
          </div>
        

        </div>

      </div>
    </section>
  );
}
