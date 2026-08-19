const express = require("express");

function createApp() {
  const app = express();
  app.use(express.json());

  let tasks = [
    { id: 1, name: "Estudiar CI/CD", priority: "alta", completed: false },
  ];
  let nextId = 2;

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.get("/tasks", (req, res) => {
    res.status(200).json(tasks);
  });

  app.get("/tasks/:id", (req, res) => {
    const task = tasks.find((t) => t.id === Number(req.params.id));
    if (!task) return res.status(404).json({ error: "Tarea no encontrada" });
    res.status(200).json(task);
  });

  app.post("/tasks", (req, res) => {
    const { name, priority } = req.body;
    if (!name || !priority) {
      return res.status(400).json({ error: "name y priority son requeridos" });
    }
    const task = { id: nextId++, name, priority, completed: false };
    tasks.push(task);
    res.status(201).json(task);
  });

  app.patch("/tasks/:id/complete", (req, res) => {
    const task = tasks.find((t) => t.id === Number(req.params.id));
    if (!task) return res.status(404).json({ error: "Tarea no encontrada" });
    task.completed = true;
    res.status(200).json(task);
  });

  app.delete("/tasks/:id", (req, res) => {
    const before = tasks.length;
    tasks = tasks.filter((t) => t.id !== Number(req.params.id));
    if (tasks.length === before) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }
    res.status(204).send();
  });

  return app;
}

module.exports = { createApp };
