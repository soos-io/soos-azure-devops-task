import DockerTaskRunner from "../mocks/DockerTaskRunner";

DockerTaskRunner.setInput("clientId", "clientid123");
DockerTaskRunner.setInput("apiKey", "apikey123");
DockerTaskRunner.setInput("projectName", "alpine");
DockerTaskRunner.setInput("scanType", "CSA");
DockerTaskRunner.setInput("targetToScan", "alpine");

DockerTaskRunner.run();
