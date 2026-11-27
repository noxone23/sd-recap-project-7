import { useEffect, useState, type SubmitEvent } from "react";
import useSWR from "swr";

import { createTodo, deleteTodo, fetchTodos, updateTodo } from "./api";
import { LoginBar } from "./LoginBar"

import { authClient } from "./auth-client";

import type { Filter, Todo } from "./types";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") {
    return saved;
  }
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function errorMessage(err: unknown) {
  return err instanceof Error ? err.message : "Something went wrong";
}

export default function App() {

  const { data: session, isPending } = authClient.useSession();

  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [filter, setFilter] = useState<Filter>("all");
  const {
    data: todos,
    error,
    isLoading,
    mutate,
  } = useSWR(
    session ? (["todos", filter] as const) : null, ([, current]) => fetchTodos(current),
  );
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setActionError(null);
    setIsAdding(true);
    try {
      await createTodo(title.trim());
      setTitle("");
      await mutate();
    } catch (err) {
      setActionError(errorMessage(err));
    } finally {
      setIsAdding(false);
    }
  }

  async function handleToggle(todo: Todo) {
    setActionError(null);
    try {
      await updateTodo({ ...todo, done: !todo.done });
      await mutate();
    } catch (err) {
      setActionError(errorMessage(err));
    }
  }

  function handleEdit(todo: Todo) {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  }

  function handleCancel() {
    setEditingId(null);
  }

  async function handleSave(event: SubmitEvent<HTMLFormElement>, todo: Todo) {
    event.preventDefault();
    setActionError(null);
    try {
      await updateTodo({ ...todo, title: editTitle.trim() });
      setEditingId(null);
      await mutate();
    } catch (err) {
      setActionError(errorMessage(err));
    }
  }

  async function handleDelete(todo: Todo) {
    setActionError(null);
    try {
      await deleteTodo(todo.id);
      await mutate();
    } catch (err) {
      setActionError(errorMessage(err));
    }
  }

  return (
    <main>
    <LoginBar />
      <header className="header">
        <h1>Todos</h1>
        <button
          type="button"
          className="theme-toggle"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>
      </header>
      {!isPending && !session ? (
        <p>Log in with GitHub to see your todos.</p>
      ) : (
        <>
      <form className="todo-form" onSubmit={handleSubmit}>
        <label className="visually-hidden" htmlFor="new-title">
          New todo
        </label>
        <input
          id="new-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What do you have to do?"
        />
        <button type="submit" disabled={title.trim() === "" || isAdding}>
          Add
        </button>
      </form>
      <div className="filter">
        <button
          type="button"
          className={filter === "all" ? "active" : ""}
          aria-pressed={filter === "all"}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          type="button"
          className={filter === "open" ? "active" : ""}
          aria-pressed={filter === "open"}
          onClick={() => setFilter("open")}
        >
          Open
        </button>
        <button
          type="button"
          className={filter === "done" ? "active" : ""}
          aria-pressed={filter === "done"}
          onClick={() => setFilter("done")}
        >
          Done
        </button>
      </div>
      {actionError && (
        <p className="error" role="alert">
          {actionError}
        </p>
      )}
      {isLoading && <p className="loading">Loading todos…</p>}
      {error && (
        <div>
          <p className="error" role="alert">
            Could not load the todos.
          </p>
          <button type="button" onClick={() => mutate()}>
            Try again
          </button>
        </div>
      )}
      {!error && todos?.length === 0 && (
        <p>
          {filter === "all" && "No todos yet. Add your first todo above!"}
          {filter === "open" && "No open todos."}
          {filter === "done" && "No done todos yet."}
        </p>
      )}
      <ul className="todo-list">
        {todos?.map((todo) => (
          <li key={todo.id} className="todo-item">
            {editingId === todo.id ? (
              <form
                className="todo-form"
                onSubmit={(event) => handleSave(event, todo)}
              >
                <label className="visually-hidden" htmlFor="edit-title">
                  Edit title
                </label>
                <input
                  id="edit-title"
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
                  autoFocus
                />
                <button type="submit" disabled={editTitle.trim() === ""}>
                  Save
                </button>
                <button type="button" onClick={handleCancel}>
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <label className={todo.done ? "todo-title done" : "todo-title"}>
                  <input
                    type="checkbox"
                    checked={todo.done}
                    onChange={() => handleToggle(todo)}
                  />
                  {todo.title}
                </label>
                <button type="button" onClick={() => handleEdit(todo)}>
                  Edit
                </button>
                <button type="button" onClick={() => handleDelete(todo)}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
       </ul>
        </>
      )}
    </main>
  );
}
