import { ensureEnumValue, ensureValue } from "./../utils/Utilities";
import * as Task from "azure-pipelines-task-lib/task";
import { getTaskOperatingSystemName, getTaskVersion } from "../utils/TaskUtilities";
import { OutputFormat, LogLevel, OnFailure } from "@soos-io/api-client";

export type ISharedScanParameters = {
  apiKey: string;
  appVersion: string;
  apiURL: string;
  branchName: string | null;
  branchURI: string | null;
  buildURI: string | null;
  buildVersion: string | null;
  clientId: string;
  commitHash: string | null;
  integrationName: string;
  integrationType: string;
  logLevel: LogLevel;
  onFailure: OnFailure;
  operatingEnvironment: string;
  outputFormat: OutputFormat | undefined;
  projectName: string;
  workingDirectory?: string;
};

export const checkDeprecatedParameters = (): string | null => {
  // NOTE: use this method when deprecating parmaters
  return null;
};

export const getSharedScanParameters = (): ISharedScanParameters => {
  const outputFormatInput = Task.getInput("outputFormat") ?? "not_set"; // NOTE: only valid as the default option for the task input
  return {
    apiKey: Task.getInputRequired("apiKey"),
    appVersion: getTaskVersion(),
    apiURL: Task.getInput("baseUri") ?? "https://api.soos.io/api/",
    branchName:
      Task.getInput("branch") ??
      Task.getVariable("System.PullRequest.SourceBranch") ??
      Task.getVariable("Build.SourceBranch") ??
      null,
    branchURI: Task.getInput("branchUri") ?? Task.getVariable("Build.Repository.Uri") ?? null,
    buildURI: Task.getInput("buildUri") ?? Task.getVariable("Build.BuildUri") ?? null,
    buildVersion: Task.getInput("buildVersion") ?? null,
    clientId: Task.getInputRequired("clientId"),
    commitHash: Task.getInput("commitHash") ?? Task.getVariable("Build.SourceVersion") ?? null,
    integrationName: "AzureDevOps",
    integrationType: "Plugin",
    logLevel: ensureEnumValue<LogLevel>(LogLevel, Task.getInput("logLevel")) ?? LogLevel.INFO,
    operatingEnvironment: getTaskOperatingSystemName(),
    onFailure: ensureEnumValue(OnFailure, Task.getInput("onFailure")) ?? OnFailure.Continue,
    outputFormat:
      outputFormatInput === "not_set"
        ? undefined
        : ensureEnumValue<OutputFormat>(OutputFormat, outputFormatInput),
    projectName: ensureValue(
      Task.getInput("project") ??
        Task.getInput("projectName") ??
        Task.getVariable("Build.Repository.Name"),
      "projectName",
    ),
  };
};

export type ISharedDockerParameters = {
  apiKey: string;
  apiURL: string;
  appVersion: string;
  branchName?: string;
  branchURI?: string;
  buildURI?: string;
  buildVersion?: string;
  clientId: string;
  commitHash?: string;
  integrationName: string;
  integrationType: string;
  logLevel: LogLevel;
  onFailure?: OnFailure;
  operatingEnvironment: string;
  outputFormat?: string;
  projectName: string;
};
