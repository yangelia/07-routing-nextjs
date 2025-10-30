import axios from "axios";
import type { Note, CreateNoteRequest } from "@/types/note";

const API_BASE_URL = "http://localhost:3001/api";

interface FetchNotesParams {
  tag?: string;
  page?: number;
  limit?: number;
}

export async function fetchNotes(
  filters?: FetchNotesParams
): Promise<{ notes: Note[]; totalPages: number }> {
  const params: FetchNotesParams = {};

  if (filters?.tag && filters.tag !== "all") {
    params.tag = filters.tag;
  }
  if (filters?.page) {
    params.page = filters.page;
  }
  if (filters?.limit) {
    params.limit = filters.limit;
  } else {
    params.limit = 10;
  }

  const response = await axios.get(`${API_BASE_URL}/notes`, { params });
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await axios.get(`${API_BASE_URL}/notes/${id}`);
  return response.data;
}

export async function createNote(noteData: CreateNoteRequest): Promise<Note> {
  const response = await axios.post(`${API_BASE_URL}/notes`, noteData);
  return response.data;
}

export async function deleteNote(id: string): Promise<void> {
  await axios.delete(`${API_BASE_URL}/notes/${id}`);
}
