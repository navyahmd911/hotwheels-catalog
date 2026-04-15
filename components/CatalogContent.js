"use client"
import { motion, AnimatePresence } from "framer-motion"
import Image from 'next/image'
import { useRouter } from "next/navigation"

import { useEffect, useState } from "react"
export default function CatalogContent({
  produk, loading,
  SERIES, TAGS,
  activeSeries, setActiveSeries,
  activeTag, setActiveTag,
  setSearch, setQuery, query
}) {
const [cols, setCols] = useState(3)
const [isMobile, setIsMobile] = useState(false)
const router = useRouter()

useEffect(() => {
  const updateLayout = () => {
    const w = window.innerWidth

    if (w < 640) {
      setCols(1)
      setIsMobile(true)
    } else if (w < 1024) {
      setCols(2)
      setIsMobile(false)
    } else if (w < 1400) {
      setCols(3)
      setIsMobile(false)
    } else {
      setCols(4)
      setIsMobile(false)
    }
  }

  updateLayout()
  window.addEventListener("resize", updateLayout)
  return () => window.removeEventListener("resize", updateLayout)
}, [])
  return (
  <div style={{ 
  display: 'flex', 
  padding: '32px 16px',
  gap: 28,
  width: '100%'
}}>

    {/* SIDEBAR */}
    {!isMobile && (
  <aside style={{ width: 220, flexShrink: 0 }}>
  <div style={{
    backgroundImage: 'url(/sidebar-bg.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center top',
    border: '1px solid #333',
    borderRadius: 12,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 400
  }}>

    {/* OVERLAY GELAP */}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(0,0,0,0.75)',
      borderRadius: 12
    }} />

    {/* KONTEN SIDEBAR — di atas overlay */}
    <div style={{ position: 'relative', zIndex: 1 }}>

      {/* JUDUL SERIES STYLISH */}
      <p style={{
        fontSize: 18,
        fontWeight: 900,
        color: '#e2001a',
        letterSpacing: 3,
        textTransform: 'uppercase',
        fontStyle: 'italic',
        textShadow: '0 0 12px rgba(226,0,26,0.6)',
        margin: '0 0 12px'
      }}>
        Series
      </p>

      {SERIES.map(s => (
        <button
          key={s.id}
          onClick={() => setActiveSeries(s.id)}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'left',
            padding: '8px 12px',
            borderRadius: 8,
            border: 'none',
            background: activeSeries === s.id ? '#e2001a' : 'transparent',
            color: activeSeries === s.id ? '#fff' : '#aaa',
            fontSize: 13,
            fontWeight: activeSeries === s.id ? 700 : 400,
            fontStyle: activeSeries === s.id ? 'normal' : 'italic',
            cursor: 'pointer',
            marginBottom: 2,
            boxShadow: activeSeries === s.id ? '0 0 8px rgba(226,0,26,0.5)' : 'none'
          }}
        >
          {s.nama}
        </button>
      ))}

      <div style={{ height: 1, background: '#444', margin: '16px 0' }} />

      <p style={{ fontSize: 11, fontWeight: 700, color: '#666', margin: '0 0 12px', letterSpacing: 1 }}>
        Tag
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {TAGS.map(t => (
          <button
            key={t}
            onClick={() => setActiveTag(activeTag === t ? null : t)}
            style={{
              padding: '4px 10px',
              borderRadius: 20,
              border: '1px solid',
              borderColor: activeTag === t ? '#e2001a' : '#444',
              background: activeTag === t ? 'rgba(226,0,26,0.2)' : 'rgba(0,0,0,0.4)',
              color: activeTag === t ? '#e2001a' : '#777',
              fontSize: 11,
              cursor: 'pointer'
            }}
          >
            {t}
          </button>
        ))}
      </div>
    </div>

  </div>
</aside>
    )}

    {/* GRID */}
    <div style={{ flex: 1, width: '100%', maxWidth: 1200 }}>
      {/* TIDAK DIUBAH */}

        <div style={{ marginBottom: 20 }}>
          <p style={{ color: '#555', fontSize: 13 }}>
            {loading ? 'Memuat...' : `${produk.length} `}
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ background: '#111', borderRadius: 12, height: 280, animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : (
<motion.div
  layout
  style={{
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: 20
  }}
>
  <AnimatePresence>
    {produk.map((p, i) => (
      <motion.div
        key={p.id}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, delay: i * 0.05 }}
        whileHover={{ y: -4 }}
        onClick={() => router.push(`/produk/${p.id}`)}
style={{
  background: '#111',
  border: '1px solid #222',
  borderRadius: 12,
  overflow: 'hidden',
  cursor: 'pointer'
}}
      >

{/* GAMBAR */}
<div style={{
  height: 180,
  background: '#1a1a1a',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden'
}}>
  {p.gambar?.[0]?.url ? (
    <img
      src={p.gambar[0].url}
      alt={p.nama}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
      onError={(e) => {
        e.currentTarget.style.display = 'none'
      }}
    />
  ) : (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      opacity: 0.2
    }}>
      <div style={{ fontSize: 48 }}>🚗</div>
      <span style={{ fontSize: 10 }}>No Image</span>
    </div>
  )}

  {p.series && (
    <div style={{
      position: 'absolute',
      top: 10,
      right: 10,
      background: 'rgba(0,0,0,0.7)',
      border: '1px solid #333',
      borderRadius: 6,
      padding: '3px 8px',
      fontSize: 10,
      color: '#aaa'
    }}>
      {p.series.nama}
    </div>
  )}
</div>

        {/* INFO */}
        <div style={{ padding: '14px 16px' }}>
  <p style={{
    fontSize: 13,
    fontWeight: 600,
    margin: '0 0 4px',
    color: '#fff'
  }}>
    {p.nama}
  </p>

  <p style={{ fontSize: 11, color: '#555', margin: '0 0 10px' }}>
    {p.nomor_seri} · {p.warna} · {p.skala}
  </p>

  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <span style={{ fontSize: 16, fontWeight: 800, color: '#e2001a' }}>
      Rp {Number(p.harga).toLocaleString('id-ID')}
    </span>
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
  {p.tags?.map(t => (
    <span
      key={t.tag.id}
      style={{
        fontSize: 10,
        padding: '2px 6px',
        borderRadius: 6,
        background: '#222',
        color: '#aaa'
      }}
    >
      {t.tag.nama}
    </span>
  ))}
</div>

    {/* 🔥 INI BAGIAN STOK */}
  <span style={{
  fontSize: 11,
  fontWeight: 500,
  color: (p.stok ?? 0) > 0 ? '#22c55e' : '#555',
  opacity: (p.stok ?? 0) > 0 ? 1 : 0.6
}}>
  Stok: {p.stok ?? 0}
</span>
  </div>
</div>

      </motion.div>
    ))}
  </AnimatePresence>
</motion.div>
        )}
      </div>
    </div>
  )
}