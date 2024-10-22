import "core-js/actual/promise";
import "core-js/actual/array";
import { tryAction } from "./utils/TaskUtilities";
import * as Task from "azure-pipelines-task-lib/task";
import ScaScan from "./scans/ScaScan";
import DastScan from "./scans/DastScan";
import { ensureEnumValue, ensureValueIsOneOf } from "./utils/Utilities";
import AsciiLogo from "./AsciiLogo";
import { LogLevel, soosLogger } from "@soos-io/api-client";
import ContainerScan from "./scans/ContainerScan";
import SbomScan from "./scans/SbomScan";
import SastScan from "./scans/SastScan";

const getTaskInput = () => {
  return {
    scanType:
      ensureValueIsOneOf(
        [
          ScaScan.Name,
          ScaScan.Abbreviation,
          DastScan.Name,
          DastScan.Abbreviation,
          ContainerScan.Name,
          ContainerScan.Abbreviation,
          SbomScan.Name,
          SbomScan.Abbreviation,
          SastScan.Name,
          SastScan.Abbreviation,
        ],
        Task.getInput("scanType"),
      ) ?? ScaScan.Name,
    logLevel: ensureEnumValue<LogLevel>(LogLevel, Task.getInput("logLevel")) ?? LogLevel.INFO,
  };
};

async function run() {
  soosLogger.info(AsciiLogo);
  soosLogger.group("SOOS Security Analysis");

  try {
    Task.assertAgent("2.142.0"); // minimum version that supports the 'done' parameter on Task.setResult

    const input = getTaskInput();

    soosLogger.setMinLogLevel(input.logLevel);

    switch (input.scanType) {
      case DastScan.Name:
      case DastScan.Abbreviation:
        return await tryAction(DastScan.DisplayName, async () => new DastScan().run());
      case ContainerScan.Name:
      case ContainerScan.Abbreviation:
        return await tryAction(ContainerScan.DisplayName, async () => new ContainerScan().run());
      case SastScan.Name:
      case SastScan.Abbreviation:
        return await tryAction(SastScan.DisplayName, async () => new SastScan().run());
      case SbomScan.Name:
      case SbomScan.Abbreviation:
        return await tryAction(SbomScan.DisplayName, async () => new SbomScan().run());
      case ScaScan.Name:
      case ScaScan.Abbreviation:
      default:
        return await tryAction(ScaScan.DisplayName, async () => new ScaScan().run());
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : (error as string);
    Task.setResult(Task.TaskResult.Failed, message, true);
  } finally {
    soosLogger.groupEnd();
  }
}

run();
