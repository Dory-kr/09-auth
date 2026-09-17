import type { Metadata } from "next";

import { fetchNoteById } from "@/lib/api/serverApi";

import NoteDetails from "./NoteDetails.client";

const OG_IMAGE =
  "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

interface NoteDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: NoteDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteById(id);

  const title = note.title;
  const description =
    note.content.length > 160
      ? `${note.content.slice(0, 157)}...`
      : note.content;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub.com/notes/${id}`,
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

const NoteDetailsPage = () => {
  return <NoteDetails />;
};

export default NoteDetailsPage;
