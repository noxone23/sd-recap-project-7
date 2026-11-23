import useSWR from "swr";

import { fetchTodos } from "./api";

export default function App() {
  const { data: todos, isLoading } = useSWR("todos", fetchTodos);

  return (
    <main>
      <h1>Todos</h1>
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
