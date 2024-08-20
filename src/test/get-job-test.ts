import { sleep } from 'k6';
import {getJob} from "../main/zeus-api/get-job";

export const options = {
    scenarios: {
        getJobTest: {
            // name of the executor to use
            executor: 'per-vu-iterations',
            exec: 'getJobTest',
            vus: 1,
            iterations: 1,
        }
    },
};

export function getJobTest() {
    const getJobResponse = getJob('96546cab-7b65-4ac9-a1cc-6e65e322bb05')
    console.log(getJobResponse.json("jobPlans.#(taskType==\"DETECTION\").taskDetails.#(status==\"COMPLETE\").results.#.id"));
    const completedDetectionIds = getJobResponse.json("jobPlans.#(taskType==\"DETECTION\").taskDetails.#(status==\"COMPLETE\").results.#.id");
    while (completedDetectionIds == null) {
        // @ts-ignore
        for (const id of completedDetectionIds) {
            console.log(id)
        }
    }
    sleep(1);
}