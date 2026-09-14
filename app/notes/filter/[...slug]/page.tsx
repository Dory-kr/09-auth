import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api/fetchNotes";
import type { NoteTag } from "@/types/note";
import Notes from "./Notes.client";

const PER_PAGE = 12;

interface NotesPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

const OG_IMAGE =
  "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

export async function generateMetadata({
  params,
}: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;

  const tag = slug[0] === "all" ? "All" : slug[0];
  const title = `${tag} notes`;
  const description =
    tag === "All"
      ? "View all your notes"
      : `View your ${tag} notes`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub.com/notes/filter/${slug.join("/")}`,
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;

  const tag = slug[0] === "all" ? undefined : (slug[0] as NoteTag);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: PER_PAGE,
        search: "",
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Notes tag={tag} />
    </HydrationBoundary>
  );
}
