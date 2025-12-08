// tests/routes.test.js
import request from "supertest";
import express from "express";
import taskRoutes from "../src/routes/taskRoutes.js";
import * as service from "../src/services/taskService.js";

const app = express();
app.use(express.json());
app.use("/tasks", taskRoutes);

jest.mock("../src/services/taskService.js");

describe("Task Routes", () => {
  test("GET /tasks liefert Taskliste", async () => {
    service.getAllTasks.mockResolvedValue([{ id: 1 }]);
    const res = await request(app).get("/tasks");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1 }]);
  });

  test("POST /tasks erstellt Task", async () => {
    service.createTask.mockResolvedValue({ id: 22 });
    const res = await request(app).post("/tasks").send({ title: "Test Task" });
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(22);
  });

  test("DELETE /tasks/:id löscht Task", async () => {
    service.deleteTask.mockResolvedValue({ id: 3 });
    const res = await request(app).delete("/tasks/3");
    expect(res.status).toBe(200);
  });

  test("PUT /tasks/:id updated Task", async () => {
    service.updateTask.mockResolvedValue({ id: 5, title: "UP" });
    const res = await request(app).put("/tasks/5").send({ title: "UP" });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("UP");
  });
});
