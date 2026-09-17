import { cookies } from "next/headers";

import api from "./api";

import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: NoteTag;
}

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const getCookieHeader = async () => {
  const cookieStore = await cookies();

  return cookieStore.toString();
};

export const fetchNotes = async ({
  page,
  perPage,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await api.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      search,
      ...(tag ? { tag } : {}),
    },
    headers: {
      Cookie: await getCookieHeader(),
    },
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: await getCookieHeader(),
    },
  });

  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>("/users/me", {
    headers: {
      Cookie: await getCookieHeader(),
    },
  });

  return response.data;
};

export const checkSession = async () => {
  return api.get<{ success: boolean }>("/auth/session", {
    headers: {
      Cookie: await getCookieHeader(),
    },
  });
};
