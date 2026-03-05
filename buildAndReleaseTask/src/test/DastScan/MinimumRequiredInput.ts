import { createDockerTaskRunner } from "../mocks/DockerTaskRunner";

const dockerTaskRunner = createDockerTaskRunner();

dockerTaskRunner.setInput("clientId", "clientid123");
dockerTaskRunner.setInput("apiKey", "apikey123");
dockerTaskRunner.setInput("projectName", "Juice Shop");
dockerTaskRunner.setInput("scanType", "DynamicApplicationSecurityTesting");
dockerTaskRunner.setInput("targetUri", "https://juice-shop.herokuapp.com");

dockerTaskRunner.run();
