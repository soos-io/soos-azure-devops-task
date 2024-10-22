import * as Task from "azure-pipelines-task-lib/task";
import * as FileSystem from "fs";
import * as Path from "path";
import {
  ICreateScanRequestContributingDeveloperAudit,
  SOOS_CONSTANTS,
  ScanType,
  soosLogger,
} from "@soos-io/api-client";
import ContainerConnection from "azure-pipelines-tasks-docker-common/containerconnection";

export const getTaskVersion = (): string => {
  const taskJsonPath = Path.resolve(__dirname, "..", "..", "task.json");
  const version = JSON.parse(
    FileSystem.readFileSync(taskJsonPath, SOOS_CONSTANTS.FileUploads.Encoding),
  ).version;
  return `${version.Major}.${version.Minor}.${version.Patch}`;
};

export const getTaskOperatingSystemName = (): string => {
  switch (Task.getPlatform()) {
    case Task.Platform.Windows:
      return "Windows";
    case Task.Platform.MacOS:
      return "MacOS";
    case Task.Platform.Linux:
      return "Linux";
  }
};

export const tryAction = async <T>(actionName: string, action: () => Promise<T>): Promise<T> => {
  soosLogger.group(actionName);
  try {
    return await action();
  } catch (e: unknown) {
    Task.logIssue(
      Task.IssueType.Error,
      `Error occurred during '${actionName}'. See logs for details.`,
    );
    throw e;
  } finally {
    soosLogger.groupEnd();
  }
};

export const getContributingDeveloper = (): ICreateScanRequestContributingDeveloperAudit[] => {
  const buildReason = Task.getVariable("Build.Reason");
  const requestedFor = Task.getVariable("Build.RequestedFor");
  const sourceVersionAuthor = Task.getVariable("Build.SourceVersionAuthor");

  let contributingDeveloperId: string | undefined;
  let sourceName: string | undefined;

  if (buildReason === "IndividualCI" || buildReason === "BatchedCI") {
    contributingDeveloperId = sourceVersionAuthor;
    sourceName = "Build.SourceVersionAuthor";
  } else {
    contributingDeveloperId = requestedFor;
    sourceName = "Build.RequestedFor";
  }

  const audit: ICreateScanRequestContributingDeveloperAudit[] = [
    {
      source: "EnvironmentVariable",
      sourceName: sourceName ?? "Unknown",
      contributingDeveloperId: contributingDeveloperId ?? "Unknown",
    },
  ];

  return audit;
};

export const setTaskStatusFromCode = (code: number, scanType: ScanType): void => {
  if (code === 2) {
    Task.setResult(
      Task.TaskResult.SucceededWithIssues,
      `SOOS ${scanType} Analysis task finished with issues.  Check the log for more information.`,
    );
  } else if (code === 1) {
    Task.setResult(
      Task.TaskResult.Failed,
      `Failing the SOOS ${scanType} Analysis task. Check the log for more information.`,
    );
  }

  Task.setResult(Task.TaskResult.Succeeded, `SOOS ${scanType} Analysis Complete.`);
};

export const runDockerCommandAndSetTaskStatus = async (
  scanType: ScanType,
  commandArguments: string,
  exitCodeRegex: RegExp = /exit (\d+)/i,
): Promise<void> => {
  const connection = new ContainerConnection(true);
  const command = connection.createCommand();

  command.arg("run");
  command.line(commandArguments);

  let stdoutOutput = "";
  command.on("stdout", (data) => {
    stdoutOutput += data;
  });

  const handleExit = () => {
    const exitCodeMatch = stdoutOutput.match(exitCodeRegex);
    soosLogger.debug(`exitCodeMatch: ${exitCodeMatch}`);
    const exitCode = exitCodeMatch ? Number(exitCodeMatch[1]) : 0;
    setTaskStatusFromCode(exitCode, scanType);
  };

  await connection.execCommand(command).then(handleExit).catch(handleExit);
};
