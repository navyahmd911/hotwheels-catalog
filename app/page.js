"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import CatalogContent from "@/components/CatalogContent"
import Footer from "@/components/Footer"

const SERIES = [
  { id: null, nama: "Semua" },
  { id: 1, nama: "Speed Machines" },
  { id: 2, nama: "Fast & Furious" },
  { id: 3, nama: "Treasure Hunt" },
  { id: 4, nama: "Car Culture" },
]

const TAGS = [
  "limited edition",
  "JDM",
  "muscle car",
  "super treasure hunt",
  "premium",
  "baru",
  "diskon",
]

function HomeContent() {
  const searchParams = useSearchParams()
  const [produk, setProduk] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeSeries, setActiveSeries] = useState(null)
  const [activeTag, setActiveTag] = useState(null)
  const [search, setSearch] = useState("")

  // Baca series_id dari URL kalau ada
  useEffect(() => {
    const seriesFromUrl = searchParams.get("series_id")
    if (seriesFromUrl) {
      setActiveSeries(parseInt(seriesFromUrl))
    }
  }, [searchParams])

  useEffect(() => {
    const controller = new AbortController()

    const fetchData = async () => {
      setLoading(true)

      const params = new URLSearchParams()
      if (activeSeries) params.set("series_id", activeSeries)
      if (activeTag !== null) params.set("tag", activeTag)
      if (search) params.set("search", search)

      try {
        const res = await fetch("/api/produk?" + params.toString(), {
          signal: controller.signal,
        })

        if (!res.ok) throw new Error("API error")

        const data = await res.json()
        setProduk(data)
      } catch (err) {
        if (err.name !== "AbortError") console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    return () => controller.abort()
  }, [activeSeries, activeTag, search])

  const handleSearch = (e) => {
    e.preventDefault()
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      fontFamily: "Inter, sans-serif",
      background: "#0a0a0a",
      color: "#fff",
    }}>
      <Navbar />
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Hero search={search} setSearch={setSearch} handleSearch={handleSearch} />
        <div style={{ flex: 1 }}>
          <CatalogContent
            produk={produk}
            loading={loading}
            SERIES={SERIES}
            TAGS={TAGS}
            activeSeries={activeSeries}
            setActiveSeries={setActiveSeries}
            activeTag={activeTag}
            setActiveTag={setActiveTag}
            setSearch={setSearch}
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0a0a0a" }} />}>
      <HomeContent />
    </Suspense>
  )
}