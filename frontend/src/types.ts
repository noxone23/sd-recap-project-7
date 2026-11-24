export type Todo = {
  id: string;
  title: string;
  done: boolean;
};

export type Filter = "all" | "open" | "done";
