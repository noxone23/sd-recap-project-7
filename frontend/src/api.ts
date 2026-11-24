import type { Filter, Todo } from "./types";

// The backend allows requests from http://localhost:5173 (CORS), so the frontend can call it directly.
export const API_URL = "http://localhost:3001/api";

export async function fetchTodos(filter: Filter): Promise<Todo[]> {
  const query = filter === "all" ? "" : `?done=${filter === "done"}`;
  const response = await fetch(`${API_URL}/todos${query}`);
  if (!response.ok) {
    throw new Error("Could not load the todos");
  }
  return response.json();
}

export async function createTodo(title: string): Promise<Todo> {
  const response = await fetch(`${API_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }
  return response.json();
}

export async function updateTodo(todo: Todo): Promise<Todo> {
  const response = await fetch(`${API_URL}/todos/${todo.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: todo.title, done: todo.done }),
  });
  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }
  return response.json();
}

export async function deleteTodo(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/todos/${id}`, { method: "DELETE" });
  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }
}
