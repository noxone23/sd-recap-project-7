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
