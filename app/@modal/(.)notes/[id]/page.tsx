import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import getQueryClient from "@/lib/getQueryClient";
import NoteModal from "@/components/NoteModal/NoteModal";

export default async function InterceptedNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
