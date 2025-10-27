"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import css from "./NoteModal.module.css";

export default function NoteModal() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  const handleClose = () => {
    router.back();
  };

  if (isLoading)
    return (
      <Modal onClose={handleClose}>
        <div className={css.container}>
          <p>Loading, please wait...</p>
        </div>
      </Modal>
    );

  if (error || !note)
    return (
      <Modal onClose={handleClose}>
        <div className={css.container}>
          <p>Something went wrong.</p>
        </div>
      </Modal>
    );

  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <p className={css.date}>
              {new Date(note.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
