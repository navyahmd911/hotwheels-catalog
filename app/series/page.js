"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { motion, AnimatePresence } from "framer-motion"
import { FaLayerGroup, FaChevronDown, FaWhatsapp } from "react-icons/fa"

const SERIES_COLORS = [
  { bg: "rgba(226,0,26,0.1)", border: "rgba(226,0,26,0.3)", glow: "rgba(226,0,26,0.15)", accent: "#e2001a" },
  { bg: "rgba(255,140,0,0.1)", border: "rgba(255,140,0,0.3)", glow: "rgba(255,140,0,0.15)", accent: "#ff8c00" },
  { bg: "rgba(0,120,255,0.1)", border: "rgba(0,120,255,0.3)", glow: "rgba(0,120,255,0.15)", accent: "#0078ff" },
  { bg: "rgba(0,200,100,0.1)", border: "rgba(0,200,100,0.3)", glow: "rgba(0,200,100,0.15)", accent: "#00c864" },
  { bg: "rgba(180,0,255,0.1)", border: "rgba(180,0,255,0.3)", glow: "rgba(180,0,255,0.15)", accent: "#b400ff" },
  { bg: "rgba(255,220,0,0.1)", border: "rgba(255,220,0,0.3)", glow: "rgba(255,220,0,0.15)", accent: "#ffdc00" },
]

export default function SeriesPage() {
  const router = useRouter()
  const [series, setSeries] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState(null)
  const [produkBySeries, setProdukBySeries] = useState({})
  const [loadingProduk, setLoadingProduk] = useState({})

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const res = await fetch("/api/series")
        const data = await res.json()
        // Filter duplikat by nama
        const unique = data.filter((s, i, arr) => arr.findIndex(x => x.nama === s.nama) === i)
        setSeries(unique)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchSeries()
  }, [])

  const handleToggle = async (id) => {
    if (activeId === id) {
      setActiveId(null)
      return
    }
    setActiveId(id)
    if (!produkBySeries[id]) {
      setLoadingProduk(prev => ({ ...prev, [id]: true }))
      try {
        const res = await fetch(`/api/produk?series_id=${id}`)
        const data = await res.json()
        setProdukBySeries(prev => ({ ...prev, [id]: data }))
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingProduk(prev => ({ ...prev, [id]: false }))
      }
    }
  }

  const handleWA = (p) => {
    const nomor = process.env.NEXT_PUBLIC_ADMIN_WA
    const pesan = encodeURIComponent(
      `Halo, saya tertarik dengan produk:\n\n*${p.nama}*\nNomor Seri: ${p.nomor_seri || "-"}\nHarga: Rp ${Number(p.harga).toLocaleString("id-ID")}\n\nApakah masih tersedia?`
    )
    window.open(`https://wa.me/${nomor}?text=${pesan}`, "_blank")
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1 }}>

        {/* HERO */}
        <section style={{
          position: "relative", height: 280, overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/hero-bg.jpg)", backgroundSize: "cover", backgroundPosition: "center", zIndex: 0 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(10,10,10,1))", zIndex: 1 }} />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ position: "relative", zIndex: 2, textAlign: "center" }}
          >
            <div style={{ display: "inline-block", background: "#e2001a", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20, letterSpacing: 1, marginBottom: 16, textTransform: "uppercase" }}>
              Koleksi
            </div>
            <h1 style={{ fontSize: 48, fontWeight: 900, margin: "0 0 12px", letterSpacing: -1 }}>
              Semua <span style={{ color: "#e2001a" }}>Series</span>
            </h1>
            <p style={{ color: "#aaa", fontSize: 16, margin: 0 }}>Klik series untuk melihat koleksinya</p>
          </motion.div>
        </section>

        {/* SERIES ACCORDION */}
        <section style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px 80px" }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{ background: "#111", borderRadius: 16, height: 80, opacity: 0.5 }} />
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {series.map((s, i) => {
                const color = SERIES_COLORS[i % SERIES_COLORS.length]
                const isOpen = activeId === s.id
                const produk = produkBySeries[s.id] || []
                const isLoadingProduk = loadingProduk[s.id]

                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.08 }}
                    style={{
                      background: "#111",
                      border: `1px solid ${isOpen ? color.border : "#1a1a1a"}`,
                      borderRadius: 16,
                      overflow: "hidden",
                      boxShadow: isOpen ? `0 0 20px ${color.glow}` : "none",
                      transition: "border-color 0.3s, box-shadow 0.3s",
                    }}
                  >
                    {/* HEADER */}
                    <div
                      onClick={() => handleToggle(s.id)}
                      style={{
                        display: "flex", alignItems: "center",
                        gap: 16, padding: "20px 24px",
                        cursor: "pointer", userSelect: "none",
                      }}
                    >
                      {/* ICON */}
                      <div style={{
                        width: 52, height: 52, borderRadius: 12,
                        background: color.bg, border: `1px solid ${color.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        {s.cover_img ? (
                          <img src={s.cover_img} alt={s.nama} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }} />
                        ) : (
                          <FaLayerGroup size={22} color={color.accent} />
                        )}
                      </div>

                      {/* INFO */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                          <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>{s.nama}</h3>
                          {s.tahun && (
                            <span style={{ fontSize: 11, color: "#555", background: "#1a1a1a", padding: "2px 8px", borderRadius: 10 }}>{s.tahun}</span>
                          )}
                        </div>
                        {s.deskripsi && (
                          <p style={{ color: "#555", fontSize: 13, margin: 0 }}>{s.deskripsi}</p>
                        )}
                      </div>

                      {/* COUNT + CHEVRON */}
                      <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: color.accent }}>
                          {s._count.produk} Produk
                        </span>
                        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                          <FaChevronDown size={14} color="#555" />
                        </motion.div>
                      </div>
                    </div>

                    {/* PRODUK EXPAND */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ overflow: "hidden" }}
                        >
                          <div style={{ borderTop: `1px solid #1a1a1a`, padding: "20px 24px 24px" }}>
                            {isLoadingProduk ? (
                              <div style={{ textAlign: "center", padding: 32, color: "#555" }}>Memuat produk...</div>
                            ) : produk.length === 0 ? (
                              <div style={{ textAlign: "center", padding: 32, color: "#555" }}>Belum ada produk</div>
                            ) : (
                              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
                                {produk.map((p, pi) => (
                                  <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: pi * 0.04 }}
                                    style={{
                                      background: "#1a1a1a", border: "1px solid #222",
                                      borderRadius: 12, overflow: "hidden",
                                      transition: "border-color 0.2s, transform 0.2s",
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = color.border; e.currentTarget.style.transform = "translateY(-3px)" }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#222"; e.currentTarget.style.transform = "translateY(0)" }}
                                  >
                                    {/* GAMBAR */}
                                    <div
                                      onClick={() => router.push(`/produk/${p.id}`)}
                                      style={{ height: 130, background: "#222", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", cursor: "pointer" }}
                                    >
                                      {p.gambar?.[0]?.url ? (
                                        <img src={p.gambar[0].url} alt={p.nama} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }} />
                                      ) : (
                                        <span style={{ fontSize: 36, opacity: 0.2 }}>🚗</span>
                                      )}
                                    </div>

                                    {/* INFO */}
                                    <div style={{ padding: "10px 12px" }}>
                                      <p
                                        onClick={() => router.push(`/produk/${p.id}`)}
                                        style={{ fontSize: 12, fontWeight: 700, margin: "0 0 2px", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", cursor: "pointer" }}
                                      >
                                        {p.nama}
                                      </p>
                                      <p style={{ fontSize: 11, color: "#555", margin: "0 0 8px" }}>{p.nomor_seri} · {p.warna}</p>
                                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ fontSize: 13, fontWeight: 800, color: color.accent }}>
                                          Rp {Number(p.harga).toLocaleString("id-ID")}
                                        </span>
                                        <button
                                          onClick={() => handleWA(p)}
                                          style={{
                                            width: 28, height: 28, borderRadius: "50%",
                                            background: "rgba(37,211,102,0.1)",
                                            border: "1px solid rgba(37,211,102,0.3)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            cursor: "pointer", color: "#25d366",
                                          }}
                                          onMouseEnter={e => e.currentTarget.style.background = "rgba(37,211,102,0.25)"}
                                          onMouseLeave={e => e.currentTarget.style.background = "rgba(37,211,102,0.1)"}
                                        >
                                          <FaWhatsapp size={13} />
                                        </button>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          )}
        </section>

      </main>

      <Footer />
    </div>
  )
}
