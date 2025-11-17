export const archetypes = [
  {
    id: "react-component",
    title: "React Component",
    code: `export default function Component() {
  return <div>Hello</div>;
}`,
  },
  {
    id: "express-server",
    title: "Express Server",
    code: `import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running");
});

app.listen(5000);`,
  },
  {
    id: "router-basic",
    title: "Express Router",
    code: `import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Hello" });
});

export default router;`,
  },
  {
    id: "github-ci",
    title: "GitHub Actions CI",
    code: `name: CI

on:
  push:
    branches: ["main"]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm install
      - run: npm test`,
  },
];
