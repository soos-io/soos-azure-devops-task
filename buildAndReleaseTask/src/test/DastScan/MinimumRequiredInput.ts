import DockerTaskRunner from "../mocks/DockerTaskRunner";

DockerTaskRunner.setInput("clientId", "clientid123");
DockerTaskRunner.setInput("apiKey", "apikey123");
DockerTaskRunner.setInput("projectName", "Juice Shop");
DockerTaskRunner.setInput("scanType", "DynamicApplicationSecurityTesting");
DockerTaskRunner.setInput("targetUri", "https://juice-shop.herokuapp.com");

DockerTaskRunner.run();
