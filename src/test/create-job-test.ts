import { sleep } from 'k6';
import {createJob} from "../main/zeus-api/create-job";

export const options = {
    scenarios: {
        createJobTest: {
            // name of the executor to use
            executor: 'per-vu-iterations',
            exec: 'createJobTest',
            vus: 3,
            iterations: 5,
        }
    },
};

export function createJobTest() {

    createJob("4214260a-098f-4097-8927-8dda29766873");

    sleep(1);
}