"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import css from "./page.module.css";

interface NotesClientProps {
  currentTag: string;
}

export default function NotesClient({ currentTag }: NotesClientProps) {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const tag = params.tag as string;
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

  if (isLoading) return <div className={css.loading}>Loading notes...</div>;
  if (error) return <div className={css.error}>Error: {error.message}</div>;

  const { notes, totalPages } = data || { notes: [], totalPages: 1 };

  return (
    <div className={css.container}>
      <div className={css.header}>
        <h1 className={css.title}>
          {currentTag === "all" ? "All Notes" : `Notes with tag: ${currentTag}`}
        </h1>
        <div className={css.stats}>
          {notes.length} note{notes.length !== 1 ? "s" : ""} found
        </div>
      </div>

      <div className={css.content}>
        <NoteList notes={notes} />
      </div>

      {totalPages > 1 && (
        <div className={css.paginationWrapper}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
