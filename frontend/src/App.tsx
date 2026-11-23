import { useState, type FormEvent } from "react";
import useSWR from "swr";

import { createTodo, fetchTodos } from "./api";

export default function App() {
  const { data: todos, isLoading, mutate } = useSWR("todos", fetchTodos);
  const [title, setTitle] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await createTodo(title.trim());
    setTitle("");
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
            <label className={todo.done ? "todo-title done" : "todo-title"}>
              <input type="checkbox" checked={todo.done} readOnly />
              {todo.title}
            </label>
          </li>
        ))}
      </ul>
    </main>
  );
}
