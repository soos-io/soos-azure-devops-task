import { ensureEnumValue, ensureValue } from "./../utils/Utilities";
import * as Task from "azure-pipelines-task-lib/task";
import { getTaskOperatingSystemName, getTaskVersion } from "../utils/TaskUtilities";
import {
  AttributionFileTypeEnum,
  AttributionFormatEnum,
  LogLevel,
  OnFailure,
} from "@soos-io/api-client";

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
  outputDirectory?: string;
  exportFormat?: AttributionFormatEnum;
  exportFileType?: AttributionFileTypeEnum;
  projectName: string;
  workingDirectory?: string;
};

export const checkDeprecatedParameters = (): string | null => {
  // NOTE: use this method when deprecating parameters
  return null;
};

export const getSharedScanParameters = (): ISharedScanParameters => {
  // NOTE: only valid as the default option for these task inputs
  const exportFormatInput = Task.getInput("exportFormat") ?? "not_set";
  const exportFileTypeInput = Task.getInput("exportFileType") ?? "not_set";

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
    outputDirectory: undefined,
    onFailure: ensureEnumValue(OnFailure, Task.getInput("onFailure")) ?? OnFailure.Continue,
    exportFormat:
      exportFormatInput === "not_set"
        ? undefined
        : ensureEnumValue<AttributionFormatEnum>(AttributionFormatEnum, exportFormatInput),
    exportFileType:
      exportFileTypeInput === "not_set"
        ? undefined
        : ensureEnumValue<AttributionFileTypeEnum>(AttributionFileTypeEnum, exportFileTypeInput),
    projectName: ensureValue(
      Task.getInput("project") ??
        Task.getInput("projectName") ??
        Task.getVariable("Build.Repository.Name"),
      "projectName",
    ),
    workingDirectory: undefined,
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
  exportFormat?: AttributionFormatEnum;
  exportFileType?: AttributionFileTypeEnum;
  projectName: string;
};
