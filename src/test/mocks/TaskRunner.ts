import { TaskMockRunner } from "azure-pipelines-task-lib/mock-run";
import * as path from "path";

const taskPath = path.join(__dirname, "../..", "task.js");
const TaskRunner = new TaskMockRunner(taskPath);

TaskRunner.registerMockExport("getPlatform", () => {
  // https://github.com/microsoft/azure-pipelines-task-lib/issues/621#issuecomment-600578433
  return "Linux";
});
process.env["AGENT_OS"] = "Linux";

// Default inputs
TaskRunner.setInput("integrationName", "mocha test run");
TaskRunner.setInput("baseUri", "https://dev-api.soos.io/api/");
TaskRunner.setInput("projectPath", "/home/vsts/work/1/s");
TaskRunner.setInput("workingDirectory", "/home/vsts/work/1/s");

export default TaskRunner;
