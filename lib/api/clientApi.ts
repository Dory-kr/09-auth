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

interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

interface AuthCredentials {
  email: string;
  password: string;
}

interface UpdateMeParams {
  username: string;
}

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
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);

  return response.data;
};

export const createNote = async (note: CreateNoteParams): Promise<Note> => {
  const response = await api.post<Note>("/notes", note);

  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);

  return response.data;
};

export const register = async (
  credentials: AuthCredentials
): Promise<User> => {
  const response = await api.post<User>("/auth/register", credentials);

  return response.data;
};

export const login = async (credentials: AuthCredentials): Promise<User> => {
  const response = await api.post<User>("/auth/login", credentials);

  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const checkSession = async (): Promise<{ success: boolean }> => {
  const response = await api.get<{ success: boolean }>("/auth/session");

  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>("/users/me");

  return response.data;
};

export const updateMe = async (data: UpdateMeParams): Promise<User> => {
  const response = await api.patch<User>("/users/me", data);

  return response.data;
};
