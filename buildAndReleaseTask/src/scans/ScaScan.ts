import * as Task from "azure-pipelines-task-lib/task";
import {
  ensureEnumValue,
  getExcludeDirectories,
  mapToCliArguments,
  obfuscateProperties,
} from "../utils/Utilities";
import {
  checkDeprecatedParameters,
  getSharedScanParameters,
  ISharedScanParameters,
} from "./sharedTaskParameters";
import { FileMatchTypeEnum, ScanType, soosLogger } from "@soos-io/api-client";
import { getContributingDeveloper, setTaskStatusFromCode } from "../utils/TaskUtilities";

type IScaScanScriptParameters = ISharedScanParameters & {
  contributingDeveloperId?: string;
  contributingDeveloperSource?: string;
  contributingDeveloperSourceName?: string;
  directoriesToExclude: Array<string>;
  filesToExclude: Array<string>;
  sourceCodePath: string;
  packageManagers: Array<string>;
  fileMatchType: FileMatchTypeEnum;
};

type IScaScanParameters = IScaScanScriptParameters & {
  scriptVersion: string;
};

class ScaScan {
  static Name = "SoftwareCompositionAnalysis";
  static Abbreviation = "SCA";
  static DisplayName = "Software Composition Analysis (SCA)";

  private parameters: IScaScanParameters;

  constructor() {
    const warn = checkDeprecatedParameters();
    if (warn !== null) {
      soosLogger.warn(warn);
    }

    const sharedParameters = getSharedScanParameters();

    const contributingDeveloper = getContributingDeveloper();

    this.parameters = {
      ...sharedParameters,
      scriptVersion: Task.getInput("scriptVersion") ?? "latest",
      contributingDeveloperId: contributingDeveloper.at(0)?.contributingDeveloperId ?? undefined,
      contributingDeveloperSource: contributingDeveloper.at(0)?.source ?? undefined,
      contributingDeveloperSourceName: contributingDeveloper.at(0)?.sourceName ?? undefined,
      directoriesToExclude: getExcludeDirectories(
        Task.getDelimitedInput("excludedDirectories", ","),
      ),
      filesToExclude: Task.getDelimitedInput("excludedFiles", ",").map((pm) => pm.trim()),
      outputDirectory:
        Task.getInput("outputDirectory") ??
        Task.getVariable("Build.SourcesDirectory") ??
        process.cwd(),
      packageManagers: Task.getDelimitedInput("packageManagers", ",").map((pm) => pm.trim()),
      fileMatchType:
        ensureEnumValue<FileMatchTypeEnum>(FileMatchTypeEnum, Task.getInput("fileMatchType")) ??
        FileMatchTypeEnum.Manifest,
      sourceCodePath:
        Task.getInput("path") ??
        Task.getInput("projectPath") ??
        Task.getVariable("Build.SourcesDirectory") ??
        ".",
    };

    soosLogger.group("Parameters");
    soosLogger.debug(JSON.stringify(obfuscateProperties(this.parameters, ["apiKey"])));
    soosLogger.groupEnd();
  }

  async run() {
    const args: IScaScanScriptParameters = {
      apiKey: this.parameters.apiKey,
      appVersion: this.parameters.appVersion,
      apiURL: this.parameters.apiURL,
      branchName: this.parameters.branchName,
      branchURI: this.parameters.branchURI,
      buildURI: this.parameters.buildURI,
      buildVersion: this.parameters.buildVersion,
      clientId: this.parameters.clientId,
      commitHash: this.parameters.commitHash,
      contributingDeveloperId: this.parameters.contributingDeveloperId,
      contributingDeveloperSource: this.parameters.contributingDeveloperSource,
      contributingDeveloperSourceName: this.parameters.contributingDeveloperSourceName,
      directoriesToExclude: this.parameters.directoriesToExclude,
      filesToExclude: this.parameters.filesToExclude,
      fileMatchType: this.parameters.fileMatchType,
      integrationName: this.parameters.integrationName,
      integrationType: this.parameters.integrationType,
      logLevel: this.parameters.logLevel,
      onFailure: this.parameters.onFailure,
      operatingEnvironment: this.parameters.operatingEnvironment,
      outputDirectory: this.parameters.outputDirectory,
      exportFormat: this.parameters.exportFormat,
      exportFileType: this.parameters.exportFileType,
      packageManagers: this.parameters.packageManagers,
      projectName: this.parameters.projectName,
      sourceCodePath: this.parameters.sourceCodePath,
      workingDirectory: undefined,
    };

    const cliArguments = mapToCliArguments(args);
    const exitCode = await this.runSca(this.parameters.scriptVersion, `${cliArguments}`);
    setTaskStatusFromCode(exitCode, ScanType.SCA);
  }

  async runSca(scriptVersion: string, args: string): Promise<number> {
    await Task.execAsync("npm", `install --prefix ./soos @soos-io/soos-sca@${scriptVersion}`, {
      shell: true,
    });
    const exitCode = await Task.execAsync(
      "node",
      `./soos/node_modules/@soos-io/soos-sca/bin/index.js ${args}`,
      {
        shell: true,
        ignoreReturnCode: true,
      },
    );
    return exitCode;
  }
}

export default ScaScan;
