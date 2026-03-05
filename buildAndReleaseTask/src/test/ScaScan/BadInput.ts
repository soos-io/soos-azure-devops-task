import { createTaskRunner } from "../mocks/TaskRunner";

const taskRunner = createTaskRunner();

taskRunner.setInput("bad", "input");

taskRunner.run();
