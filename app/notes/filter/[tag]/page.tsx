import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/lib/getQueryClient";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

interface FilterPageProps {
  params: {
    tag: string;
  };
}

export default async function FilterPage({ params }: FilterPageProps) {
  const { tag } = await params;
  const queryClient = getQueryClient();

  const filters = tag === "all" ? undefined : { tag };

  await queryClient.prefetchQuery({
    queryKey: ["notes", filters],
    queryFn: () => fetchNotes(filters),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient currentTag={tag} />
    </HydrationBoundary>
  );
}
