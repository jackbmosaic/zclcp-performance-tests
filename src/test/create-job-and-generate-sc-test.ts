import {sleep} from 'k6';
import {waitUntilJobCompletesAndGetDetectionResultId} from "../main/zeus-api/get-job";
import {generateSecondaryCaptureFromDetection} from "../main/zeus-api/generate-secondary-capture";
import {createJob} from "../main/zeus-api/create-job";

export const options = {
    scenarios: {
        createJobAndGenerateSCTest: {
            // name of the executor to use
            executor: 'per-vu-iterations',
            exec: 'createJobAndGenerateSCTest',
            vus: 4,
            iterations: 2,
        }
    },
};

export function createJobAndGenerateSCTest() {

    let createJobResponse = createJob("4214260a-098f-4097-8927-8dda29766873");
    sleep(1);
    if (createJobResponse.status == 200) {
        let jobId = createJobResponse.json('id')
        // @ts-ignore
        let completedDetectionId = waitUntilJobCompletesAndGetDetectionResultId(jobId.toString())

        generateSecondaryCaptureFromDetection(completedDetectionId?.toString());
        sleep(1);
    }
}
