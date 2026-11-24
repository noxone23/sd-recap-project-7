# Todo App

A full-stack todo app. Users can see, add, tick off, edit and delete todos, and the todos are stored in MongoDB.

- **Backend** (`backend/`): Node.js, Express 5, TypeScript, mongoose
- **Frontend** (`frontend/`): Vite, React 19, TypeScript, SWR

React talks to Express, and Express talks to MongoDB.

## Requirements

- Node.js 22.22 or newer
- A MongoDB database: [MongoDB Atlas](https://www.mongodb.com/atlas) or a local MongoDB

## Getting started

Start from a fresh clone. You need two terminals, one for the backend and one for the frontend.

### 1. Clone and install

```bash
git clone https://github.com/noxone23/sd-recap-project-7.git
cd sd-recap-project-7

cd backend
npm i

cd ../frontend
npm i
```

### 2. Create `backend/.env`

Copy the example file and fill in your values:

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and set:

| Variable      | Meaning                                  | Example                                |
| ------------- | ---------------------------------------- | -------------------------------------- |
| `MONGODB_URI` | Connection string of your database       | `mongodb://127.0.0.1:27017/todos`      |
| `PORT`        | Port of the API (optional, default 3001) | `3001`                                 |

For Atlas, use the connection string of your cluster and `todos` as the database name, for example `mongodb+srv://<user>:<password>@<cluster-host>/todos?retryWrites=true&w=majority`.

`backend/.env` holds your secret connection string. It is ignored by git. Never commit it and never paste it into an issue or a pull request.

If the server cannot connect to Atlas, check "Network Access" in Atlas: your IP address may have changed.

### 3. Start the backend

```bash
cd backend
npm run dev
```

The terminal prints that it is connected to the database and that the API runs on http://localhost:3001. Check it: http://localhost:3001/api/health answers `{ "status": "ok" }`.

### 4. Start the frontend

```bash
cd frontend
npm run dev
```

Open http://localhost:5173. You see the page "Todos".

The frontend calls the API at `http://localhost:3001/api` (set in `frontend/src/api.ts`). The backend only accepts requests from `http://localhost:5173` (CORS), so keep both ports.

## Scripts

| Folder      | Command             | What it does                          |
| ----------- | ------------------- | ------------------------------------- |
| `backend/`  | `npm run dev`       | Starts the API and restarts on change |
| `backend/`  | `npm run start`     | Starts the API once                   |
| `backend/`  | `npm run typecheck` | Checks the types                      |
| `frontend/` | `npm run dev`       | Starts the app on port 5173           |
| `frontend/` | `npm run check`     | Checks the types                      |
| `frontend/` | `npm run build`     | Checks the types and builds the app   |

## Project structure

```
backend/
  src/
    index.ts              connects to the database and starts the server
    db.ts                 reads .env and connects to MongoDB
    app.ts                builds the app: CORS, JSON, routes, error handlers
    routes/todos.ts       the todo routes (GET, POST, PUT, DELETE)
    models/Todo.ts        the mongoose schema and model, and toTodo
    middleware/errors.ts  the 404 handler and the error handler
    types.ts              the types Todo and NewTodo
  .env.example            the variables the code reads, with placeholders
frontend/
  src/
    api.ts                all calls to the API (components never call fetch)
    App.tsx               the todo list, the forms and the states
    types.ts              the type Todo
    styles.css            the styles
docs/
  api-contract.md         the API contract
```

`app.ts` exports `app` and does not listen. Only `index.ts` starts the server.

## API

Base path `/api`, port `3001`. A todo has exactly the fields `id`, `title` and `done`.

| Method and path         | Body                  | Success                  | Errors                                               |
| ----------------------- | --------------------- | ------------------------ | ---------------------------------------------------- |
| `GET /api/health`       |                       | 200 `{ "status": "ok" }` |                                                      |
| `GET /api/todos`        |                       | 200 `Todo[]`             |                                                      |
| `POST /api/todos`       | `{ "title" }`         | 201 `Todo`               | 400 `{ "error": "<message>" }`                       |
| `PUT /api/todos/:id`    | `{ "title", "done" }` | 200 `Todo`               | 400 `{ "error": "<message>" }`, 404 `Todo not found` |
| `DELETE /api/todos/:id` |                       | 204, no body             | 404 `{ "error": "Todo not found" }`                  |
| any other route         |                       |                          | 404 `{ "error": "Not found" }`                       |

All errors look like `{ "error": "<message>" }`. The full contract with examples is in [`docs/api-contract.md`](docs/api-contract.md).

## Adding an owner to each todo

**Backend:** Add an `owner` field to the schema in `backend/src/models/Todo.ts` (a reference to a user) and to the types in `backend/src/types.ts`. A middleware in `app.ts`, before the router, would find out who sends the request. In `routes/todos.ts`, `POST` would save that user as the owner, and `GET`, `PUT` and `DELETE` would only look at todos of that user, for example `TodoModel.find({ owner })`. A todo of someone else would answer 404.

**Frontend:** All API calls are in `frontend/src/api.ts`, so a login token can be added in one place, to the headers of the requests. `App.tsx` then only has to show the todos that the API returns and a login state. `Todo` in `frontend/src/types.ts` only needs an `owner` if the UI shows it.
