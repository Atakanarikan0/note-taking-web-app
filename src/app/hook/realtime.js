"use client"
import { useEffect } from "react";
import { createClient } from "../utils/supabase/client";

export default function useNotesRealtime({ setNotes }) {
  const supabase = createClient();

  useEffect(() => {
    // channel oluştur
    const channel = supabase
      .channel("notes-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notes" },
        (payload) => {
          console.log("Realtime payload:", payload);
          const evt = payload.eventType;

          if (evt === "INSERT" && payload.new) {
            setNotes(prev => [...prev, payload.new]);
          }

          if (evt === "UPDATE" && payload.new) {
            setNotes(prev => prev.map(n => n.id === payload.new.id ? payload.new : n));
          }

          if (evt === "DELETE" && payload.old) {
            setNotes(prev => prev.filter(n => n.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // cleanup: component unmount olduğunda channel’i kaldır
    return () => {
      supabase.removeChannel(channel);
    };
  }, [setNotes]); // sadece mount ve setNotes değişirse çalışır
}
