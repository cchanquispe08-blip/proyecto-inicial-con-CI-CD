const request = require("supertest");
const { createApp } = require("../src/app");

describe("API de tareas", () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  test("GET /health responde 200 con status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  test("GET /tasks devuelve la tarea inicial", async () => {
    const res = await request(app).get("/tasks");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe("Estudiar CI/CD");
  });

  test("POST /tasks crea una nueva tarea", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ name: "Configurar workflow", priority: "media" });
    expect(res.status).toBe(201);
    expect(res.body.id).toBe(2);
    expect(res.body.completed).toBe(false);
  });

  test("POST /tasks sin name devuelve 400", async () => {
    const res = await request(app).post("/tasks").send({ priority: "alta" });
    expect(res.status).toBe(400);
  });

  test("PATCH /tasks/:id/complete marca la tarea como completada", async () => {
    const res = await request(app).patch("/tasks/1/complete");
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  test("PATCH sobre un ID inexistente devuelve 404", async () => {
    const res = await request(app).patch("/tasks/999/complete");
    expect(res.status).toBe(404);
  });

  test("DELETE /tasks/:id elimina la tarea", async () => {
    const del = await request(app).delete("/tasks/1");
    expect(del.status).toBe(204);
    const list = await request(app).get("/tasks");
    expect(list.body).toHaveLength(0);
  });
});
