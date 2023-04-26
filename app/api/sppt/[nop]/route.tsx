import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { nop: string } }
) {
  const nop = params.nop;
  // console.debug("samid nop: ", nop);

  const prisma = new PrismaClient({ log: ["error", "warn"] });
  const year = new Date().getFullYear().toString();
  // console.debug("samid year: ", year);

  // const sppt = await prisma.pBB_SPPT.findFirst({});
  const sppt: object | null = await prisma.pBB_SPPT.findUnique({
    where: {
      NOP_SPPT_TAHUN_PAJAK: {
        NOP: nop,
        SPPT_TAHUN_PAJAK: year,
      },
    },
    select: {
      NOP: true,
      WP_NAMA: true,
      SPPT_PBB_HARUS_DIBAYAR: true,
      OP_LUAS_BUMI: true,
      OP_LUAS_BANGUNAN: true,
      OP_NJOP_BUMI: true,
      OP_NJOP_BANGUNAN: true,
    },
  });

  // return NextResponse.json({ nop });
  return NextResponse.json(
    { sppt },
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}
