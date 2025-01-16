import * as Task from "azure-pipelines-task-lib/task";
import { ScanType, soosLogger } from "@soos-io/api-client";
import { getExcludeDirectories, mapToCliArguments, obfuscateProperties } from "../utils/Utilities";
import {
  ISharedScanParameters,
  checkDeprecatedParameters,
  getSharedScanParameters,
} from "./sharedTaskParameters";
import { setTaskStatusFromCode } from "../utils/TaskUtilities";

type ISbomScanScriptParameters = ISharedScanParameters & {
  directoriesToExclude: Array<string>;
  filesToExclude: Array<string>;
};

type ISbomScanParameters = ISbomScanScriptParameters & {
  sbomPath: string;
  scriptVersion: string;
};

class SbomScan {
  static Name = "SBOMSecurityAnalysis";
  static Abbreviation = "SBOM";
  static DisplayName = "SBOM Security Analysis (SBOM)";

  private parameters: ISbomScanParameters;

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
      filesToExclude: Task.getDelimitedInput("excludedFiles", ",").map((pm) => pm.trim()),
      outputDirectory:
        Task.getInput("outputDirectory") ??
        Task.getVariable("Build.SourcesDirectory") ??
        process.cwd(),
      sbomPath:
        Task.getInput("sbomPath") ?? Task.getVariable("Build.SourcesDirectory") ?? process.cwd(),
    };

    soosLogger.group("Parameters");
    soosLogger.debug(JSON.stringify(obfuscateProperties(this.parameters, ["apiKey"])));
    soosLogger.groupEnd();
  }

  async run() {
    const args: ISbomScanScriptParameters = {
      apiKey: this.parameters.apiKey,
      appVersion: this.parameters.appVersion,
      apiURL: this.parameters.apiURL ?? undefined,
      branchName: this.parameters.branchName ?? null,
      branchURI: this.parameters.branchURI ?? null,
      buildURI: this.parameters.buildURI ?? null,
      buildVersion: this.parameters.buildVersion ?? null,
      clientId: this.parameters.clientId,
      commitHash: this.parameters.commitHash ?? null,
      integrationName: this.parameters.integrationName,
      integrationType: this.parameters.integrationType,
      logLevel: this.parameters.logLevel,
      onFailure: this.parameters.onFailure,
      operatingEnvironment: this.parameters.operatingEnvironment,
      outputDirectory: this.parameters.outputDirectory,
      exportFormat: this.parameters.exportFormat,
      exportFileType: this.parameters.exportFileType,
      projectName: this.parameters.projectName,
      directoriesToExclude: this.parameters.directoriesToExclude,
      filesToExclude: this.parameters.filesToExclude,
      workingDirectory: undefined,
    };

    const cliArguments = mapToCliArguments(args);
    const exitCode = await this.runSbom(
      this.parameters.scriptVersion,
      `${cliArguments} ${this.parameters.sbomPath}`,
    );
    setTaskStatusFromCode(exitCode, ScanType.SBOM);
  }

  async runSbom(scriptVersion: string, args: string): Promise<number> {
    return new Promise(async (resolve) => {
      await Task.execAsync("npm", `install --prefix ./soos @soos-io/soos-sbom@${scriptVersion}`, {
        shell: true,
      });
      await Task.execAsync("node", `./soos/node_modules/@soos-io/soos-sbom/bin/index.js ${args}`, {
        shell: true,
        ignoreReturnCode: true,
      }).then((code) => {
        return resolve(code);
      });
    });
  }
}

export default SbomScan;
