// components/NoteModal/NoteModal.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchNoteById } from "@/lib/api";
import css from "./NoteModal.module.css";

interface NoteModalProps {
  noteId: string;
}

export default function NoteModal({ noteId }: NoteModalProps) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
  });

  const handleClose = () => {
    router.back();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (isLoading) return <div className={css.modal}>Loading...</div>;
  if (error) return <div className={css.modal}>Error loading note</div>;

  return (
    <div className={css.overlay} onClick={handleOverlayClick}>
      <div className={css.modal}>
        <button className={css.closeButton} onClick={handleClose}>
          ×
        </button>
        <h2>{note?.title}</h2>
        <p className={css.content}>{note?.content}</p>
        <div className={css.footer}>
          <span className={css.tag}>{note?.tag}</span>
          <span className={css.date}>
            {note && new Date(note.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
