import { TaskLibAnswerExecResult } from "azure-pipelines-task-lib/mock-answer";
import DockerTaskRunner from "./TaskRunner";

const exec: Record<string, TaskLibAnswerExecResult> = {};

exec[`chmod -R 777 /home/vsts/work/1/s`] = {
  code: 0,
  stdout: "",
};

exec[
  `docker run -u zap --rm -v /home/vsts/work/1/s:/zap/wrk:rw soosio/dast:latest --apiKey=apikey123 --clientId=clientid123 --projectName=Juice Shop --scanMode=baseline --onFailure=continue_on_failure --apiURL=https://dev-api.soos.io/api/ --integrationType=Plugin --integrationName=AzureDevOps --appVersion=0.0.0 --logLevel=INFO https://juice-shop.herokuapp.com`
] = {
  code: 0,
  stdout: "SOOS DAST Analysis successful",
};

exec[
  `docker run -u zap --rm -v /home/vsts/work/1/s:/zap/wrk:rw soosio/dast:latest --apiKey=apikey123 --clientId=clientid123 --projectName=SOOS's Test --scanMode=baseline --onFailure=continue_on_failure --apiURL=https://dev-api.soos.io/api/ --integrationType=Plugin --integrationName=AzureDevOps --appVersion=0.0.0 --logLevel=INFO --debug https://juice-shop.herokuapp.com`
] = {
  code: 0,
  stdout: "SOOS DAST Analysis successful",
};

exec[
  `docker run -u zap --rm -v /home/vsts/work/1/s:/zap/wrk:rw soosio/dast:latest --apiKey=apikey123 --clientId=clientid123 --projectName="Juice_Shop" --scanMode="baseline" --onFailure="continue_on_failure" --apiURL="https://dev-api.soos.io/api/" --integrationType="Plugin" --integrationName="AzureDevOps" --appVersion="0.0.0" --logLevel="INFO" http://doesnotexist.soos.io`
] = {
  code: 1,
  stdout: "The URL http://doesnotexist.soos.io is not available",
};

exec[
  `docker run --rm -v /home/vsts/work/1/s:/usr/src/app:rw soosio/csa:latest --apiKey=apikey123 --appVersion=0.0.0 --apiURL=https://dev-api.soos.io/api/ --clientId=clientid123 --integrationName=AzureDevOps --integrationType=Plugin --logLevel=INFO --onFailure=continue_on_failure --projectName=alpine alpine`
] = {
  code: 0,
  stdout: "SOOS CSA Analysis successful",
};

DockerTaskRunner.setAnswers({
  which: {
    docker: "docker",
    chmod: "chmod",
  },
  checkPath: {
    docker: true,
    chmod: true,
  },
  exist: {
    docker: true,
    chmod: true,
  },
  exec,
});

export default DockerTaskRunner;
