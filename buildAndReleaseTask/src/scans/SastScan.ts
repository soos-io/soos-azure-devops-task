import * as Task from "azure-pipelines-task-lib/task";
import { OnFailure, ScanType, soosLogger } from "@soos-io/api-client";
import { getExcludeDirectories, mapToCliArguments, obfuscateProperties } from "../utils/Utilities";
import {
  ISharedScanParameters,
  checkDeprecatedParameters,
  getSharedScanParameters,
} from "./sharedTaskParameters";
import { setTaskStatusFromCode } from "../utils/TaskUtilities";

type ISastScanScriptParameters = ISharedScanParameters & {
  directoriesToExclude: Array<string>;
  filesToExclude: Array<string>;
  onFailure: OnFailure;
  sourceCodePath: string;
};

type ISastScanParameters = ISastScanScriptParameters & {
  scriptVersion: string;
};

class SastScan {
  static Name = "StaticApplicationSecurityTesting";
  static Abbreviation = "SAST";
  static DisplayName = "Static Application Security Testing (SAST)";

  private parameters: ISastScanParameters;

  constructor() {
    const warn = checkDeprecatedParameters();
    if (warn !== null) {
      soosLogger.warn(warn);
    }

    const sharedParameters = getSharedScanParameters();

    this.parameters = {
      ...sharedParameters,
      scriptVersion: Task.getInput("scriptVersion") ?? "latest",
      directoriesToExclude: getExcludeDirectories(
        Task.getDelimitedInput("excludedDirectories", ","),
      ),
      filesToExclude: Task.getDelimitedInput("excludedFiles", ",").map((d) => d.trim()),
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
    const args: ISastScanScriptParameters = {
      apiKey: this.parameters.apiKey,
      appVersion: this.parameters.appVersion,
      apiURL: this.parameters.apiURL,
      branchName: this.parameters.branchName,
      branchURI: this.parameters.branchURI,
      buildURI: this.parameters.buildURI,
      buildVersion: this.parameters.buildVersion,
      clientId: this.parameters.clientId,
      commitHash: this.parameters.commitHash,
      directoriesToExclude: this.parameters.directoriesToExclude,
      filesToExclude: this.parameters.filesToExclude,
      integrationName: this.parameters.integrationName,
      integrationType: this.parameters.integrationType,
      logLevel: this.parameters.logLevel,
      onFailure: this.parameters.onFailure,
      operatingEnvironment: this.parameters.operatingEnvironment,
      exportFormat: this.parameters.exportFormat,
      exportFileType: this.parameters.exportFileType,
      projectName: this.parameters.projectName,
      sourceCodePath: this.parameters.sourceCodePath,
      workingDirectory: undefined,
    };

    const cliArguments = mapToCliArguments(args);
    const exitCode = await this.runSast(this.parameters.scriptVersion, `${cliArguments}`);
    setTaskStatusFromCode(exitCode, ScanType.SAST);
  }

  async runSast(scriptVersion: string, args: string): Promise<number> {
    return new Promise(async (resolve) => {
      await Task.execAsync("npm", `install --prefix ./soos @soos-io/soos-sast@${scriptVersion}`, {
        shell: true,
      });
      await Task.execAsync("node", `./soos/node_modules/@soos-io/soos-sast/bin/index.js ${args}`, {
        shell: true,
        ignoreReturnCode: true,
      }).then((code) => {
        return resolve(code);
      });
    });
  }
}

export default SastScan;
