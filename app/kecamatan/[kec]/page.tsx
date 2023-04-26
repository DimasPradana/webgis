"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Loading from "../../components/loading";

export const runtime = "experimental-edge"; // 'nodejs' (default) | 'experimental-edge'

const MapKecamatan = dynamic(() => import("./map"), {
  ssr: false,
});

export default function Kecamatan({ params }: { params: { kec: string } }) {
  return (
    <div className="basis-5/6 rounded-lg p-3 mb-3 mr-3">
      <div className="flex flex-col h-full">
        <div className="text-lg mb-5">Judul</div>
        <Suspense fallback={<Loading />}>
          <div className="bg-gray-800 border-2 border-slate-700 shadow-md shadow-sky-900 rounded-md h-full flex-grow">
            <MapKecamatan kec={params.kec} />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
