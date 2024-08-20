import {sleep} from 'k6';
import {waitUntilJobCompletesAndGetDetectionResultId} from "../main/zeus-api/get-job";
import {generateSecondaryCaptureFromDetection} from "../main/zeus-api/generate-secondary-capture";
import {createJob} from "../main/zeus-api/create-job";
import {uploadSeries} from "../main/zeus-api/upload-series";
// @ts-ignore
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const options = {
    scenarios: {
        createJobAndGenerateSCTest: {
            // name of the executor to use
            executor: 'per-vu-iterations',
            exec: 'createJobAndGenerateSCTest',
            vus: 1,
            iterations: 1,
        }
    },
};

const seriesZip = open('./../src/main/assets/series/CT.zip', 'b');

export function createJobAndGenerateSCTest() {

    const seriesUid = uuidv4();
    const uploadSeriesResponse = uploadSeries(seriesUid, seriesZip)
    if (uploadSeriesResponse.status == 200) {
        sleep(1);

        let createJobResponse = createJob(seriesUid);
        sleep(1);
        if (createJobResponse.status == 200) {
            let jobId = createJobResponse.json('id')
            // @ts-ignore
            let completedDetectionId = waitUntilJobCompletesAndGetDetectionResultId(jobId.toString())

            generateSecondaryCaptureFromDetection(completedDetectionId?.toString());
            sleep(1);
        }
    }
}
