import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function PUT(req, context) {
  try {
    const { id } = await context.params
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

    // UPDATE PRODUK
    const produk = await prisma.produk.update({
      where: { id: parseInt(id) },
      data: {
        nama,
        nomor_seri: nomor_seri || null,
        warna: warna || null,
        skala: skala || "1:64",
        negara_asal: negara_asal || null,
        harga: harga ? parseFloat(harga) : 0,
        stok: stok ? parseInt(stok) : 0,
        deskripsi: deskripsi || null,
        series_id: series_id ? parseInt(series_id) : null,
      },
    })

    // UPDATE GAMBAR JIKA ADA UPLOAD BARU
    if (gambar && gambar.size > 0) {
      const bytes = await gambar.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const filename = `${Date.now()}-${gambar.name.replace(/\s/g, "_")}`
      const uploadDir = path.join(process.cwd(), "public", "images")
      await mkdir(uploadDir, { recursive: true })
      await writeFile(path.join(uploadDir, filename), buffer)
      const imageUrl = `/images/${filename}`

      await prisma.produkGambar.deleteMany({ where: { produk_id: parseInt(id) } })
      await prisma.produkGambar.create({
        data: { produk_id: parseInt(id), url: imageUrl, is_cover: true },
      })
    }

    // UPDATE TAGS
    await prisma.produkTag.deleteMany({ where: { produk_id: parseInt(id) } })
    for (const tagNama of tags) {
      let tag = await prisma.tag.findUnique({ where: { nama: tagNama } })
      if (!tag) {
        tag = await prisma.tag.create({ data: { nama: tagNama } })
      }
      await prisma.produkTag.create({
        data: { produk_id: parseInt(id), tag_id: tag.id },
      })
    }

    return NextResponse.json({ success: true, produk })
  } catch (error) {
    console.error("PUT PRODUK ERROR:", error)
    return NextResponse.json({ error: "Gagal update produk" }, { status: 500 })
  }
}

export async function DELETE(req, context) {
  try {
    const { id } = await context.params

    await prisma.produk.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE PRODUK ERROR:", error)
    return NextResponse.json({ error: "Gagal hapus produk" }, { status: 500 })
  }
}
