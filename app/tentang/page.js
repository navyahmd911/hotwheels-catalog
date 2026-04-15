"use client"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { FaWhatsapp, FaInstagram, FaFacebook, FaYoutube, FaMapMarkerAlt, FaClock, FaShieldAlt, FaTruck, FaStar } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import { motion } from "framer-motion"

const KONTAK = {
  wa: process.env.NEXT_PUBLIC_ADMIN_WA || "6281234567890",
  instagram: "rontaxxdiecast",
  lokasi: "Malang, Jawa Timur",
  jam: "Senin - Sabtu, 09.00 - 21.00 WIB",
}

const STATS = [
  { label: "Produk Tersedia", value: "100+" },
  { label: "Series Koleksi", value: "10+" },
  { label: "Pelanggan Puas", value: "500+" },
  { label: "Tahun Berdiri", value: "2020" },
]

const KEUNGGULAN = [
  {
    icon: <FaShieldAlt size={22} />,
    judul: "100% Original",
    deskripsi: "Semua produk kami dijamin original langsung dari distributor resmi."
  },
  {
    icon: <FaTruck size={22} />,
    judul: "Pengiriman Aman",
    deskripsi: "Produk dikemas dengan aman dan dikirim ke seluruh Indonesia."
  },
  {
    icon: <FaStar size={22} />,
    judul: "Koleksi Lengkap",
    deskripsi: "Dari Speed Machines hingga Super Treasure Hunt, semua ada di sini."
  },
]

export default function TentangKami() {
  const handleWA = () => {
    const pesan = encodeURIComponent("Halo, saya ingin bertanya tentang koleksi diecast Rontaxx Diecast.")
    window.open(`https://wa.me/${KONTAK.wa}?text=${pesan}`, "_blank")
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1 }}>

        {/* HERO */}
        <section style={{
          position: "relative",
          height: 320,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "url(/hero-bg.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 0,
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(10,10,10,1))",
            zIndex: 1,
          }} />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ position: "relative", zIndex: 2, textAlign: "center" }}
          >
            <div style={{
              display: "inline-block",
              background: "#e2001a",
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              padding: "4px 14px",
              borderRadius: 20,
              letterSpacing: 1,
              marginBottom: 16,
              textTransform: "uppercase",
            }}>
              Rontaxx Diecast
            </div>
            <h1 style={{ fontSize: 48, fontWeight: 900, margin: "0 0 12px", letterSpacing: -1 }}>
              Tentang <span style={{ color: "#e2001a" }}>Kami</span>
            </h1>
            <p style={{ color: "#aaa", fontSize: 16, margin: 0 }}>
              Spesialis diecast Hot Wheels terlengkap di Malang
            </p>
          </motion.div>
        </section>

        {/* STATS */}
        <section style={{ maxWidth: 1000, margin: "0 auto", padding: "0 20px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
            marginTop: -40,
            position: "relative",
            zIndex: 10,
          }}>
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{
                  background: "#111",
                  border: "1px solid #1a1a1a",
                  borderRadius: 12,
                  padding: "20px 16px",
                  textAlign: "center",
                  boxShadow: "0 0 20px rgba(0,0,0,0.5)",
                }}
              >
                <p style={{ fontSize: 32, fontWeight: 900, color: "#e2001a", margin: "0 0 4px" }}>{s.value}</p>
                <p style={{ fontSize: 12, color: "#555", margin: 0 }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TENTANG */}
        <section style={{ maxWidth: 1000, margin: "60px auto 0", padding: "0 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>

            {/* FOTO TOKO */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                background: "#111",
                border: "1px solid #1a1a1a",
                borderRadius: 16,
                overflow: "hidden",
                height: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <img
                src="/toko.jpg"
                alt="Toko"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={e => {
                  e.currentTarget.style.display = "none"
                }}
              />
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                opacity: 0.15
              }}>
                <div style={{ fontSize: 80 }}>🏪</div>
                <p style={{ fontSize: 14 }}>Foto Toko</p>
              </div>
              {/* BADGE */}
              <div style={{
                position: "absolute", bottom: 16, left: 16,
                background: "rgba(0,0,0,0.8)",
                border: "1px solid #333",
                borderRadius: 10, padding: "8px 14px",
              }}>
                <p style={{ fontSize: 11, color: "#e2001a", margin: "0 0 2px", fontWeight: 700 }}>RONTAXX DIECAST</p>
                <p style={{ fontSize: 11, color: "#666", margin: 0 }}>Since 2020</p>
              </div>
            </motion.div>

            {/* DESKRIPSI */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p style={{ fontSize: 11, color: "#e2001a", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 12px" }}>Siapa Kami</p>
              <h2 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 16px", lineHeight: 1.2 }}>
                Spesialis Diecast <span style={{ color: "#e2001a" }}>Hot Wheels</span>
              </h2>
              <p style={{ color: "#888", fontSize: 15, lineHeight: 1.8, margin: "0 0 16px" }}>
                Rontaxx Diecast adalah toko koleksi diecast Hot Wheels yang berdiri sejak 2020 di Malang, Jawa Timur. Kami hadir untuk memenuhi kebutuhan para kolektor diecast dengan koleksi terlengkap dan terpercaya.
              </p>
              <p style={{ color: "#888", fontSize: 15, lineHeight: 1.8, margin: "0 0 24px" }}>
                Dari seri reguler hingga Super Treasure Hunt yang langka, kami selalu berusaha menghadirkan koleksi terbaik untuk para pecinta diecast.
              </p>

              {/* INFO */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <FaMapMarkerAlt size={14} color="#e2001a" />
                  <span style={{ color: "#aaa", fontSize: 14 }}>{KONTAK.lokasi}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <FaClock size={14} color="#e2001a" />
                  <span style={{ color: "#aaa", fontSize: 14 }}>{KONTAK.jam}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* KEUNGGULAN */}
        <section style={{ maxWidth: 1000, margin: "60px auto 0", padding: "0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <p style={{ fontSize: 11, color: "#e2001a", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 8px" }}>Kenapa Kami</p>
            <h2 style={{ fontSize: 28, fontWeight: 900, margin: 0 }}>Keunggulan Kami</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {KEUNGGULAN.map((k, i) => (
              <motion.div
                key={k.judul}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{
                  background: "#111",
                  border: "1px solid #1a1a1a",
                  borderRadius: 14,
                  padding: 24,
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#e2001a"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#1a1a1a"}
              >
                <div style={{
                  width: 48, height: 48,
                  borderRadius: 12,
                  background: "rgba(226,0,26,0.1)",
                  border: "1px solid rgba(226,0,26,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#e2001a", marginBottom: 16,
                }}>
                  {k.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 8px" }}>{k.judul}</h3>
                <p style={{ color: "#666", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{k.deskripsi}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* KONTAK */}
        <section style={{ maxWidth: 1000, margin: "60px auto 80px", padding: "0 20px" }}>
          <div style={{
            background: "#111",
            border: "1px solid #1a1a1a",
            borderRadius: 20,
            padding: 40,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 24,
          }}>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 8px" }}>
                Ada yang ingin <span style={{ color: "#e2001a" }}>ditanyakan?</span>
              </h2>
              <p style={{ color: "#666", fontSize: 14, margin: 0 }}>
                Hubungi kami langsung via WhatsApp atau media sosial
              </p>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {/* SOSMED */}
              {[
                { icon: <FaInstagram size={16} />, label: "Instagram" },
                { icon: <FaXTwitter size={16} />, label: "X" },
                { icon: <FaFacebook size={16} />, label: "Facebook" },
                { icon: <FaYoutube size={16} />, label: "YouTube" },
              ].map(s => (
                <div key={s.label} title={s.label} style={{
                  width: 38, height: 38, borderRadius: "50%",
                  border: "1px solid #333",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#aaa",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#e2001a"; e.currentTarget.style.color = "#fff" }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#aaa" }}
                >
                  {s.icon}
                </div>
              ))}

              {/* TOMBOL WA */}
              <button
                onClick={handleWA}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 20px",
                  background: "#25d366",
                  border: "none", borderRadius: 10,
                  color: "#fff", fontWeight: 700, fontSize: 14,
                  cursor: "pointer",
                  boxShadow: "0 0 16px rgba(37,211,102,0.3)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 24px rgba(37,211,102,0.5)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 16px rgba(37,211,102,0.3)"}
              >
                <FaWhatsapp size={18} /> Chat WhatsApp
              </button>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
