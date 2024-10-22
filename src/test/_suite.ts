import * as assert from "assert";
import * as path from "path";
import { MockTestRunner } from "azure-pipelines-task-lib/mock-test";

// NOTE: these are integration tests which require you to set the API key in Constants.ts and the DockerTaskRunner.ts
describe("Security Scans", () => {
  describe("DAST", () => {
    it("should fail with bad input", async () => {
      // Given
      const testPath = path.join(__dirname, "DastScan/BadInput");
      const taskJsonPath = path.join(__dirname, "../..", "task.json");
      const testRunner = new MockTestRunner(testPath, taskJsonPath);

      // When
      await testRunner.runAsync();

      // Then
      console.log(testRunner.stdout);
      console.log("warningIssues", testRunner.warningIssues);
      console.log("errorIssues", testRunner.errorIssues);
      assert.ok(testRunner.failed, "should fail");
      assert.equal(testRunner.warningIssues.length, 0, "should not have warnings");
      assert.equal(testRunner.errorIssues.length, 1, "should have errors");
    });

    it("should succeed with simple inputs", async () => {
      // Given
      const testPath = path.join(__dirname, "DastScan/MinimumRequiredInput");
      const taskJsonPath = path.join(__dirname, "../..", "task.json");
      const testRunner = new MockTestRunner(testPath, taskJsonPath);

      // When
      await testRunner.runAsync();

      // Then
      console.log(testRunner.stdout);
      assert.ok(testRunner.succeeded, "should succeed");
      assert.equal(testRunner.errorIssues.length, 0, "should not have errors");
    });

    it("should succeed with a project name that contains quotes and spaces", async () => {
      // Given
      const testPath = path.join(__dirname, "DastScan/ProjectNameWithQuotesInput");
      const taskJsonPath = path.join(__dirname, "../..", "task.json");
      const testRunner = new MockTestRunner(testPath, taskJsonPath);

      // When
      await testRunner.runAsync();

      // Then
      console.log(testRunner.stdout);
      assert.ok(testRunner.succeeded, "should succeed");
      assert.equal(testRunner.errorIssues.length, 0, "should not have errors");
    });

    it("should fail when the url doesn't exist ", async () => {
      // Given

      const testPath = path.join(__dirname, "DastScan/BadUrlInput");
      const taskJsonPath = path.join(__dirname, "../..", "task.json");
      const testRunner = new MockTestRunner(testPath, taskJsonPath);

      // When
      await testRunner.runAsync();

      // Then
      console.log(testRunner.stdout);
      assert.ok(testRunner.failed, "should fail");
      assert.equal(testRunner.errorIssues.length, 1, "should have errors");
    });
  });
  describe("SCA", () => {
    it("should fail with bad input", async () => {
      // Given
      const testPath = path.join(__dirname, "ScaScan/BadInput");
      const taskJsonPath = path.join(__dirname, "../..", "task.json");
      const testRunner = new MockTestRunner(testPath, taskJsonPath);

      // When
      await testRunner.runAsync();

      // Then
      console.log(testRunner.stdout);
      console.log("warningIssues", testRunner.warningIssues);
      console.log("errorIssues", testRunner.errorIssues);
      assert.ok(testRunner.failed, "should fail");
      assert.equal(testRunner.warningIssues.length, 0, "should not have warnings");
      assert.equal(testRunner.errorIssues.length, 1, "should have errors");
    });

    it("should succeed with simple inputs", async () => {
      // Given
      const testPath = path.join(__dirname, "ScaScan/MinimumRequiredInput");
      const taskJsonPath = path.join(__dirname, "../..", "task.json");
      const testRunner = new MockTestRunner(testPath, taskJsonPath);

      // When
      await testRunner.runAsync();

      // Then
      console.log(testRunner.stdout);
      assert.ok(testRunner.succeeded, "should succeed");
      assert.equal(testRunner.errorIssues.length, 0, "should not have errors");
    });

    it("should succeed with a script version set", async () => {
      // Given
      const testPath = path.join(__dirname, "ScaScan/ScriptVersionInput");
      const taskJsonPath = path.join(__dirname, "../..", "task.json");
      const testRunner = new MockTestRunner(testPath, taskJsonPath);

      // When
      await testRunner.runAsync();

      // Then
      console.log(testRunner.stdout);
      assert.ok(testRunner.succeeded, "should succeed");
      assert.equal(testRunner.errorIssues.length, 0, "should not have errors");
    });

    it("should succeed with legacy input parameters", async () => {
      // Given
      const testPath = path.join(__dirname, "ScaScan/LegacyInput");
      const taskJsonPath = path.join(__dirname, "../..", "task.json");
      const testRunner = new MockTestRunner(testPath, taskJsonPath);

      // When
      await testRunner.runAsync();

      // Then
      console.log(testRunner.stdout);
      assert.ok(testRunner.succeeded, "should succeed");
      assert.equal(testRunner.errorIssues.length, 0, "should not have errors");
    });

    it("should succeed when waiting for the scan output", async () => {
      // Given
      const testPath = path.join(__dirname, "ScaScan/OutputFormat");
      const taskJsonPath = path.join(__dirname, "../..", "task.json");
      const testRunner = new MockTestRunner(testPath, taskJsonPath);

      // When
      await testRunner.runAsync();

      // Then
      console.log(testRunner.stdout);
      assert.ok(testRunner.succeeded, "should succeed");
      assert.equal(testRunner.errorIssues.length, 0, "should not have errors");
    });

    it("should succeed filtering package managers", async () => {
      // Given
      const testPath = path.join(__dirname, "ScaScan/FilteredPackageManagers");
      const taskJsonPath = path.join(__dirname, "../..", "task.json");
      const testRunner = new MockTestRunner(testPath, taskJsonPath);

      // When
      await testRunner.runAsync();

      // Then
      console.log(testRunner.stdout);
      assert.ok(testRunner.succeeded, "should succeed");
      assert.equal(testRunner.errorIssues.length, 0, "should not have errors");
    });
  });
  describe("CSA", () => {
    it("should succeed with simple inputs", async () => {
      // Given
      const testPath = path.join(__dirname, "ContainerScan/MinimumRequiredInput");
      const taskJsonPath = path.join(__dirname, "../..", "task.json");
      const testRunner = new MockTestRunner(testPath, taskJsonPath);

      // When
      await testRunner.runAsync();

      // Then
      console.log(testRunner.stdout);
      assert.ok(testRunner.succeeded, "should succeed");
      assert.equal(testRunner.errorIssues.length, 0, "should not have errors");
    });
  });
  describe("SAST", () => {
    it("should succeed with simple inputs", async () => {
      // Given

      const testPath = path.join(__dirname, "SastScan/MinimumRequiredInput");
      const taskJsonPath = path.join(__dirname, "../..", "task.json");
      const testRunner = new MockTestRunner(testPath, taskJsonPath);

      // When
      await testRunner.runAsync();

      // Then
      console.log(testRunner.stdout);
      assert.ok(testRunner.succeeded, "should succeed");
      assert.equal(testRunner.errorIssues.length, 0, "should not have errors");
    });
  });
  describe("SBOM", () => {
    it("should succeed with simple inputs", async () => {
      // Given

      const testPath = path.join(__dirname, "SbomScan/MinimumRequiredInput");
      const taskJsonPath = path.join(__dirname, "../..", "task.json");
      const testRunner = new MockTestRunner(testPath, taskJsonPath);

      // When
      await testRunner.runAsync();

      // Then
      console.log(testRunner.stdout);
      assert.ok(testRunner.succeeded, "should succeed");
      assert.equal(testRunner.errorIssues.length, 0, "should not have errors");
    });
  });
});
