import { TaskMockRunner } from "azure-pipelines-task-lib/mock-run";
import * as path from "path";

const taskPath = path.join(__dirname, "../..", "task.js");

export function createTaskRunner(): TaskMockRunner {
  const taskRunner = new TaskMockRunner(taskPath);

  taskRunner.registerMockExport("getPlatform", () => {
    // https://github.com/microsoft/azure-pipelines-task-lib/issues/621#issuecomment-600578433
    return "Linux";
  });
  process.env["AGENT_OS"] = "Linux";

  // Default inputs
  taskRunner.setInput("integrationName", "mocha test run");
  taskRunner.setInput("baseUri", "https://dev-api.soos.io/api/");
  taskRunner.setInput("projectPath", "/home/vsts/work/1/s");
  taskRunner.setInput("workingDirectory", "/home/vsts/work/1/s");
  taskRunner.setInput("outputDirectory", "/output");

  return taskRunner;
}
