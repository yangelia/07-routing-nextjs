import { redirect } from "next/navigation";

export default function NotesPage() {
  redirect("/notes/filter/all");
}
