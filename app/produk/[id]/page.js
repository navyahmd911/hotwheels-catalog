"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { FaWhatsapp, FaArrowLeft, FaTag, FaBoxOpen } from "react-icons/fa"

export default function DetailProduk() {
  const { id } = useParams()
  const router = useRouter()
  const [produk, setProduk] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    if (!id) return
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/produk/${id}`)
        const data = await res.json()
        setProduk(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [id])

  const handleWA = () => {
    const nomor = process.env.NEXT_PUBLIC_ADMIN_WA
    const pesan = encodeURIComponent(
      `Halo, saya tertarik dengan produk:\n\n*${produk.nama}*\nNomor Seri: ${produk.nomor_seri || "-"}\nWarna: ${produk.warna || "-"}\nHarga: Rp ${Number(produk.harga).toLocaleString("id-ID")}\n\nApakah masih tersedia?`
    )
    window.open(`https://wa.me/${nomor}?text=${pesan}`, "_blank")
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #1a1a1a", borderTop: "3px solid #e2001a", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: "#555", fontSize: 14 }}>Memuat produk...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )

  if (!produk) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#555" }}>Produk tidak ditemukan.</p>
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, maxWidth: 1000, margin: "0 auto", width: "100%", padding: "40px 20px" }}>

        {/* BACK */}
        <button
          onClick={() => router.back()}
          style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 14, marginBottom: 32, padding: 0 }}
          onMouseEnter={e => e.currentTarget.style.color = "#fff"}
          onMouseLeave={e => e.currentTarget.style.color = "#666"}
        >
          <FaArrowLeft size={12} /> Kembali ke Katalog
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>

          {/* KIRI — GAMBAR */}
          <div>
            {/* GAMBAR UTAMA */}
            <div style={{
              background: "#111",
              border: "1px solid #222",
              borderRadius: 16,
              overflow: "hidden",
              height: 320,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
              position: "relative"
            }}>
              {produk.gambar?.length > 0 && produk.gambar[activeImg]?.url ? (
                <img
                  src={produk.gambar[activeImg].url}
                  alt={produk.nama}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div style={{ textAlign: "center", opacity: 0.2 }}>
                  <div style={{ fontSize: 72 }}>🚗</div>
                  <p style={{ fontSize: 12 }}>No Image</p>
                </div>
              )}

              {/* BADGE SERIES */}
              {produk.series && (
                <div style={{
                  position: "absolute", top: 14, right: 14,
                  background: "rgba(0,0,0,0.75)",
                  border: "1px solid #333",
                  borderRadius: 8, padding: "4px 10px",
                  fontSize: 11, color: "#aaa"
                }}>
                  {produk.series.nama}
                </div>
              )}
            </div>

            {/* THUMBNAIL */}
            {produk.gambar?.length > 1 && (
              <div style={{ display: "flex", gap: 8 }}>
                {produk.gambar.map((g, i) => (
                  <div
                    key={g.id}
                    onClick={() => setActiveImg(i)}
                    style={{
                      width: 60, height: 60,
                      borderRadius: 8, overflow: "hidden",
                      border: `2px solid ${activeImg === i ? "#e2001a" : "#222"}`,
                      cursor: "pointer",
                      transition: "border-color 0.2s"
                    }}
                  >
                    <img src={g.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* KANAN — INFO */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

            {/* NAMA */}
            <h1 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 6px", lineHeight: 1.2 }}>
              {produk.nama}
            </h1>

            {/* NOMOR SERI */}
            <p style={{ color: "#555", fontSize: 13, margin: "0 0 20px" }}>
              {produk.nomor_seri} · {produk.warna} · {produk.skala}
            </p>

            {/* HARGA */}
            <div style={{
              background: "rgba(226,0,26,0.06)",
              border: "1px solid rgba(226,0,26,0.15)",
              borderRadius: 12, padding: "14px 18px",
              marginBottom: 20
            }}>
              <p style={{ fontSize: 11, color: "#e2001a", letterSpacing: 1, textTransform: "uppercase", margin: "0 0 4px" }}>Harga</p>
              <p style={{ fontSize: 32, fontWeight: 900, color: "#e2001a", margin: 0 }}>
                Rp {Number(produk.harga).toLocaleString("id-ID")}
              </p>
            </div>

            {/* DETAIL */}
            <div style={{
              background: "#111", border: "1px solid #1a1a1a",
              borderRadius: 12, padding: "14px 18px", marginBottom: 20
            }}>
              {[
                { label: "Skala", value: produk.skala },
                { label: "Warna", value: produk.warna },
                { label: "Negara Asal", value: produk.negara_asal },
                { label: "Series", value: produk.series?.nama },
              ].map(item => item.value && (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #1a1a1a" }}>
                  <span style={{ color: "#555", fontSize: 13 }}>{item.label}</span>
                  <span style={{ color: "#ccc", fontSize: 13, fontWeight: 500 }}>{item.value}</span>
                </div>
              ))}

              {/* STOK */}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                <span style={{ color: "#555", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                  <FaBoxOpen size={11} /> Stok
                </span>
                <span style={{
                  fontSize: 13, fontWeight: 700,
                  color: (produk.stok ?? 0) > 0 ? "#22c55e" : "#555"
                }}>
                  {(produk.stok ?? 0) > 0 ? `${produk.stok} tersedia` : "Habis"}
                </span>
              </div>
            </div>

            {/* TAGS */}
            {produk.tags?.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
                {produk.tags.map(t => (
                  <span key={t.tag.id} style={{
                    display: "flex", alignItems: "center", gap: 4,
                    padding: "4px 10px", borderRadius: 20,
                    background: "#1a1a1a", border: "1px solid #2a2a2a",
                    color: "#777", fontSize: 11
                  }}>
                    <FaTag size={9} /> {t.tag.nama}
                  </span>
                ))}
              </div>
            )}

            {/* DESKRIPSI */}
            {produk.deskripsi && (
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontSize: 11, color: "#555", letterSpacing: 1, textTransform: "uppercase", margin: "0 0 8px" }}>Deskripsi</p>
                <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  {produk.deskripsi}
                </p>
              </div>
            )}

            {/* TOMBOL WA */}
            <button
              onClick={handleWA}
              disabled={(produk.stok ?? 0) === 0}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 10, padding: "14px 0",
                background: (produk.stok ?? 0) > 0 ? "#25d366" : "#1a1a1a",
                border: "none", borderRadius: 12,
                color: (produk.stok ?? 0) > 0 ? "#fff" : "#444",
                fontSize: 15, fontWeight: 700,
                cursor: (produk.stok ?? 0) > 0 ? "pointer" : "not-allowed",
                boxShadow: (produk.stok ?? 0) > 0 ? "0 0 20px rgba(37,211,102,0.3)" : "none",
                transition: "all 0.2s",
                marginTop: "auto"
              }}
              onMouseEnter={e => { if ((produk.stok ?? 0) > 0) e.currentTarget.style.boxShadow = "0 0 30px rgba(37,211,102,0.5)" }}
              onMouseLeave={e => { if ((produk.stok ?? 0) > 0) e.currentTarget.style.boxShadow = "0 0 20px rgba(37,211,102,0.3)" }}
            >
              <FaWhatsapp size={20} />
              {(produk.stok ?? 0) > 0 ? "Hubungi via WhatsApp" : "Stok Habis"}
            </button>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
