"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import AttendanceForm from "./PiketForm";
import StudentList from "./ListSiswa";
import { FaArrowLeft } from "react-icons/fa";

export default function InputPiketClient() {
  const searchParams = useSearchParams();
  const kelas = searchParams.get("kelas") || "Tidak Diketahui";

  return (
    <>
      <div className="flex items-center justify-between sm:mt-14 mt-10 sm:mb-4 mb-2 max-w-6xl">
        <h1 className="sm:text-3xl text-2xl text-black font-bold">
          Input Piket - {kelas}
        </h1>
        <button
          onClick={() => window.history.back()}
          className="text-gray-700 hover:text-gray-900 mr-auto ml-2 transition duration-300"
        >
          <FaArrowLeft className="text-2xl " />
        </button>
      </div>

      <div className="mt-5">
        <AttendanceForm />
      </div>

      <div className="mt-5">
        <StudentList />
      </div>
    </>
  );
}
