import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(req) {
  try {
    const formData = await req.formData()

    const nama = formData.get("nama")
    const nomor_seri = formData.get("nomor_seri")
    const warna = formData.get("warna")
    const skala = formData.get("skala") || "1:64"
    const negara_asal = formData.get("negara_asal")
    const harga = formData.get("harga")
    const stok = formData.get("stok")
    const deskripsi = formData.get("deskripsi")
    const series_id = formData.get("series_id")
    const tagsRaw = formData.get("tags")
    const gambar = formData.get("gambar")

    const tags = tagsRaw ? JSON.parse(tagsRaw) : []

    // SIMPAN GAMBAR
    let imageUrl = null
    if (gambar && gambar.size > 0) {
      const bytes = await gambar.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const filename = `${Date.now()}-${gambar.name.replace(/\s/g, "_")}`
      const uploadDir = path.join(process.cwd(), "public", "images")
      await mkdir(uploadDir, { recursive: true })
      await writeFile(path.join(uploadDir, filename), buffer)
      imageUrl = `/images/${filename}`
    }

    // BUAT PRODUK
    const produk = await prisma.produk.create({
      data: {
        nama,
        nomor_seri: nomor_seri || null,
        warna: warna || null,
        skala: skala || "1:64",
        negara_asal: negara_asal || null,
        harga: harga ? parseFloat(harga) : 0,
        stok: stok ? parseInt(stok) : 0,
        deskripsi: deskripsi || null,
        tersedia: true,
        series_id: series_id ? parseInt(series_id) : null,
      },
    })

    // SIMPAN GAMBAR KE DB
    if (imageUrl) {
      await prisma.produkGambar.create({
        data: {
          produk_id: produk.id,
          url: imageUrl,
          is_cover: true,
        },
      })
    }

    // SIMPAN TAGS
    for (const tagNama of tags) {
      let tag = await prisma.tag.findUnique({ where: { nama: tagNama } })
      if (!tag) {
        tag = await prisma.tag.create({ data: { nama: tagNama } })
      }
      await prisma.produkTag.create({
        data: { produk_id: produk.id, tag_id: tag.id },
      })
    }

    return NextResponse.json({ success: true, produk })
  } catch (error) {
    console.error("POST PRODUK ERROR:", error)
    return NextResponse.json({ error: "Gagal menambah produk" }, { status: 500 })
  }
}
