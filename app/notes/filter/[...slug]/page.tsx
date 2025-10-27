import { fetchNotes } from "@/lib/api/api";
import FilteredNotesClient from "./FilteredNotesClient";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

interface Props {
  params: {
    tag?: string[];
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
  const tag = params.tag?.[0] || "all";
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
      <FilteredNotesClient initialTag={tag} />
    </HydrationBoundary>
  );
}
