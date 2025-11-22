"use client";

import { useEffect, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { useSearchParams, useRouter } from "next/navigation";
import css from "./page.module.css";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteForm from "@/components/NoteForm/NoteForm";
import Modal from "@/components/Modal/Modal";
import type { Note } from "@/types/note";

type NotesClientProps = {
  tag: string;
};

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialPage = Number(searchParams.get("page")) || 1;
  const initialSearch = searchParams.get("search") || "";

  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateURL = (newPage: number, newSearch: string) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set("page", newPage.toString());
    if (newSearch) params.set("search", newSearch);

    const basePath = `/notes/filter/${encodeURIComponent(tag)}`;
    const queryString = params.toString();
    const url = queryString ? `${basePath}?${queryString}` : basePath;

    router.push(url, { scroll: false });
  };

  const handleClearSearch = () => {
    setSearch("");
    updateURL(1, "");
  };

  const debouncedSearchChange = useDebouncedCallback((value: string) => {
    setSearch(value);
    updateURL(1, value);
  }, 300);

  useEffect(() => {
    setPage(initialPage);
  }, [initialPage]);

  const { data, isLoading, isError, error, isSuccess } = useQuery<
    FetchNotesResponse,
    Error
  >({
    queryKey: ["notes", page, search, tag],
    queryFn: () =>
      fetchNotes(page, search, 12, tag === "all" ? undefined : tag),
    // в React Query v5 вместо поля keepPreviousData
    // используется helper keepPreviousData как placeholderData
    placeholderData: keepPreviousData,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateURL(newPage, search);
  };

  return (
    <div className={css.container}>
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={debouncedSearchChange}
          onClear={handleClearSearch}
        />

        {isSuccess && data?.totalPages && data.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
          />
        )}

        <button
          type="button"
          className={css.addButton}
          onClick={() => setIsModalOpen(true)}
        >
          + Create Note
        </button>
      </header>

      {isLoading && <p>Loading, please wait...</p>}

      {isError && (
        <div className={css.error}>
          Error: {error?.message || "Something went wrong"}
        </div>
      )}

      {isSuccess && data?.notes && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
