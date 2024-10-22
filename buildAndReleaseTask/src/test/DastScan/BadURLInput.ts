import DockerTaskRunner from "../mocks/DockerTaskRunner";

DockerTaskRunner.setInput("clientId", "clientid123");
DockerTaskRunner.setInput("apiKey", "apikey123");
DockerTaskRunner.setInput("projectName", "Juice_Shop");
DockerTaskRunner.setInput("scanType", "DynamicApplicationSecurityTesting");
DockerTaskRunner.setInput("targetUri", "http://doesnotexist.soos.io");

DockerTaskRunner.run();
