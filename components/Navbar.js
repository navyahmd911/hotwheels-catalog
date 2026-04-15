"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { FaUser, FaTimes, FaEye, FaEyeSlash, FaPlus, FaEdit, FaTrash, FaUpload, FaSignOutAlt } from "react-icons/fa"

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

export default function Navbar() {
  const [showModal, setShowModal] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Dashboard state
  const [view, setView] = useState("dashboard") // dashboard | tambah | edit
  const [produkList, setProdukList] = useState([])
  const [loadingProduk, setLoadingProduk] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitMsg, setSubmitMsg] = useState("")
  const [imagePreview, setImagePreview] = useState(null)

  const fetchProduk = async () => {
    setLoadingProduk(true)
    const res = await fetch("/api/produk")
    const data = await res.json()
    setProdukList(data)
    setLoadingProduk(false)
  }

  const handleLogin = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError("")
  try {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
    const data = await res.json()
    if (data.success) {
      sessionStorage.setItem("adminLoggedIn", "true")  // ← ini penting
      setShowModal(false)
      setUsername("")
      setPassword("")
      router.push("/admin")  // ← ini yang redirect ke dashboard
    } else {
      setError(data.message || "Login gagal")
    }
  } catch {
    setError("Terjadi kesalahan, coba lagi")
  } finally {
    setLoading(false)
  }
}

  const handleLogout = () => {
    setIsLoggedIn(false)
    setShowModal(false)
    setView("dashboard")
    setProdukList([])
    setForm(emptyForm)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setForm(prev => ({ ...prev, gambar: file }))
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async () => {
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
        setSubmitMsg(editId ? "Produk berhasil diupdate!" : "Produk berhasil ditambah!")
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
    setView("tambah")
    setSubmitMsg("")
  }

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus produk ini?")) return
    await fetch(`/api/admin/produk/${id}`, { method: "DELETE" })
    fetchProduk()
  }

  const inputStyle = {
    width: "100%", padding: "9px 12px",
    background: "#1a1a1a", border: "1px solid #2a2a2a",
    borderRadius: 8, color: "#fff", fontSize: 13,
    outline: "none", boxSizing: "border-box",
  }

  const labelStyle = {
    fontSize: 11, color: "#666",
    display: "block", marginBottom: 5
  }

  return (
    <>
      <nav style={{ position: "sticky", top: 0, zIndex: 50, height: 64, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/footer-bg.jpg)", backgroundSize: "cover", backgroundPosition: "center", zIndex: 0 }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)", zIndex: 1 }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "linear-gradient(to right, transparent, #e2001a 20%, #ff3333 50%, #e2001a 80%, transparent)", boxShadow: "0 0 12px 3px rgba(226,0,26,0.6)", zIndex: 2 }} />

        <div style={{ position: "relative", zIndex: 3, height: "100%", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", cursor: "pointer", marginLeft: -40 }}>
            <img src="/logo-full.png" alt="Hot Wheels" style={{ width: 170, height: "auto", objectFit: "contain", filter: "brightness(1.5) contrast(1.2) saturate(1.3) drop-shadow(0 0 10px rgba(255,0,0,0.5))" }} />
          </div>

          <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.05)", border: "1px solid #444", borderRadius: 30, padding: "4px 6px" }}>
            {[
  { label: "Katalog", href: "/" },
  { label: "Series", href: "/series" },
  { label: "Tentang", href: "/tentang" },
].map(item => (
  <span
    key={item.label}
    onClick={() => router.push(item.href)}
    style={{
      padding: "6px 18px", borderRadius: 30,
      fontSize: 14,
      fontWeight: pathname === item.href ? 700 : 400,
      color: pathname === item.href ? "#fff" : "#aaa",
      background: pathname === item.href ? "#e2001a" : "transparent",
      cursor: "pointer", transition: "all 0.2s",
      boxShadow: pathname === item.href ? "0 0 10px rgba(226,0,26,0.4)" : "none",
    }}
  >
    {item.label}
  </span>
))}
          </div>

          <div onClick={() => setShowModal(true)} style={{ width: 36, height: 36, borderRadius: "50%", background: isLoggedIn ? "rgba(226,0,26,0.2)" : "rgba(20,20,20,0.8)", border: `2px solid ${isLoggedIn ? "#e2001a" : "#555"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: isLoggedIn ? "0 0 10px rgba(226,0,26,0.4)" : "none", transition: "all 0.2s" }}>
            <FaUser size={16} color={isLoggedIn ? "#e2001a" : "#aaa"} />
          </div>
        </div>
      </nav>

      {/* MODAL */}
      {showModal && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}
          style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
        >
          <div style={{ background: "#111", border: "1px solid #222", borderRadius: 16, width: "100%", maxWidth: isLoggedIn ? 700 : 380, maxHeight: "90vh", overflowY: "auto", position: "relative", boxShadow: "0 0 60px rgba(226,0,26,0.1)" }}>

            {/* HEADER MODAL */}
            <div style={{ padding: "20px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #1a1a1a", paddingBottom: 16 }}>
              <div>
                <p style={{ fontSize: 10, color: "#e2001a", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 2px" }}>Admin Panel</p>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: 0 }}>
                  {!isLoggedIn ? "Login" : view === "dashboard" ? "Dashboard" : editId ? "Edit Produk" : "Tambah Produk"}
                </h2>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {isLoggedIn && (
                  <button onClick={handleLogout} title="Logout" style={{ background: "none", border: "1px solid #333", borderRadius: 8, color: "#666", cursor: "pointer", padding: "6px 10px", display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#e2001a"; e.currentTarget.style.color = "#e2001a" }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#666" }}
                  >
                    <FaSignOutAlt size={12} /> Logout
                  </button>
                )}
                <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", padding: 4 }}
                  onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                  onMouseLeave={e => e.currentTarget.style.color = "#555"}
                >
                  <FaTimes size={16} />
                </button>
              </div>
            </div>

            <div style={{ padding: 24 }}>
              {/* ===== FORM LOGIN ===== */}
              {!isLoggedIn && (
                <form onSubmit={handleLogin}>
                  <div style={{ marginBottom: 14 }}>
                    <label style={labelStyle}>Username</label>
                    <input value={username} onChange={e => setUsername(e.target.value)} placeholder="admin" style={inputStyle} />
                  </div>
                  <div style={{ marginBottom: 20, position: "relative" }}>
                    <label style={labelStyle}>Password</label>
                    <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ ...inputStyle, paddingRight: 40 }} />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, bottom: 10, background: "none", border: "none", color: "#555", cursor: "pointer" }}>
                      {showPass ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                    </button>
                  </div>
                  {error && <p style={{ color: "#e2001a", fontSize: 12, marginBottom: 16, padding: "8px 12px", background: "rgba(226,0,26,0.08)", borderRadius: 6, border: "1px solid rgba(226,0,26,0.2)" }}>{error}</p>}
                  <button type="submit" disabled={loading} style={{ width: "100%", padding: "12px 0", background: loading ? "#333" : "#e2001a", border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 0 16px rgba(226,0,26,0.4)" }}>
                    {loading ? "Memuat..." : "Masuk"}
                  </button>
                </form>
              )}

              {/* ===== DASHBOARD ===== */}
              {isLoggedIn && view === "dashboard" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <p style={{ color: "#555", fontSize: 13, margin: 0 }}>{produkList.length} produk terdaftar</p>
                    <button
                      onClick={() => { setForm(emptyForm); setEditId(null); setImagePreview(null); setSubmitMsg(""); setView("tambah") }}
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "#e2001a", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 0 10px rgba(226,0,26,0.3)" }}
                    >
                      <FaPlus size={11} /> Tambah Produk
                    </button>
                  </div>

                  {loadingProduk ? (
                    <div style={{ textAlign: "center", padding: 40, color: "#555" }}>Memuat...</div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {produkList.map(p => (
                        <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#1a1a1a", border: "1px solid #222", borderRadius: 10 }}>
                          {/* THUMB */}
                          <div style={{ width: 44, height: 44, borderRadius: 8, background: "#222", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {p.gambar?.[0]?.url ? (
                              <img src={p.gambar[0].url} alt={p.nama} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                              <span style={{ fontSize: 20 }}>🚗</span>
                            )}
                          </div>
                          {/* INFO */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.nama}</p>
                            <p style={{ color: "#555", fontSize: 11, margin: 0 }}>Rp {Number(p.harga).toLocaleString("id-ID")} · Stok: {p.stok}</p>
                          </div>
                          {/* ACTIONS */}
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => handleEdit(p)} style={{ padding: "6px 10px", background: "transparent", border: "1px solid #333", borderRadius: 6, color: "#aaa", cursor: "pointer", fontSize: 12 }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = "#e2001a"; e.currentTarget.style.color = "#e2001a" }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#aaa" }}
                            >
                              <FaEdit size={12} />
                            </button>
                            <button onClick={() => handleDelete(p.id)} style={{ padding: "6px 10px", background: "transparent", border: "1px solid #333", borderRadius: 6, color: "#aaa", cursor: "pointer", fontSize: 12 }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = "#e2001a"; e.currentTarget.style.color = "#e2001a" }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#aaa" }}
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ===== FORM TAMBAH/EDIT ===== */}
              {isLoggedIn && view === "tambah" && (
                <div>
                  <button onClick={() => { setView("dashboard"); setSubmitMsg("") }} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 13, marginBottom: 20, padding: 0 }}
                    onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                    onMouseLeave={e => e.currentTarget.style.color = "#666"}
                  >
                    ← Kembali
                  </button>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {TAGS_LIST.map(t => (
                          <button key={t} type="button"
                            onClick={() => setForm(p => ({ ...p, tags: p.tags.includes(t) ? p.tags.filter(x => x !== t) : [...p.tags, t] }))}
                            style={{ padding: "4px 10px", borderRadius: 20, border: "1px solid", borderColor: form.tags.includes(t) ? "#e2001a" : "#333", background: form.tags.includes(t) ? "rgba(226,0,26,0.15)" : "transparent", color: form.tags.includes(t) ? "#e2001a" : "#666", fontSize: 11, cursor: "pointer" }}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={labelStyle}>Deskripsi</label>
                      <textarea value={form.deskripsi} onChange={e => setForm(p => ({ ...p, deskripsi: e.target.value }))} placeholder="Deskripsi produk..." rows={3} style={{ ...inputStyle, resize: "vertical" }} />
                    </div>

                    {/* UPLOAD GAMBAR */}
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={labelStyle}>Gambar</label>
                      <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, border: "2px dashed #2a2a2a", borderRadius: 10, cursor: "pointer", background: "#1a1a1a", gap: 8, transition: "border-color 0.2s" }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = "#e2001a"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2a2a"}
                      >
                        {imagePreview ? (
                          <img src={imagePreview} alt="preview" style={{ height: 100, objectFit: "contain", borderRadius: 8 }} />
                        ) : (
                          <>
                            <FaUpload size={20} color="#444" />
                            <span style={{ fontSize: 12, color: "#555" }}>Klik untuk upload gambar</span>
                          </>
                        )}
                        <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                      </label>
                    </div>
                  </div>

                  {submitMsg && (
                    <p style={{ marginTop: 14, fontSize: 12, color: submitMsg.includes("berhasil") ? "#22c55e" : "#e2001a", padding: "8px 12px", background: submitMsg.includes("berhasil") ? "rgba(34,197,94,0.08)" : "rgba(226,0,26,0.08)", borderRadius: 6, border: `1px solid ${submitMsg.includes("berhasil") ? "rgba(34,197,94,0.2)" : "rgba(226,0,26,0.2)"}` }}>
                      {submitMsg}
                    </p>
                  )}

                  <button onClick={handleSubmit} disabled={submitLoading} style={{ marginTop: 16, width: "100%", padding: "12px 0", background: submitLoading ? "#333" : "#e2001a", border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, fontSize: 14, cursor: submitLoading ? "not-allowed" : "pointer", boxShadow: submitLoading ? "none" : "0 0 16px rgba(226,0,26,0.3)" }}>
                    {submitLoading ? "Menyimpan..." : editId ? "Update Produk" : "Simpan Produk"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}