import http from "k6/http";
import {check} from "k6";
import {Trend} from "k6/metrics";

const myTrend = new Trend('zeus_api_generate_sc_from_detection_request_duration');

export function generateSecondaryCaptureFromDetection(detectionResultId: String) {

    const generateSecondaryCaptureFromDetectionUrl = `https://zclcp-zeus-gamma.labs.optellum.com/jobs/generate/detection/${detectionResultId}`;

    const params = {
        headers: {
            'apiKey': 'BeCpKZ1ZupGwrtE)%IbBqo2.8gAe\'oTF',
        },
    };
    const generateSecondaryCaptureFromDetectionResponse = http.post(generateSecondaryCaptureFromDetectionUrl, null, params);

    check(generateSecondaryCaptureFromDetectionResponse, { 'Generate SC from detection request status is 200': (r) => r.status === 200 }, { generate_sc_from_detection: "zeus_api_generate_sc_from_detection_request_duration" });
    myTrend.add(generateSecondaryCaptureFromDetectionResponse.timings.duration, { generate_sc_from_detection: "zeus_api_generate_sc_from_detection_request_duration" });

    // console.log("Generate secondary capture from detection response status: " + generateSecondaryCaptureFromDetectionResponse.status);
    if (generateSecondaryCaptureFromDetectionResponse.status != 200) {
        console.log(generateSecondaryCaptureFromDetectionResponse.body)
    }

    return generateSecondaryCaptureFromDetectionResponse;
}