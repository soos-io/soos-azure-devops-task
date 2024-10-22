import {
  checkDeprecatedParameters,
  getSharedScanParameters,
  ISharedDockerParameters,
  ISharedScanParameters,
} from "./sharedTaskParameters";
import * as Task from "azure-pipelines-task-lib/task";
import {
  ensureEnumValue,
  ensureValue,
  isNil,
  mapToCliArguments,
  obfuscateProperties,
} from "../utils/Utilities";
import { ScanType, soosLogger } from "@soos-io/api-client";
import { runDockerCommandAndSetTaskStatus } from "../utils/TaskUtilities";

enum ScanModeEnum {
  Baseline = "baseline",
  Full = "fullscan",
  Api = "apiscan",
  Active = "activescan",
}

enum ApiFormatEnum {
  OpenApi = "openapi",
  SOAP = "soap",
  GraphQL = "graphql",
}

enum AuthSubmitActionEnum {
  NotSet = "not_set",
  Click = "click",
  Submit = "submit",
}

enum AuthFormTypeEnum {
  NotSet = "not_set",
  Simple = "simple",
  WaitForPassword = "wait_for_password",
  MultiPage = "multi_page",
}

type IDastScanParameters = ISharedScanParameters & {
  apiFormat?: ApiFormatEnum;
  authDelayTime?: number;
  authFormType?: AuthFormTypeEnum;
  authLoginURL?: string;
  authPasswordField?: string;
  authPassword?: string;
  authSecondSubmitField?: string;
  authSubmitAction?: AuthSubmitActionEnum;
  authSubmitField?: string;
  authUsername?: string;
  authUsernameField?: string;
  authVerificationURL?: string;
  bearerToken?: string;
  contextFile?: string;
  debug?: boolean;
  disableRules?: string;
  dockerImage: string;
  dockerImageTag: string;
  oauthParameters?: string;
  oauthTokenUrl?: string;
  otherOptions?: string;
  requestHeaders?: string;
  scanDurationInMinutes?: number;
  scanMode: ScanModeEnum;
  targetUri: string;
  useAjaxSpider?: boolean;
  zapOptions?: string;
};

type IDastDockerContainerArguments = ISharedDockerParameters & {
  ajaxSpider?: boolean;
  apiScanFormat?: ApiFormatEnum;
  authDelayTime?: number;
  authFormType?: AuthFormTypeEnum;
  authLoginURL?: string;
  authPasswordField?: string;
  authPassword?: string;
  authSecondSubmitField?: string;
  authSubmitAction?: AuthSubmitActionEnum;
  authSubmitField?: string;
  authUsername?: string;
  authUsernameField?: string;
  authVerificationURL?: string;
  bearerToken?: string;
  contextFile?: string;
  debug?: boolean;
  disableRules?: string;
  fullScanMinutes?: number;
  oauthParameters?: string;
  oauthTokenUrl?: string;
  requestHeaders?: string;
  scanMode: ScanModeEnum;
  zapOptions?: string;
  otherOptions?: string;
};

class DastScan {
  static Name = "DynamicApplicationSecurityTesting";
  static Abbreviation = "DAST";
  static DisplayName = "Dynamic Application Security Testing (DAST)";

  private parameters: IDastScanParameters;

  constructor() {
    const warn = checkDeprecatedParameters();
    if (warn !== null) {
      soosLogger.warn(warn);
    }

    const sharedParameters = getSharedScanParameters();

    const scanDurationInMinutes = Task.getInput("scanDurationInMinutes");
    const authDelayTime = Task.getInput("authDelayTime");

    this.parameters = {
      ...sharedParameters,
      apiFormat: !isNil(Task.getInput("apiFormat"))
        ? ensureEnumValue(ApiFormatEnum, Task.getInput("apiFormat"))
        : undefined,
      authDelayTime: isNil(authDelayTime) ? undefined : Number.parseInt(authDelayTime, 10),
      authFormType:
        !isNil(Task.getInput("authFormType")) &&
        Task.getInput("authFormType") !== AuthFormTypeEnum.NotSet
          ? ensureEnumValue(AuthFormTypeEnum, Task.getInput("authFormType"))
          : undefined,
      authLoginURL: Task.getInput("authLoginURL"),
      authPassword: Task.getInput("authPassword"),
      authPasswordField: Task.getInput("authPasswordField"),
      authSecondSubmitField: Task.getInput("authSecondSubmitField"),
      authSubmitAction:
        !isNil(Task.getInput("authSubmitAction")) &&
        Task.getInput("authSubmitAction") !== AuthSubmitActionEnum.NotSet
          ? ensureEnumValue(AuthSubmitActionEnum, Task.getInput("authSubmitAction"))
          : undefined,
      authSubmitField: Task.getInput("authSubmitField"),
      authUsername: Task.getInput("authUsername"),
      authUsernameField: Task.getInput("authUsernameField"),
      authVerificationURL: Task.getInput("authVerificationURL"),
      apiURL: Task.getInput("baseUri") ?? "https://api.soos.io/api/",
      bearerToken: Task.getInput("bearerToken"),
      contextFile: Task.getInput("contextFile"),
      debug: Task.getBoolInput("debug"),
      disableRules: Task.getInput("disableRules"),
      dockerImage: "soosio/dast",
      dockerImageTag: Task.getInput("dockerImageTag") ?? "latest",
      oauthTokenUrl: Task.getInput("oauthTokenUrl"),
      otherOptions: Task.getInput("otherOptions"),
      requestHeaders: Task.getInput("requestHeaders"),
      scanDurationInMinutes: isNil(scanDurationInMinutes)
        ? undefined
        : Number.parseInt(scanDurationInMinutes, 10),
      scanMode: ensureEnumValue(ScanModeEnum, Task.getInput("scanMode")) ?? ScanModeEnum.Baseline,
      targetUri: ensureValue(Task.getInput("targetUri", true), "targetUri"),
      useAjaxSpider: Task.getBoolInput("useAjaxSpider") ? true : undefined,
      workingDirectory:
        Task.getInput("workingDirectory") ??
        Task.getVariable("Build.SourcesDirectory") ??
        process.cwd(),
    };

    soosLogger.group("Parameters");
    soosLogger.info(
      JSON.stringify(
        obfuscateProperties(this.parameters, ["apiKey", "authPassword", "bearerToken"]),
      ),
    );
    soosLogger.groupEnd();
  }

  async run() {
    const args: IDastDockerContainerArguments = {
      apiKey: this.parameters.apiKey,
      clientId: this.parameters.clientId,
      projectName: this.parameters.projectName,
      scanMode: this.parameters.scanMode,
      onFailure: this.parameters.onFailure,
      apiURL: this.parameters.apiURL,
      ajaxSpider: this.parameters.useAjaxSpider,
      contextFile: this.parameters.contextFile,
      disableRules: this.parameters.disableRules,
      fullScanMinutes: this.parameters.scanDurationInMinutes,
      apiScanFormat: this.parameters.apiFormat,
      commitHash: this.parameters.commitHash ?? undefined,
      branchName: this.parameters.branchName ?? undefined,
      buildVersion: this.parameters.buildVersion ?? undefined,
      buildURI: this.parameters.buildURI ?? undefined,
      branchURI: this.parameters.branchURI ?? undefined,
      integrationType: this.parameters.integrationType,
      integrationName: this.parameters.integrationName,
      operatingEnvironment: this.parameters.operatingEnvironment,
      appVersion: this.parameters.appVersion,
      logLevel: this.parameters.logLevel,
      debug: this.parameters.debug,
      outputFormat: this.parameters.outputFormat?.toLocaleLowerCase() ?? undefined,
      requestHeaders: this.parameters.requestHeaders,
      bearerToken: this.parameters.bearerToken,
      authUsername: this.parameters.authUsername,
      authPassword: this.parameters.authPassword,
      authLoginURL: this.parameters.authLoginURL,
      authUsernameField: this.parameters.authUsernameField,
      authPasswordField: this.parameters.authPasswordField,
      authSubmitField: this.parameters.authSubmitField,
      authSecondSubmitField: this.parameters.authSecondSubmitField,
      authFormType: this.parameters.authFormType,
      authDelayTime: this.parameters.authDelayTime,
      authSubmitAction: this.parameters.authSubmitAction,
      authVerificationURL: this.parameters.authVerificationURL,
      oauthTokenUrl: this.parameters.oauthTokenUrl,
      oauthParameters: this.parameters.oauthParameters,
      zapOptions: this.parameters.zapOptions,
      otherOptions: this.parameters.otherOptions,
    };

    if (Task.getVariable("Agent.OS") !== "Linux") {
      throw new Error(
        "Running the SOOS DAST Scan requires a Linux agent. If a Windows agent is required for aspects of your build, split the DAST Scan task into a different Job within the pipeline.",
      );
    }

    const cliArguments = mapToCliArguments(args);

    const commandArguments = `--rm -v ${this.parameters.workingDirectory}:/zap/wrk:rw ${this.parameters.dockerImage}:${this.parameters.dockerImageTag} ${cliArguments} ${this.parameters.targetUri}`;
    soosLogger.info(`Command Arguments: ${commandArguments}`);

    await runDockerCommandAndSetTaskStatus(ScanType.DAST, commandArguments);
  }
}

export default DastScan;
