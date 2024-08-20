import { sleep } from 'k6';
import {generateSecondaryCaptureFromDetection} from "../main/zeus-api/generate-secondary-capture";

export const options = {
    scenarios: {
        uploadSeriesTest: {
            // name of the executor to use
            executor: 'per-vu-iterations',
            exec: 'generateSecondaryCaptureFromDetectionTest',
            vus: 1,
            iterations: 1,
        }
    },
};

export function generateSecondaryCaptureFromDetectionTest() {
    generateSecondaryCaptureFromDetection('2230138d-e200-45f8-81bd-233fac966fdb')
    sleep(1);
}