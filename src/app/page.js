"use client";
import { useEffect, useState } from "react";
import { createClient } from "./utils/supabase/client";

const supabase = createClient()

export default function Home() {
  const [notes, setNotes] = useState([])

  async function getData() {
    const { data: notesData, error: notesError } = await supabase.from("notes").select("*");
    if (!notesError && notesData) setNotes(notesData);
    else console.log("Notes tablosu boş veya hata:", notesError);
  
  }

  useEffect(() => {
    getData()
  }, [])
  return (
    <h1>
      Hello
    </h1>

  )

  
}