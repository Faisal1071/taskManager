import * as taskService from "../src/services/taskService.js";
import { pool } from "../src/db.js";

jest.mock("../src/db.js", () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe("Task Service", () => {
  test("getAllTasks: sollte alle Tasks zurückgeben", async () => {
    pool.query.mockResolvedValue({
      rows: [{ id: 1, title: "Test", description: "Desc" }],
    });

    const result = await taskService.getAllTasks();

    expect(result).toEqual([{ id: 1, title: "Test", description: "Desc" }]);
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM tasks ORDER BY id DESC"
    );
  });

  test("createTask: neuer Task wird erstellt", async () => {
    pool.query.mockResolvedValue({
      rows: [{ id: 99, title: "Neu", description: "Test" }],
    });

    const task = await taskService.createTask("Neu", "Test");

    expect(task.id).toBe(99);
    expect(pool.query).toHaveBeenCalled();
  });

  test("deleteTask: Task wird gelöscht", async () => {
    pool.query.mockResolvedValue({
      rows: [{ id: 2 }],
    });

    const result = await taskService.deleteTask(2);

    expect(result.id).toBe(2);
  });

  test("updateTask: Task wird aktualisiert", async () => {
    pool.query.mockResolvedValue({
      rows: [{ id: 5, title: "Updated", description: "Changed" }],
    });

    const task = await taskService.updateTask(5, "Updated", "Changed");

    expect(task.title).toBe("Updated");
  });
});
