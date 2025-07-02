import React, { Suspense } from "react";
import Sidebar from "@/app/_components/Sidebar";
import Header from "@/app/_components/Header";
import InputPiketClient from "./_components/InputPiketClient";

export default function InputPiketPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Header className="fixed top-0 left-0 w-full bg-white z-50 shadow-md" />
      <Sidebar />

      <main className="flex-1 p-4 bg-gray-200 overflow-y-auto">
        <Suspense fallback={<div>Loading...</div>}>
          <InputPiketClient />
        </Suspense>
      </main>
    </div>
  );
}
