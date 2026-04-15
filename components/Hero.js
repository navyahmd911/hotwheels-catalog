"use client"

import { motion } from "framer-motion"

export default function Hero({ search, setSearch, handleSearch }) {
  return (
    <section
      style={{
        position: "relative",
        height: 420,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        padding: "0 40px",
      }}
    >
      {/* BACKGROUND IMAGE */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/hero-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />

      {/* OVERLAY */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.3) 100%)",
          zIndex: 1,
        }}
      />

      {/* KONTEN KIRI */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            style={{
              display: "inline-block",
              background: "#e2001a",
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: 20,
              letterSpacing: 1,
              marginBottom: 16,
              textTransform: "uppercase",
            }}
          >
            Koleksi Diecast 1:64
          </div>

          <h1
            className="hero-title"
            style={{
              fontSize: 64,
              fontWeight: 900,
              lineHeight: 1,
              margin: "0 0 16px",
              letterSpacing: "-2px",
              textShadow:
                "0 0 30px rgba(226,0,26,0.5), 0 2px 4px rgba(0,0,0,0.8)",
            }}
          >
            Hot
            <span
              style={{
                color: "#e2001a",
                textShadow:
                  "0 0 20px rgba(226,0,26,0.8), 0 0 40px rgba(255,100,0,0.4)",
              }}
            >
              Wheels
            </span>
            <br />
            <span
              className="hero-subtitle"
              style={{
                fontSize: 40,
                fontWeight: 400,
                color: "#aaa",
                textShadow: "none",
              }}
            >
              Catalog
            </span>
          </h1>

          <p
            style={{
              color: "#bbb",
              fontSize: 16,
              maxWidth: 400,
              lineHeight: 1.6,
              textShadow: "0 1px 3px rgba(0,0,0,0.8)",
            }}
          >
            Temukan koleksi diecast Hotwheels terlengkap. Dari Speed Machines
            hingga Super Treasure Hunt.
          </p>
        </motion.div>

        {/* SEARCH */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSearch}
          style={{
            marginTop: 28,
            display: "flex",
            gap: 0,
            maxWidth: 440,
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your cars..."
            style={{
              flex: 1,
              padding: "12px 18px",
              background: "rgba(20,20,20,0.85)",
              border: "1px solid #444",
              borderRight: "none",
              borderRadius: "8px 0 0 8px",
              color: "#fff",
              fontSize: 14,
              outline: "none",
              backdropFilter: "blur(4px)",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "12px 24px",
              background: "#e2001a",
              border: "none",
              borderRadius: "0 8px 8px 0",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              boxShadow: "0 0 12px rgba(226,0,26,0.5)",
            }}
          >
            Cari
          </button>
        </motion.form>
      </div>


{/* HW TEXT GLOW */}
<motion.div
  initial={{ opacity: 0, x: 60 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8, delay: 0.3 }}
  style={{
    position: "absolute",
    right: 80,
    fontSize: 200,
    fontWeight: 900,
    letterSpacing: -10,
    userSelect: "none",
    zIndex: 2,
    color: "transparent",
    WebkitTextStroke: "2px rgba(226,0,26,0.3)",
    textShadow: "0 0 60px rgba(226,0,26,0.2)",
    filter: "drop-shadow(0 0 20px rgba(255,80,0,0.3))",
  }}
>
  RDC
</motion.div>

    </section>
  )
}

