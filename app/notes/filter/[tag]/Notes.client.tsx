"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteForm from "@/components/NoteForm/NoteForm";
import Modal from "@/components/Modal/Modal";
import css from "./page.module.css";

interface NotesClientProps {
  currentTag: string;
}

export default function NotesClient({ currentTag }: NotesClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentPage = Number(searchParams.get("page")) || 1;
  const searchValue = searchParams.get("search") || "";

  const filters = currentTag === "all" ? undefined : { tag: currentTag };

  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", filters, currentPage, searchValue],
    queryFn: () =>
      fetchNotes({
        ...filters,
        page: currentPage,
        limit: 10,
        search: searchValue,
      }),
  });

  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("page", page.toString());
    router.push(`/notes/filter/${currentTag}?${newSearchParams.toString()}`);
  };

  const handleSearchChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (value) {
      newSearchParams.set("search", value);
    } else {
      newSearchParams.delete("search");
    }
    newSearchParams.set("page", "1");
    router.push(`/notes/filter/${currentTag}?${newSearchParams.toString()}`);
  };

  const handleSearchClear = () => {
    handleSearchChange("");
  };

  if (isLoading) return <div className={css.loading}>Loading notes...</div>;
  if (error) return <div className={css.error}>Error: {error.message}</div>;

  const { notes, totalPages } = data || { notes: [], totalPages: 1 };

  return (
    <div className={css.container}>
      <div className={css.toolbar}>
        <div>
          <SearchBox
            value={searchValue}
            onChange={handleSearchChange}
            onClear={handleSearchClear}
          />
        </div>

        <div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        <button className={css.addButton} onClick={() => setIsModalOpen(true)}>
          Create Note
        </button>
      </div>

      <NoteList notes={notes} />

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
