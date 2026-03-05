import { createDockerTaskRunner } from "../mocks/DockerTaskRunner";

const dockerTaskRunner = createDockerTaskRunner();

dockerTaskRunner.setInput("clientId", "clientid123");
dockerTaskRunner.setInput("apiKey", "apikey123");
dockerTaskRunner.setInput("projectName", "alpine");
dockerTaskRunner.setInput("scanType", "CSA");
dockerTaskRunner.setInput("targetToScan", "alpine");

dockerTaskRunner.run();
