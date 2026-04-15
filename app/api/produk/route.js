import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const series_id = searchParams.get('series_id')
    const search = searchParams.get('search')
    const tag = searchParams.get('tag')

    const where = {
      tersedia: true,
    }

    if (series_id) {
      where.series_id = parseInt(series_id)
    }

    if (search) {
      where.nama = { contains: search }
    }

    if (tag) {
      where.tags = {
        some: {
          tag: { nama: tag }
        }
      }
    }

    const produk = await prisma.produk.findMany({
      where,
      include: {
        series: { select: { nama: true } },
        gambar: { where: { is_cover: true }, take: 1 },
        tags: { include: { tag: true } }
      },
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json(produk)

  } catch (error) {
    console.error("API ERROR:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
