import {uploadSeries} from '../main/zeus-api/upload-series';
// @ts-ignore
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const options = {
    scenarios: {
        uploadSeriesTest: {
            // name of the executor to use
            executor: 'per-vu-iterations',
            exec: 'uploadSeriesTest',
            vus: 1,
            iterations: 1,
        }
    },
};

const seriesZip = open('./../src/main/assets/series/CT.zip', 'b');

export function uploadSeriesTest() {
    uploadSeries(uuidv4(), seriesZip)
}
