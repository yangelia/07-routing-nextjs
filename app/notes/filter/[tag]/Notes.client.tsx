"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";

interface NotesClientProps {
  currentTag: string;
}

export default function NotesClient({ currentTag }: NotesClientProps) {
  const params = useParams();
  const tag = params.tag as string;

  const filters = tag === "all" ? undefined : { tag };

  const {
    data: notes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notes", filters],
    queryFn: () => fetchNotes(filters),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>
        {currentTag === "all" ? "All Notes" : `Notes with tag: ${currentTag}`}
      </h1>
      <NoteList notes={notes || []} />
    </div>
  );
}
