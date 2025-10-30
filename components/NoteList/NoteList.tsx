"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import css from "./NoteList.module.css";
import type { Note } from "@/types/note";
import { deleteNote } from "@/lib/api";

interface NoteListProps {
  notes: Note[];
}

const NoteList = ({ notes }: NoteListProps) => {
  const queryClient = useQueryClient();

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteNoteMutation.mutate(id);
    }
  };

  if (notes.length === 0) {
    return <p className={css.empty}>No notes found</p>;
  }

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <Link
            href={`/notes/${note.id}`}
            className={css.titleLink}
            scroll={false}
          >
            <h2 className={css.title}>{note.title}</h2>
          </Link>

          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <Link href={`/notes/filter/${note.tag}`} className={css.tagLink}>
              <span className={css.tag}>{note.tag}</span>
            </Link>
            <button
              className={css.button}
              onClick={() => handleDelete(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
