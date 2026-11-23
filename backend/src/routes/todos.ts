import { Router } from "express";
import { TodoModel, toTodo } from "../models/Todo.js";
import type { NewTodo } from "../types.js";

export const todosRouter = Router();

todosRouter.get("/", async (request, response) => {
  const todos = await TodoModel.find();
  response.json(todos.map(toTodo));
});

todosRouter.post("/", async (request, response) => {
  const { title } = (request.body ?? {}) as Partial<NewTodo>;
  // The schema trims the title and rejects an empty one, the error handler turns that into a 400.
  const todo = await TodoModel.create({ title });
  response.status(201).json(toTodo(todo));
});
