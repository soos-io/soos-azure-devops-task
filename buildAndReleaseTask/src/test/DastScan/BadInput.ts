import { createDockerTaskRunner } from "../mocks/DockerTaskRunner";

const dockerTaskRunner = createDockerTaskRunner();
dockerTaskRunner.setInput("scanType", "DynamicApplicationSecurityTesting");

dockerTaskRunner.run();
