import Link from "next/link";
import React from "react";

export default function Sidebar() {
  return (
    // <div className="bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 shadow-md shadow-cyan-400 rounded-lg basis-1/6 p-3 ml-3 mb-3">
    <div className="bg-gradient-to-t from-gray-900 via-gray-800 to-slate-800 rounded-lg basis-1/6 pt-3 pl-3">
      {/* <div className="flex flex-col divide-y divide-slate-700 hover:divide-sky-400">
        <div className="flex justify-between py-1">Home</div>
        <div className="flex justify-between py-1">Menu 1</div>
        <div className="flex justify-between py-1">Menu 2</div>
      </div> */}
      <div className="flex flex-col justify-between">
        <Link
          href="/"
          className="rounded-md hover:bg-sky-800 py-1 my-1 pl-3 flex justify-between"
        >
          Home
        </Link>
        <a
          href="#"
          className="rounded-md hover:bg-blue-800  py-1 my-1 pl-3 flex justify-between"
        >
          Menu 1
        </a>
        <a
          href="#"
          className="rounded-md hover:bg-indigo-800  py-1 my-1 pl-3 flex justify-between"
        >
          Menu 2
        </a>
      </div>
    </div>
  );
}
