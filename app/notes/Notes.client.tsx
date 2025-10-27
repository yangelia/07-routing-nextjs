"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { useSearchParams, useRouter } from "next/navigation";
import { keepPreviousData } from "@tanstack/react-query";
import css from "./page.module.css";
import { fetchNotes } from "@/lib/api/api";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteForm from "@/components/NoteForm/NoteForm";
import Modal from "@/components/Modal/Modal";

const NotesClient = () => {
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

    const queryString = params.toString();
    router.push(queryString ? `/notes?${queryString}` : "/notes", {
      scroll: false,
    });
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

  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes(page, search, 12),
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
        {isSuccess && data && data.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
          />
        )}
        <button className={css.addButton} onClick={() => setIsModalOpen(true)}>
          + Create Note
        </button>
      </header>

      {isLoading && <p>Loading, please wait...</p>}
      {isError && (
        <div className={css.error}>
          Error: {error?.message || "Something went wrong"}
        </div>
      )}

      {isSuccess && data && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default NotesClient;
