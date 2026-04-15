import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

export default function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        marginTop: "auto",
        background: "#0a0a0a",
        overflow: "visible",
      }}
    >
{/* LOGO TENGAH */}
<div
  style={{
    position: "absolute",
    top: -100,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 10,
  }}
>
  <img
    src="/hw-logo.png"
    alt="Hot Wheels"
    style={{
      width: 320,
      height: "auto",
      display: "block",
      filter:
        "drop-shadow(0 0 24px rgba(226,0,26,0.8)) drop-shadow(0 0 50px rgba(226,0,26,0.4))",
    }}
  />
</div>



      {/* FOOTER UTAMA */}
      <div
        style={{
          position: "relative",
          minHeight: 130,
          backgroundImage: "url(/footer-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderTop: "2px solid rgba(226,0,26,0.7)",
          boxShadow: "0 -2px 20px rgba(226,0,26,0.3)",
          overflow: "hidden",
          padding: "55px 40px 35px",
          boxSizing: "border-box",
        }}
      >
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 1,
          }}
        />

        {/* Konten */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          {/* Kiri */}
          <div
            style={{
              display: "flex",
              gap: 30,
              fontSize: 14,
              color: "#bbb",
            }}
          >
            {["Layanan Pelanggan", "Tentang Kami", "Kontak"].map((item) => (
              <span
                key={item}
                style={{
                  cursor: "pointer",
                  transition: "0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#fff"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#bbb"
                }}
              >
                {item}
              </span>
            ))}
          </div>

          {/* Kanan */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { icon: <FaInstagram size={15} />, label: "Instagram" },
                { icon: <FaXTwitter size={15} />, label: "X" },
                { icon: <FaFacebook size={15} />, label: "Facebook" },
                { icon: <FaYoutube size={15} />, label: "YouTube" },
              ].map((s) => (
                <div
                  key={s.label}
                  title={s.label}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    border: "1px solid #444",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#aaa",
                    background: "rgba(20,20,20,0.7)",
                    transition: "0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#e2001a"
                    e.currentTarget.style.color = "#fff"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#444"
                    e.currentTarget.style.color = "#aaa"
                  }}
                >
                  {s.icon}
                </div>
              ))}
            </div>

            <p
              style={{
                color: "#666",
                fontSize: 12,
                margin: 0,
              }}
            >
              © 2026 HotWheels Catalog
            </p>
          </div>
        </div>
      </div>

      {/* Penutup gap bawah */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "4px",
          background: "#0a0a0a",
          zIndex: 99,
        }}
      />
    </footer>
  )
}

