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

  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", filters, currentPage],
    queryFn: () => fetchNotes({ ...filters, page: currentPage, limit: 10 }),
  });

  console.log("=== DEBUG INFO ===");
  console.log("isLoading:", isLoading);
  console.log("error:", error);
  console.log("data:", data);
  console.log("filters:", filters);
  console.log("currentPage:", currentPage);
  console.log("tag:", tag);

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

  if (isLoading) {
    console.log("Still loading...");
    return <p>Loading...</p>;
  }

  if (error) {
    console.error("Error details:", error);
    return (
      <div>
        <p>Error loading notes: {error.message}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  const { notes = [], totalPages = 1 } = data || {};

  console.log("Rendering notes:", notes);

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
        {notes.length > 0 && ` (${notes.length} notes)`}
      </h1>

      <div
        style={{
          background: "#f0f8ff",
          padding: "1rem",
          marginBottom: "1rem",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      >
        <h3>Debug Information:</h3>
        <p>
          <strong>Status:</strong>{" "}
          {isLoading ? "Loading..." : error ? "Error" : "Loaded"}
        </p>
        <p>
          <strong>Notes Count:</strong> {notes?.length || 0}
        </p>
        <p>
          <strong>Current Tag:</strong> {tag}
        </p>
        <p>
          <strong>Current Page:</strong> {currentPage}
        </p>
        {error && (
          <p>
            <strong>Error:</strong> {error.message}
          </p>
        )}
      </div>

      <NoteList notes={notes} />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {isCreateModalOpen && (
        <Modal onClose={() => setIsCreateModalOpen(false)}>
          <NoteForm onClose={() => setIsCreateModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
