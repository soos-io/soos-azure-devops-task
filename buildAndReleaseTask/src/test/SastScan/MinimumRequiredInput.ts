import { TaskLibAnswerExecResult } from "azure-pipelines-task-lib/mock-answer";
import TaskRunner from "../mocks/TaskRunner";

TaskRunner.setInput("clientId", "clientid123");
TaskRunner.setInput("apiKey", "apikey123");
TaskRunner.setInput("projectName", "test-sast-azuretask");
TaskRunner.setInput("scanType", "SAST");

const exec: Record<string, TaskLibAnswerExecResult> = {};
exec["npm install --prefix ./soos @soos-io/soos-sast@latest"] = {
  code: 0,
  stdout: "run `npm fund` for details",
};
exec[
  `node ./soos/node_modules/@soos-io/soos-sast/bin/index.js --apiKey="apikey123" --appVersion="0.0.0" --apiURL="https://dev-api.soos.io/api/" --clientId="clientid123" --directoriesToExclude="**/node_modules/**,**/bin/**,**/obj/**,**/lib/**,**/soos/**" --filesToExclude="" --integrationName="AzureDevOps" --integrationType="Plugin" --logLevel="INFO" --onFailure="continue_on_failure" --projectName="test-sast-azuretask" --sourceCodePath="/home/vsts/work/1/s"`
] = {
  code: 0,
  stdout: "SOOS SAST Analysis successful",
};
TaskRunner.setAnswers({
  which: {
    npm: "npm",
    node: "node",
  },
  exist: {
    npm: true,
    node: true,
  },
  checkPath: {
    npm: true,
    node: true,
  },
  exec,
});

TaskRunner.run();
