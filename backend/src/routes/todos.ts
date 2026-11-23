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

todosRouter.put("/:id", async (request, response) => {
  const { title, done } = (request.body ?? {}) as Partial<NewTodo>;
  // Without a title mongoose would skip the field and answer 200, so we reject it here.
  if (typeof title !== "string") {
    response
      .status(400)
      .json({ error: "A todo needs a title, and done must be true or false" });
    return;
  }
  const todo = await TodoModel.findByIdAndUpdate(
    request.params.id,
    { title, done },
    { returnDocument: "after", runValidators: true }
  );
  // An id that does not exist gives null. An id like "abc" is a CastError, the error handler makes a 404 of it.
  if (!todo) {
    response.status(404).json({ error: "Todo not found" });
    return;
  }
  response.json(toTodo(todo));
});