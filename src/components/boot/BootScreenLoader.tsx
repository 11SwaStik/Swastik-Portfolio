"use client";
import dynamic from "next/dynamic";

const BootScreen = dynamic(() => import("./BootScreen"), { ssr: false });

export default function BootScreenLoader() {
  return <BootScreen />;
}
