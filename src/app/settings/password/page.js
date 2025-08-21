"use client"
import Header from "@/components/header";
import Navigation from "@/components/navigation";
import Link from "next/link";
import "./password.css"

export default function Password() {
  return (
    <>
      <Header />
      <div className="password-container">
        <Link href="/settings">Settings</Link>
        <h2>Change Password</h2>
        <p>Coming Soon ... :) </p>
      </div>
      <Navigation />
    </>
  )
}