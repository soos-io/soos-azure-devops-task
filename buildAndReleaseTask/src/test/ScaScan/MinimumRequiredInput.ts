import { TaskLibAnswerExecResult } from "azure-pipelines-task-lib/mock-answer";
import TaskRunner from "../mocks/TaskRunner";

TaskRunner.setInput("clientId", "clientid123");
TaskRunner.setInput("apiKey", "apikey123");
TaskRunner.setInput("scanType", "SCA");
TaskRunner.setInput("projectName", "test-sca-azuretask");
TaskRunner.setInput("projectPath", "C:\\temp\\");
TaskRunner.setInput("onFailure", "continue_on_failure");

const exec: Record<string, TaskLibAnswerExecResult> = {};
exec["npm install --prefix ./soos @soos-io/soos-sca@latest"] = {
  code: 0,
  stdout: "run `npm fund` for details",
};
exec[
  `node ./soos/node_modules/@soos-io/soos-sca/bin/index.js --apiKey="apikey123" --appVersion="0.0.0" --apiURL="https://dev-api.soos.io/api/" --clientId="clientid123" --contributingDeveloperId="Unknown" --contributingDeveloperSource="EnvironmentVariable" --contributingDeveloperSourceName="Build.RequestedFor" --directoriesToExclude="**/node_modules/**,**/bin/**,**/obj/**,**/lib/**,**/soos/**" --filesToExclude="" --fileMatchType="Manifest" --integrationName="AzureDevOps" --integrationType="Plugin" --logLevel="INFO" --onFailure="continue_on_failure" --outputDirectory="/output" --packageManagers="" --projectName="test-sca-azuretask" --sourceCodePath="C:\\temp\\"`
] = {
  code: 0,
  stdout: "SOOS SCA Analysis successful",
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
