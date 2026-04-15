import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const series = await prisma.series.findMany({
      include: {
        _count: {
          select: { produk: true }
        }
      },
      orderBy: { id: 'asc' }
    })
    return NextResponse.json(series)
  } catch (error) {
    console.error("GET SERIES ERROR:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
