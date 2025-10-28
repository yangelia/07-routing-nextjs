import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/lib/getQueryClient";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

interface FilterPageProps {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function FilterPage({
  params,
  searchParams,
}: FilterPageProps) {
  const { tag } = await params;
  const { page } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;

  const queryClient = getQueryClient();

  const filters = tag === "all" ? undefined : { tag };

  await queryClient.prefetchQuery({
    queryKey: ["notes", filters, currentPage],
    queryFn: () => fetchNotes({ ...filters, page: currentPage, limit: 10 }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient currentTag={tag} />
    </HydrationBoundary>
  );
}
