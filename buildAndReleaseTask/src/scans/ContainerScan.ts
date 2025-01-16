import {
  ISharedDockerParameters,
  ISharedScanParameters,
  checkDeprecatedParameters,
  getSharedScanParameters,
} from "./sharedTaskParameters";
import * as Task from "azure-pipelines-task-lib/task";
import { LogLevel, ScanType, soosLogger } from "@soos-io/api-client";
import { mapToCliArguments, obfuscateProperties } from "../utils/Utilities";
import { runDockerCommandAndSetTaskStatus } from "../utils/TaskUtilities";

type IContainerScanParameters = ISharedScanParameters & {
  dockerImage: string;
  dockerImageTag: string;
  logLevel: LogLevel;
  otherOptions?: string;
  targetToScan: string;
};

type IContainerDockerArguments = ISharedDockerParameters & {
  otherOptions?: string;
};

class ContainerScan {
  static Name = "ContainerSecurityAnalysis";
  static Abbreviation = "CSA";
  static DisplayName = "Container Security Analysis (CSA)";

  private parameters: IContainerScanParameters;

  constructor() {
    const warn = checkDeprecatedParameters();
    if (warn !== null) {
      soosLogger.warn(warn);
    }

    const sharedParameters = getSharedScanParameters();

    this.parameters = {
      ...sharedParameters,
      dockerImage: "soosio/csa",
      dockerImageTag: Task.getInput("dockerImageTag") ?? "latest",
      otherOptions: Task.getInput("otherOptions"),
      outputDirectory: undefined,
      targetToScan: Task.getInputRequired("targetToScan"),
      workingDirectory:
        Task.getInput("workingDirectory") ??
        Task.getVariable("Build.SourcesDirectory") ??
        process.cwd(),
    };

    soosLogger.group("Parameters");
    soosLogger.info(JSON.stringify(obfuscateProperties(this.parameters, ["apiKey"])));
    soosLogger.groupEnd();
  }
  async run() {
    const args: IContainerDockerArguments = {
      apiKey: this.parameters.apiKey,
      appVersion: this.parameters.appVersion,
      apiURL: this.parameters.apiURL,
      branchName: this.parameters.branchName ?? undefined,
      branchURI: this.parameters.branchURI ?? undefined,
      buildURI: this.parameters.buildURI ?? undefined,
      buildVersion: this.parameters.buildVersion ?? undefined,
      clientId: this.parameters.clientId,
      commitHash: this.parameters.commitHash ?? undefined,
      integrationName: this.parameters.integrationName,
      integrationType: this.parameters.integrationType,
      logLevel: this.parameters.logLevel,
      onFailure: this.parameters.onFailure,
      operatingEnvironment: this.parameters.operatingEnvironment,
      exportFormat: this.parameters.exportFormat,
      exportFileType: this.parameters.exportFileType,
      otherOptions: this.parameters.otherOptions,
      projectName: this.parameters.projectName,
    };

    if (Task.getVariable("Agent.OS") !== "Linux") {
      throw new Error(
        "Running the SOOS CSA Scan requires a Linux agent. If a Windows agent is required for aspects of your build, split the CSA Scan task into a different Job within the pipeline.",
      );
    }

    const cliArguments = mapToCliArguments(args);

    const commandArguments = `--rm -v ${this.parameters.workingDirectory}:/usr/src/app/results:rw ${this.parameters.dockerImage}:${this.parameters.dockerImageTag} ${cliArguments} ${this.parameters.targetToScan}`;
    soosLogger.info(`Command Arguments: ${commandArguments}`);

    await runDockerCommandAndSetTaskStatus(ScanType.CSA, commandArguments);
  }
}

export default ContainerScan;
