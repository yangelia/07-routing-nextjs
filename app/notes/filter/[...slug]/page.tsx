import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

interface Props {
  params: {
    slug?: string[];
  };
  searchParams: {
    page?: string;
    search?: string;
  };
}

export default async function FilteredNotesPage({
  params,
  searchParams,
}: Props) {
  const tag = params.slug?.[0] || "all";
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || "";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", page, search, tag],
    queryFn: () =>
      fetchNotes(page, search, 12, tag === "all" ? undefined : tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  );
}
