import {sleep} from 'k6';
import {getJob} from "../main/zeus-api/get-job";
import {generateSecondaryCaptureFromDetection} from "../main/zeus-api/generate-secondary-capture";

export const options = {
    scenarios: {
        getJobAndGenerateSCTest: {
            // name of the executor to use
            executor: 'per-vu-iterations',
            exec: 'getJobAndGenerateSCTest',
            vus: 1,
            iterations: 1,
        }
    },
};

export function getJobAndGenerateSCTest() {
    let getJobResponse = getJob('96546cab-7b65-4ac9-a1cc-6e65e322bb05')

    let detectionTaskStatus = getJobResponse.json("jobPlans.#(taskType==\"DETECTION\").taskDetails.0.status");
    console.log("Detection task status: " + detectionTaskStatus?.toString());
    while (detectionTaskStatus?.toString() != "COMPLETE") {
        getJobResponse = getJob('96546cab-7b65-4ac9-a1cc-6e65e322bb05')
        detectionTaskStatus = getJobResponse.json("jobPlans.#(taskType==\"DETECTION\").taskDetails.0.status");
        console.log("Detection task status: " + detectionTaskStatus?.toString());
        sleep(1);
    }

    let completedDetectionId = getJobResponse.json("jobPlans.#(taskType==\"DETECTION\").taskDetails.#(status==\"COMPLETE\").results.0.id");
    console.log("Result id from completed detection: " + completedDetectionId?.toString());
    if (completedDetectionId?.toString() == null) {
        throw new Error("Unable to get result id from completed detection")
    }

    generateSecondaryCaptureFromDetection(completedDetectionId?.toString());
    sleep(1);
}
