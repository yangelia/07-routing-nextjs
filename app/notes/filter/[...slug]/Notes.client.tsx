"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
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
  const searchQuery = searchParams.get("search") || "";

  const [searchValue, setSearchValue] = useState(searchQuery);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    setSearchValue(searchQuery);
  }, [searchQuery]);

  const filters = tag === "all" ? undefined : { tag };

  const queryFilters = {
    ...filters,
    ...(searchQuery && { search: searchQuery }),
    page: currentPage,
    limit: 10,
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", queryFilters],
    queryFn: () => fetchNotes(queryFilters),
  });

  console.log("API Response:", data);
  console.log("Query Filters:", queryFilters);

  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("page", page.toString());
    router.push(`/notes/filter/${tag}?${newSearchParams.toString()}`);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleSearchSubmit = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (searchValue.trim()) {
      newSearchParams.set("search", searchValue.trim());
    } else {
      newSearchParams.delete("search");
    }
    newSearchParams.set("page", "1");
    router.push(`/notes/filter/${tag}?${newSearchParams.toString()}`);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete("search");
    newSearchParams.set("page", "1");
    router.push(`/notes/filter/${tag}?${newSearchParams.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { notes, totalPages } = data || { notes: [], totalPages: 1 };

  return (
    <div className={css.container}>
      <div className={css.toolbar}>
        <div className={css.searchSection}>
          <SearchBox
            value={searchValue}
            onChange={handleSearchChange}
            onClear={handleClearSearch}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSearchSubmit} className={css.searchButton}>
            Search
          </button>
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
        {searchQuery && ` - Search: "${searchQuery}"`}
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
