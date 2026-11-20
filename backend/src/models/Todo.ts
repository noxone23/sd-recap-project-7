import { Schema, model } from "mongoose";
import type { Todo } from "../types.js";

const todoSchema = new Schema({
  title: { type: String, required: true, trim: true },
  done: { type: Boolean, default: false },
});

export const TodoModel = model("Todo", todoSchema);

export function toTodo(doc: InstanceType<typeof TodoModel>): Todo {
  return { id: doc._id.toString(), title: doc.title, done: doc.done };
}
// Issue 2: write the mongoose schema, the model and `toTodo` here.
// Look at the Book model of Backend MongoDB: it has the same shape.
// A todo has a `title` (a required string, trimmed) and `done` (a boolean, default `false`).
// The types `Todo` and `NewTodo` are already in `../types.ts`.
export {};
