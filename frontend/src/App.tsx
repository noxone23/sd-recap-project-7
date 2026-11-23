import { useState, type FormEvent } from "react";
import useSWR from "swr";

import { createTodo, deleteTodo, fetchTodos, updateTodo } from "./api";
import type { Todo } from "./types";

export default function App() {
  const { data: todos, isLoading, mutate } = useSWR("todos", fetchTodos);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await createTodo(title.trim());
    setTitle("");
    await mutate();
  }

  async function handleToggle(todo: Todo) {
    await updateTodo({ ...todo, done: !todo.done });
    await mutate();
  }

  function handleEdit(todo: Todo) {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  }

  function handleCancel() {
    setEditingId(null);
  }

  async function handleSave(event: FormEvent<HTMLFormElement>, todo: Todo) {
    event.preventDefault();
    await updateTodo({ ...todo, title: editTitle.trim() });
    setEditingId(null);
    await mutate();
  }

  async function handleDelete(todo: Todo) {
    await deleteTodo(todo.id);
    await mutate();
  }

  return (
    <main>
      <h1>Todos</h1>
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
        <button type="submit" disabled={title.trim() === ""}>
          Add
        </button>
      </form>
      {isLoading && <p>Loading todos…</p>}
      {todos?.length === 0 && <p>No todos yet. Nothing to do!</p>}
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
    </main>
  );
}
