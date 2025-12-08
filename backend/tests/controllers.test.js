import * as controller from "../src/controllers/taskController.js";
import * as service from "../src/services/taskService.js";

jest.mock("../src/services/taskService.js");

describe("Task Controller", () => {
  const mockReq = (data = {}) => data;
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();
    return res;
  };

  test("getTasks liefert Taskliste", async () => {
    service.getAllTasks.mockResolvedValue([{ id: 1 }]);

    const req = mockReq();
    const res = mockRes();

    await controller.getTasks(req, res);

    expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
  });

  test("addTask erstellt neuen Task", async () => {
    service.createTask.mockResolvedValue({ id: 10, title: "X" });

    const req = mockReq({ body: { title: "X", description: "" } });
    const res = mockRes();

    await controller.addTask(req, res);

    expect(res.json).toHaveBeenCalledWith({ id: 10, title: "X" });
  });

  test("removeTask löscht Task", async () => {
    service.deleteTask.mockResolvedValue({ id: 3 });

    const req = mockReq({ params: { id: 3 } });
    const res = mockRes();

    await controller.removeTask(req, res);

    expect(res.json).toHaveBeenCalledWith({ id: 3 });
  });

  test("editTask updated Task", async () => {
    service.updateTask.mockResolvedValue({ id: 4, title: "Neu" });

    const req = mockReq({
      params: { id: 4 },
      body: { title: "Neu", description: "XX" },
    });
    const res = mockRes();

    await controller.editTask(req, res);

    expect(res.json).toHaveBeenCalledWith({ id: 4, title: "Neu" });
  });
});
