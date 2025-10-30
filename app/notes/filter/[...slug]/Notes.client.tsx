"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./page.module.css";

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

  const [searchValue, setSearchValue] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleClearSearch = () => {
    setSearchValue("");
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { notes, totalPages } = data || { notes: [], totalPages: 1 };

  console.log("Notes data:", notes);

  return (
    <div className={css.container}>
      <div className={css.toolbar}>
        <div className={css.searchSection}>
          <SearchBox
            value={searchValue}
            onChange={handleSearchChange}
            onClear={handleClearSearch}
          />
        </div>

        <div className={css.actions}>
          <button
            className={css.createButton}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Note
          </button>
        </div>
      </div>

      <h1 className={css.title}>
        {currentTag === "all" ? "All Notes" : `Notes with tag: ${currentTag}`}
      </h1>

      <NoteList notes={notes} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {isCreateModalOpen && (
        <Modal onClose={() => setIsCreateModalOpen(false)}>
          <NoteForm onClose={() => setIsCreateModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
