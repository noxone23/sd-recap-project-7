import { Router } from "express";
import { TodoModel, toTodo } from "../models/Todo.js";

export const todosRouter = Router();

todosRouter.get("/", async (request, response) => {
  const todos = await TodoModel.find();
  response.json(todos.map(toTodo));
});
