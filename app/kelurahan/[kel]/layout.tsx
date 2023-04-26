import React from "react";
import { Suspense } from "react";
import Loading from "../../components/loading";

export const fetchCache = "auto";
// 'auto' | 'default-cache' | 'only-cache'
// 'force-cache' | 'force-no-store' | 'default-no-store' | 'only-no-store'

export default function KelurahanLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="basis-5/6 rounded-lg p-3 mb-3 mr-3">
      <div className="flex flex-col h-full">
        <div className="text-lg mb-5">Kelurahan ...</div>
        <Suspense fallback={<Loading />}>
          <div className="bg-gray-800 border-2 border-slate-700 shadow-md shadow-sky-900 rounded-md h-full flex-grow">
            {children}
          </div>
        </Suspense>
      </div>
    </div>
  );
}
