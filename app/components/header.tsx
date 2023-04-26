import React from "react";
import styles from "./header.module.css";

export default function Header() {
  return (
    <div
      // className={`${styles.header} bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md shadow-cyan-400 rounded-lg flex flex-row basis-3.5 m-3 pt-3 pb-3`}
      className={`${styles.header} bg-sky-800 border-2 border-sky-700 divide-x divide-slate-500 shadow-md shadow-sky-900 rounded-lg flex flex-row m-3`}
    >
      <div className="basis-1/6 flex flex-row h-full">
        <div className="basis-2/6 flex justify-center items-center">Logo</div>
        <div className="basis-4/6 flex justify-center items-center">
          BAPENDA
        </div>
      </div>
      <div className="basis-4/6 flex justify-start pl-3 py-3">Title</div>
      <div className="basis-1/6 flex justify-end pr-3 py-3">Logout</div>
    </div>
  );
}
