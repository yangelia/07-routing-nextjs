"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";

interface NotesClientProps {
  currentTag: string;
}

export default function NotesClient({ currentTag }: NotesClientProps) {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const slug = params.slug as string[];
  const tag = slug?.[0] || "all";
  const currentPage = Number(searchParams.get("page")) || 1;

  const filters = tag === "all" ? undefined : { tag };

  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", filters, currentPage],
    queryFn: () => fetchNotes({ ...filters, page: currentPage, limit: 10 }),
  });

  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("page", page.toString());
    router.push(`/notes/filter/${tag}?${newSearchParams.toString()}`);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { notes, totalPages } = data || { notes: [], totalPages: 1 };

  return (
    <div>
      <h1>
        {currentTag === "all" ? "All Notes" : `Notes with tag: ${currentTag}`}
      </h1>
      <NoteList notes={notes} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
