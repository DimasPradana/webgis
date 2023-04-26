"use client";
import dynamic from "next/dynamic";

export const runtime = "experimental-edge"; // 'nodejs' (default) | 'experimental-edge'

const MapKelurahan = dynamic(() => import("./map"), {
  ssr: false,
});

export default function Kecamatan({ params }: { params: { kel: string } }) {
  return <MapKelurahan kel={params.kel} />;
}
