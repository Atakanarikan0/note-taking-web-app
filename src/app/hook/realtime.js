"use client"
import { useEffect, useRef } from "react";
import { createClient } from "../utils/supabase/client";

export default function useNotesRealtime({ setNotes, initialNotes = [], sortFn = (a,b) => b.created_at.localeCompare(a.created_at) }) {
  const channelRef = useRef(null);
  const supabase = createClient();
  useEffect(() => {
    // initialize notes state if needed
    setNotes((prev) => (prev.length ? prev : initialNotes.sort(sortFn)));

    // create channel
    const channel = supabase
      .channel("notes-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notes" },
        (payload) => {
          setNotes((prevNotes) => {
            // normalize payload for easier handling
            const evt = payload.eventType;
            const newRow = payload.new ?? null;
            const oldRow = payload.old ?? null;

            if (evt === "INSERT" && newRow) {
              // avoid duplicates
              if (prevNotes.some((n) => n.id === newRow.id)) return prevNotes;
              const next = [newRow, ...prevNotes];
              return next.sort(sortFn);
            }

            if (evt === "UPDATE" && newRow) {
              const exists = prevNotes.some((n) => n.id === newRow.id);
              const next = exists
                ? prevNotes.map((n) => (n.id === newRow.id ? newRow : n))
                : [newRow, ...prevNotes];
              return next.sort(sortFn);
            }

            if (evt === "DELETE" && oldRow) {
              return prevNotes.filter((n) => n.id !== oldRow.id);
            }

            return prevNotes;
          });
        }
      )
      .subscribe();

    channelRef.current = channel;

    // cleanup on unmount
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [setNotes, initialNotes, sortFn]);

  return { channelRef };
}