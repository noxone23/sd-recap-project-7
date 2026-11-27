import "./env";
import { connectToDatabase } from "./db";
import { app } from "./app";


const PORT = Number(process.env.PORT ?? 3001);

// Connect first, then accept requests.
await connectToDatabase();

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
