import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import NoteModal from "./NotePreview.client";
import { fetchNoteById } from "@/lib/api";
import getQueryClient from "@/lib/getQueryClient";

type NoteModalProps = {
  params: Promise<{ id: string }>;
};

export default async function InterceptedNotePage({ params }: NoteModalProps) {
  const { id } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteModal noteId={id} />
    </HydrationBoundary>
  );
}
