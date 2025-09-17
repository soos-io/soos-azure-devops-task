# [About SOOS](https://soos.io/)

SOOS is an independent software security company, located in Winooski, VT USA, building security software for your team. [SOOS, Software security, simplified](https://soos.io).

Use SOOS to scan your software for [vulnerabilities](https://app.soos.io/research/vulnerabilities) and [open source license](https://app.soos.io/research/licenses) issues with [SOOS Core SCA](https://soos.io/products/sca). [Generate and ingest SBOMs](https://soos.io/products/sbom-manager). [Export reports](https://kb.soos.io/project-exports-and-reports) to industry standards. Govern your open source dependencies. Run the [SOOS DAST vulnerability scanner](https://soos.io/products/dast) against your web apps or APIs. [Scan your Docker containers](https://soos.io/products/containers) for vulnerabilities. Check your source code for issues with [SAST Analysis](https://soos.io/products/sast).

[Demo SOOS](https://app.soos.io/demo) or [Register for a Free Trial](https://app.soos.io/register).

If you maintain an Open Source project, sign up for the Free as in Beer [SOOS Community Edition](https://soos.io/products/community-edition).

## SOOS Azure DevOps Task

This SOOS Azure DevOps Security Analysis Task is available on the [Azure DevOps Microsoft VisualStudio Marketplace](https://marketplace.visualstudio.com/azuredevops/)

## SOOS Badge Status
[![Dependency Vulnerabilities](https://img.shields.io/endpoint?url=https%3A%2F%2Fapi-hooks.soos.io%2Fapi%2Fshieldsio-badges%3FbadgeType%3DDependencyVulnerabilities%26pid%3Dwy6h8u8ov%26branchName%3Dmain)](https://app.soos.io)
[![Out Of Date Dependencies](https://img.shields.io/endpoint?url=https%3A%2F%2Fapi-hooks.soos.io%2Fapi%2Fshieldsio-badges%3FbadgeType%3DOutOfDateDependencies%26pid%3Dwy6h8u8ov%26branchName%3Dmain)](https://app.soos.io)

## Parameters

Here is a **README.md** table for your task inputs, organized by parameter group. Each table includes the parameter name, description, and any default/initial value.

---

### **General Parameters**

| Parameter Name | Description | Default/Initial Value |
|----------------|-------------|-----------------------|
| `apiKey` | SOOS API Key | Required |
| `clientId` | SOOS Client ID | Required |
| `scanType` | The type of scan to run. Options: SCA, DAST, CSA, SBOM, SAST | `SCA` |
| `projectName` | The name of the project (Defaults: `Build.Repository.Name`) | N/A |
| `branch` | Branch name (Defaults: `System.PullRequest.SourceBranch` or `Build.SourceBranch`) | N/A |
| `branchUri` | Link to the current branch (Defaults: `Build.Repository.Uri`) | N/A |
| `commitHash` | Commit hash (Defaults: `Build.SourceVersion`) | N/A |
| `buildVersion` | Current build version | N/A |
| `buildUri` | Link to the current build (Defaults: `Build.BuildUri`) | N/A |
| `logLevel` | Minimum log level. Options: DEBUG, INFO, WARN, FAIL, ERROR | `INFO` |
| `onFailure` | Action when scan fails. Options: continue_on_failure, fail_the_build | `continue_on_failure` |
| `exportFormat` | Write the scan result to this file format. Options: `<Not Set>`, CsafVex, CycloneDx, Sarif, Spdx, SoosIssues, SoosLicenses, SoosPackages, SoosVulnerabilities | `not_set` |
| `exportFileType` | Write the scan result to this file type (when used with exportFormat). Options: `<Not Set>`, Csv, Html, Json, Text, Xml  | `not_set` |

---

### **SCA Parameters**

| Parameter Name | Description | Default/Initial Value |
|----------------|-------------|-----------------------|
| `packageManagers` | Package managers to include when searching for manifest files | Multi-select options available |
| `projectPath` | Relative path to the project root (Defaults: `Build.SourcesDirectory`) | N/A |
| `excludedDirectories` | Directory glob patterns to exclude | `""` |
| `excludedFiles` | File glob patterns to exclude | `""` |
| `fileMatchType` | The method to use to locate files for scanning, looking for manifest files and/or files to hash. | `"Manifest"` |
| `outputDirectory` | Export file path (Defaults: `Build.SourcesDirectory`) | N/A |

---

### **SAST Parameters**

| Parameter Name | Description | Default/Initial Value |
|----------------|-------------|-----------------------|
| `projectPath` | Relative path to the project root (Defaults: `Build.SourcesDirectory`) | N/A |
| `excludedDirectories` | Directory glob patterns to exclude | `""` |
| `excludedFiles` | File glob patterns to exclude | `""` |
| `outputDirectory` | Export file path (Defaults: `Build.SourcesDirectory`) | N/A |

---

### **DAST Parameters**

| Parameter Name | Description | Default/Initial Value |
|----------------|-------------|-----------------------|
| `targetUri` | Target URL or path to spec file | Required |
| `scanMode` | Scan mode. Options: Baseline, Full, API, Active | N/A |
| `apiFormat` | API format (Visible if `scanMode` is `apiscan`) | Options: OpenAPI, SOAP, GraphQL |
| `useAjaxSpider` | Use the AJAX spider for JavaScript-heavy apps | `false` |
| `scanDurationInMinutes` | Duration in minutes for spider (Visible if `scanMode` is `fullscan`) | N/A |
| `disableRules` | ZAP rule IDs to disable | N/A |
| `debug` | Enable ZAP debug logging | `false` |
| `contextFile` | Path to the context file | N/A |
| `requestHeaders` | Request headers to include in every request | N/A |
| `bearerToken` | Bearer token for authentication | N/A |
| `authFormType` | Type of authentication form | Options: Simple, Wait for Password, Multi-Page |
| `authUsername` | Username for authentication | N/A |
| `authPassword` | Password for authentication | N/A |
| `authLoginURL` | Authentication login URL | N/A |
| `authUsernameField` | Username input ID | N/A |
| `authPasswordField` | Password input ID | N/A |
| `authSubmitField` | Submit button ID | N/A |
| `authSecondSubmitField` | Second submit button ID (for multi-page forms) | N/A |
| `authSubmitAction` | Submit button action | Options: Click, Submit |
| `authDelayTime` | Delay time (seconds) after form actions | N/A |
| `authVerificationURL` | URL to verify authentication success | N/A |
| `otherOptions` | Additional options for ZAP or Syft | N/A |
| `workingDirectory` | Working directory for container (Defaults: `Build.SourcesDirectory`) | N/A |
| `zapOptions` | Additional ZAP command-line options | N/A |

---

### **CSA Parameters**

| Parameter Name | Description | Default/Initial Value |
|----------------|-------------|-----------------------|
| `otherOptions` | Additional options for ZAP or Syft | N/A |
| `otherDockerRunOptions` | Other Options to pass to the Docker run command. | N/A |
| `targetToScan` | Docker image name to scan | Required |
| `workingDirectory` | Working directory for container (Defaults: `Build.SourcesDirectory`) | N/A |

---

### **SBOM Parameters**

| Parameter Name | Description | Default/Initial Value |
|----------------|-------------|-----------------------|
| `sbomPath` | SBOM file or folder to scan | Root of the pipeline (if not specified) |
| `outputDirectory` | Export file path (Defaults: `Build.SourcesDirectory`) | N/A |

---

## Build Failure Configuration

SOOS can be configured to return a "failing" (non-zero) exit code when certain issue types at specific severities are identified. The issue types and severities can be configured in the SOOS app on the configure page, see https://kb.soos.io/scan-and-build-configurations

By default the SOOS Azure DevOps tasks will report failures for issues/severities that fall outside of the allowable thresholds as a failure, however subsequent steps in the pipeline will continue to run. To configure the pipeline to fail and to skip running any subsequent steps set the `onFailure` parameter to `'FAIL_THE_BUILD'` and `continueOnError` to `false`

Example:
```
- task: SOOS-Security-Analysis@0
  continueOnError: false
  inputs:
    apiKey: 'TODO'
    clientId: 'TODO'
    project: 'TODO'
    onFailure: 'FAIL_THE_BUILD'
```

---

## References

#### Installing TypeScript for VSCode
https://code.visualstudio.com/docs/typescript/typescript-compiling 

#### Developing Azure DevOps build tasks
https://docs.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=azure-devops

