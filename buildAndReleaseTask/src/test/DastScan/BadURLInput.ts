import { createDockerTaskRunner } from "../mocks/DockerTaskRunner";

const dockerTaskRunner = createDockerTaskRunner();

dockerTaskRunner.setInput("clientId", "clientid123");
dockerTaskRunner.setInput("apiKey", "apikey123");
dockerTaskRunner.setInput("projectName", "Juice_Shop");
dockerTaskRunner.setInput("scanType", "DynamicApplicationSecurityTesting");
dockerTaskRunner.setInput("targetUri", "http://doesnotexist.soos.io");

dockerTaskRunner.run();
