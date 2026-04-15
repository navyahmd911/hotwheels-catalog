"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FaPlus, FaEdit, FaTrash, FaUpload, FaSignOutAlt, FaBox, FaTags, FaLayerGroup } from "react-icons/fa"
import Navbar from "@/components/Navbar"

const SERIES = [
  { id: 1, nama: "Speed Machines" },
  { id: 2, nama: "Fast & Furious" },
  { id: 3, nama: "Treasure Hunt" },
  { id: 4, nama: "Car Culture" },
]

const TAGS_LIST = ["limited edition", "JDM", "muscle car", "super treasure hunt", "premium", "baru", "diskon"]

const emptyForm = {
  nama: "", nomor_seri: "", warna: "", skala: "1:64",
  negara_asal: "", harga: "", stok: "", deskripsi: "",
  series_id: "", tags: [], gambar: null
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [view, setView] = useState("dashboard")
  const [produkList, setProdukList] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitMsg, setSubmitMsg] = useState("")
  const [imagePreview, setImagePreview] = useState(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("adminLoggedIn")
    if (!loggedIn) {
      router.push("/")
    } else {
      setIsLoggedIn(true)
      fetchProduk()
    }
  }, [])

  const fetchProduk = async () => {
    setLoading(true)
    const res = await fetch("/api/produk")
    const data = await res.json()
    setProdukList(data)
    setLoading(false)
  }

  const handleLogout = () => {
    sessionStorage.removeItem("adminLoggedIn")
    router.push("/")
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setForm(prev => ({ ...prev, gambar: file }))
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async () => {
    if (!form.nama) return setSubmitMsg("Nama produk wajib diisi!")
    setSubmitLoading(true)
    setSubmitMsg("")
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (k === "tags") formData.append("tags", JSON.stringify(v))
        else if (k === "gambar" && v) formData.append("gambar", v)
        else if (v !== "" && v !== null) formData.append(k, v)
      })

      const url = editId ? `/api/admin/produk/${editId}` : "/api/admin/produk"
      const method = editId ? "PUT" : "POST"
      const res = await fetch(url, { method, body: formData })
      const data = await res.json()

      if (res.ok) {
        setSubmitMsg(editId ? "✅ Produk berhasil diupdate!" : "✅ Produk berhasil ditambah!")
        setForm(emptyForm)
        setImagePreview(null)
        setEditId(null)
        setView("dashboard")
        fetchProduk()
      } else {
        setSubmitMsg(data.error || "Gagal menyimpan")
      }
    } catch {
      setSubmitMsg("Terjadi kesalahan")
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleEdit = (p) => {
    setForm({
      nama: p.nama || "",
      nomor_seri: p.nomor_seri || "",
      warna: p.warna || "",
      skala: p.skala || "1:64",
      negara_asal: p.negara_asal || "",
      harga: p.harga || "",
      stok: p.stok || "",
      deskripsi: p.deskripsi || "",
      series_id: p.series_id || "",
      tags: p.tags?.map(t => t.tag.nama) || [],
      gambar: null,
    })
    setEditId(p.id)
    setImagePreview(p.gambar?.[0]?.url || null)
    setView("form")
    setSubmitMsg("")
  }

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus produk ini?")) return
    await fetch(`/api/admin/produk/${id}`, { method: "DELETE" })
    fetchProduk()
  }

  const filteredProduk = produkList.filter(p =>
    p.nama.toLowerCase().includes(search.toLowerCase())
  )

  const inputStyle = {
    width: "100%", padding: "10px 14px",
    background: "#1a1a1a", border: "1px solid #2a2a2a",
    borderRadius: 8, color: "#fff", fontSize: 14,
    outline: "none", boxSizing: "border-box",
  }

  const labelStyle = {
    fontSize: 12, color: "#666",
    display: "block", marginBottom: 6
  }

  if (!isLoggedIn) return null

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff" }}>
      <Navbar />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px" }}>

        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <p style={{ fontSize: 11, color: "#e2001a", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 4px" }}>Admin Panel</p>
            <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0 }}>
              {view === "dashboard" ? "Dashboard" : editId ? "Edit Produk" : "Tambah Produk"}
            </h1>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {view !== "dashboard" && (
              <button
                onClick={() => { setView("dashboard"); setSubmitMsg(""); setForm(emptyForm); setEditId(null); setImagePreview(null) }}
                style={{ padding: "10px 18px", background: "transparent", border: "1px solid #333", borderRadius: 8, color: "#aaa", cursor: "pointer", fontSize: 14 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#fff"; e.currentTarget.style.color = "#fff" }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#aaa" }}
              >
                ← Kembali
              </button>
            )}
            {view === "dashboard" && (
              <button
                onClick={() => { setForm(emptyForm); setEditId(null); setImagePreview(null); setSubmitMsg(""); setView("form") }}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "#e2001a", border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 0 16px rgba(226,0,26,0.3)" }}
              >
                <FaPlus size={12} /> Tambah Produk
              </button>
            )}
            <button
              onClick={handleLogout}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "transparent", border: "1px solid #333", borderRadius: 8, color: "#666", cursor: "pointer", fontSize: 14 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#e2001a"; e.currentTarget.style.color = "#e2001a" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#666" }}
            >
              <FaSignOutAlt size={13} /> Logout
            </button>
          </div>
        </div>

        {/* STATS */}
        {view === "dashboard" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
            {[
              { icon: <FaBox />, label: "Total Produk", value: produkList.length },
              { icon: <FaLayerGroup />, label: "Total Series", value: SERIES.length },
              { icon: <FaTags />, label: "Total Tags", value: TAGS_LIST.length },
            ].map(s => (
              <div key={s.label} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(226,0,26,0.1)", border: "1px solid rgba(226,0,26,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#e2001a", fontSize: 18 }}>
                  {s.icon}
                </div>
                <div>
                  <p style={{ color: "#555", fontSize: 12, margin: "0 0 2px" }}>{s.label}</p>
                  <p style={{ color: "#fff", fontSize: 24, fontWeight: 800, margin: 0 }}>{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== DASHBOARD ===== */}
        {view === "dashboard" && (
          <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 16, overflow: "hidden" }}>
            {/* SEARCH */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #1a1a1a" }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari produk..."
                style={{ ...inputStyle, maxWidth: 300 }}
              />
            </div>

            {/* TABLE */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
                    {["Produk", "Series", "Harga", "Stok", "Tags", "Aksi"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: "#555", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#555" }}>Memuat...</td>
                    </tr>
                  ) : filteredProduk.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#555" }}>Tidak ada produk</td>
                    </tr>
                  ) : filteredProduk.map(p => (
                    <tr key={p.id} style={{ borderBottom: "1px solid #111" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#161616"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      {/* PRODUK */}
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 100, height: 100, borderRadius: 10, background: "#1a1a1a", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {p.gambar?.[0]?.url ? (
                              <img src={p.gambar[0].url} alt={p.nama} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }} />
                            ) : <span style={{ fontSize: 28 }}>🚗</span>}
                          </div>
                          <div>
                            <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: 0 }}>{p.nama}</p>
                            <p style={{ color: "#555", fontSize: 11, margin: 0 }}>{p.nomor_seri}</p>
                          </div>
                        </div>
                      </td>
                      {/* SERIES */}
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: 12, color: "#aaa" }}>{p.series?.nama || "-"}</span>
                      </td>
                      {/* HARGA */}
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#e2001a" }}>Rp {Number(p.harga).toLocaleString("id-ID")}</span>
                      </td>
                      {/* STOK */}
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: (p.stok ?? 0) > 0 ? "#22c55e" : "#555" }}>{p.stok ?? 0}</span>
                      </td>
                      {/* TAGS */}
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {p.tags?.slice(0, 2).map(t => (
                            <span key={t.tag.id} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "#1a1a1a", color: "#666", border: "1px solid #2a2a2a" }}>{t.tag.nama}</span>
                          ))}
                          {p.tags?.length > 2 && <span style={{ fontSize: 10, color: "#555" }}>+{p.tags.length - 2}</span>}
                        </div>
                      </td>
                      {/* AKSI */}
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => handleEdit(p)} style={{ padding: "6px 10px", background: "transparent", border: "1px solid #2a2a2a", borderRadius: 6, color: "#aaa", cursor: "pointer" }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = "#e2001a"; e.currentTarget.style.color = "#e2001a" }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.color = "#aaa" }}
                          >
                            <FaEdit size={12} />
                          </button>
                          <button onClick={() => handleDelete(p.id)} style={{ padding: "6px 10px", background: "transparent", border: "1px solid #2a2a2a", borderRadius: 6, color: "#aaa", cursor: "pointer" }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = "#e2001a"; e.currentTarget.style.color = "#e2001a" }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.color = "#aaa" }}
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== FORM TAMBAH/EDIT ===== */}
        {view === "form" && (
          <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 16, padding: 32 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Nama Produk *</label>
                <input value={form.nama} onChange={e => setForm(p => ({ ...p, nama: e.target.value }))} placeholder="Lamborghini Huracán" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Nomor Seri</label>
                <input value={form.nomor_seri} onChange={e => setForm(p => ({ ...p, nomor_seri: e.target.value }))} placeholder="HW-001" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Warna</label>
                <input value={form.warna} onChange={e => setForm(p => ({ ...p, warna: e.target.value }))} placeholder="Merah" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Harga (Rp)</label>
                <input type="number" value={form.harga} onChange={e => setForm(p => ({ ...p, harga: e.target.value }))} placeholder="25000" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Stok</label>
                <input type="number" value={form.stok} onChange={e => setForm(p => ({ ...p, stok: e.target.value }))} placeholder="10" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Skala</label>
                <input value={form.skala} onChange={e => setForm(p => ({ ...p, skala: e.target.value }))} placeholder="1:64" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Negara Asal</label>
                <input value={form.negara_asal} onChange={e => setForm(p => ({ ...p, negara_asal: e.target.value }))} placeholder="Malaysia" style={inputStyle} />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Series</label>
                <select value={form.series_id} onChange={e => setForm(p => ({ ...p, series_id: e.target.value }))} style={{ ...inputStyle, appearance: "none" }}>
                  <option value="">-- Pilih Series --</option>
                  {SERIES.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}
                </select>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Tags</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {TAGS_LIST.map(t => (
                    <button key={t} type="button"
                      onClick={() => setForm(p => ({ ...p, tags: p.tags.includes(t) ? p.tags.filter(x => x !== t) : [...p.tags, t] }))}
                      style={{ padding: "6px 14px", borderRadius: 20, border: "1px solid", borderColor: form.tags.includes(t) ? "#e2001a" : "#2a2a2a", background: form.tags.includes(t) ? "rgba(226,0,26,0.15)" : "transparent", color: form.tags.includes(t) ? "#e2001a" : "#666", fontSize: 12, cursor: "pointer" }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Deskripsi</label>
                <textarea value={form.deskripsi} onChange={e => setForm(p => ({ ...p, deskripsi: e.target.value }))} placeholder="Deskripsi produk..." rows={4} style={{ ...inputStyle, resize: "vertical" }} />
              </div>

              {/* UPLOAD GAMBAR */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Gambar</label>
                <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, border: "2px dashed #2a2a2a", borderRadius: 12, cursor: "pointer", background: "#1a1a1a", gap: 10, transition: "border-color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#e2001a"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2a2a"}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" style={{ height: 140, objectFit: "contain", borderRadius: 8 }} />
                  ) : (
                    <>
                      <FaUpload size={24} color="#333" />
                      <span style={{ fontSize: 13, color: "#555" }}>Klik untuk upload gambar</span>
                      <span style={{ fontSize: 11, color: "#333" }}>PNG, JPG, WEBP</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                </label>
              </div>

            </div>

            {submitMsg && (
              <div style={{ marginTop: 16, padding: "10px 16px", borderRadius: 8, background: submitMsg.includes("✅") ? "rgba(34,197,94,0.08)" : "rgba(226,0,26,0.08)", border: `1px solid ${submitMsg.includes("✅") ? "rgba(34,197,94,0.2)" : "rgba(226,0,26,0.2)"}`, color: submitMsg.includes("✅") ? "#22c55e" : "#e2001a", fontSize: 13 }}>
                {submitMsg}
              </div>
            )}

            <button onClick={handleSubmit} disabled={submitLoading} style={{ marginTop: 20, width: "100%", padding: "14px 0", background: submitLoading ? "#1a1a1a" : "#e2001a", border: "none", borderRadius: 10, color: submitLoading ? "#555" : "#fff", fontWeight: 700, fontSize: 15, cursor: submitLoading ? "not-allowed" : "pointer", boxShadow: submitLoading ? "none" : "0 0 20px rgba(226,0,26,0.3)" }}>
              {submitLoading ? "Menyimpan..." : editId ? "Update Produk" : "Simpan Produk"}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
