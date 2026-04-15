import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request, context) {
  try {
    const { id } = await context.params

    const produk = await prisma.produk.findUnique({
      where: { id: parseInt(id) },
      include: {
        series: { select: { nama: true } },
        gambar: true,
        tags: { include: { tag: true } }
      }
    })

    if (!produk) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      )
    }

    return NextResponse.json(produk)

  } catch (error) {
    console.error("GET DETAIL ERROR:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
