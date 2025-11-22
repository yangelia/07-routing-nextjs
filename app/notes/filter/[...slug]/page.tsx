import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/lib/getQueryClient";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

interface FilterPageProps {
  params: Promise<{ slug: string[] }>;
  searchParams?: Promise<{ page?: string }>;
}

export default async function FilterPage({
  params,
  searchParams,
}: FilterPageProps) {
  const { slug } = await params;
  const searchParamsObj = searchParams ? await searchParams : {};
  const { page } = searchParamsObj || {};
  const currentPage = page ? parseInt(page, 10) : 1;
  const tag = slug?.[0] || "all";

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", currentPage, "", tag],
    queryFn: () =>
      fetchNotes(
        currentPage,
        "",
        12,
        tag === "all" ? undefined : (tag as string)
      ),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* Передаём tag пропом, как требует ментор */}
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
