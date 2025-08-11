import express from "express";
import { greet } from "@shared/utils";

const app = express();
const PORT = process.env.PORT || 3001;

app.get("/api", (_req, res) => {
  res.json({ message: greet("TypeScript World") });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});