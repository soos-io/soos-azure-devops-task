import DockerTaskRunner from "../mocks/DockerTaskRunner";

DockerTaskRunner.setInput("clientId", "clientid123");
DockerTaskRunner.setInput("apiKey", "apikey123");
DockerTaskRunner.setInput("projectName", "SOOS's Test");
DockerTaskRunner.setInput("scanType", "DynamicApplicationSecurityTesting");
DockerTaskRunner.setInput("targetUri", "https://juice-shop.herokuapp.com");
DockerTaskRunner.setInput("debug", "true");

DockerTaskRunner.run();
