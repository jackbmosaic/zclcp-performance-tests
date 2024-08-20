import http from "k6/http";
import {check, sleep} from "k6";
import {Trend} from "k6/metrics";

const getJobDurationTrend = new Trend('zeus_api_get_job_request_duration');
// TODO Temporary dumb metrics, Removed when available from server
const detectionPendingDurationTrend = new Trend('zeus_detection_pending_duration');
const detectionInProgressDurationTrend = new Trend('zeus_detection_in_progress_duration');
const segmentationPendingDurationTrend = new Trend('zeus_segmentation_pending_duration');
const segmentationInProgressDurationTrend = new Trend('zeus_segmentation_in_progress_duration');

const sleepTime = 3;

export function getJob(jobId: String) {

    const getJobUrl = `https://zclcp-zeus-gamma.labs.optellum.com/jobs/${jobId}`;

    const params = {
        headers: {
            'apiKey': 'BeCpKZ1ZupGwrtE)%IbBqo2.8gAe\'oTF',
        },
    };

    const getJobResponse = http.get(getJobUrl, params);

    check(getJobResponse, {'Get job request status is 200': (r) => r.status === 200}, {get_job: "zeus_api_get_job_request_duration"});
    getJobDurationTrend.add(getJobResponse.timings.duration, {get_job: "zeus_api_get_job_request_duration"});

    return getJobResponse;
}

export function waitUntilJobCompletesAndGetDetectionResultId(jobId: String) {
    console.log("waitUntilJobCompletesAndGetDetectionResultId jobId: " + jobId)

    let startTime = new Date().getTime();
    let getJobResponse = getJob(jobId.toString())

    let detectionTaskStatus = getJobResponse.json("jobPlans.#(taskType==\"DETECTION\").taskDetails.0.status");
    while (detectionTaskStatus?.toString() === "PENDING") {
        getJobResponse = getJob(jobId.toString())
        detectionTaskStatus = getJobResponse.json("jobPlans.#(taskType==\"DETECTION\").taskDetails.0.status");
        sleep(sleepTime);
    }

    let detectionInProgressStartTime = new Date().getTime();
    detectionPendingDurationTrend.add(detectionInProgressStartTime - startTime, { detection_pending_duration: "zeus_detection_pending_duration" });

    while (detectionTaskStatus?.toString() != "COMPLETE") {
        getJobResponse = getJob(jobId.toString())
        detectionTaskStatus = getJobResponse.json("jobPlans.#(taskType==\"DETECTION\").taskDetails.0.status");
        sleep(sleepTime);
    }

    let detectionCompletedTime = new Date().getTime();
    detectionInProgressDurationTrend.add(detectionCompletedTime - detectionInProgressStartTime, { detection_in_progress_duration: "zeus_detection_in_progress_duration" });

    let completedDetectionId = getJobResponse.json("jobPlans.#(taskType==\"DETECTION\").taskDetails.#(status==\"COMPLETE\").results.0.id");
    console.log("Result id from completed detection: " + completedDetectionId?.toString() + ", jobId: " + jobId.toString());
    if (completedDetectionId?.toString() == null) {
        // TODO
        throw new Error("Unable to get result id from completed detection")
    }

    let segmentationTaskStatus = getJobResponse.json("jobPlans.#(taskType==\"SEGMENTATION\").taskDetails.0.status");
    while (segmentationTaskStatus?.toString() === "PENDING") {
        getJobResponse = getJob(jobId.toString())
        segmentationTaskStatus = getJobResponse.json("jobPlans.#(taskType==\"SEGMENTATION\").taskDetails.0.status");
        sleep(sleepTime);
    }

    let segmentationInProgressStartTime = new Date().getTime();
    segmentationPendingDurationTrend.add(segmentationInProgressStartTime - detectionCompletedTime, { segmentation_pending_duration: "zeus_segmentation_pending_duration" });

    while (segmentationTaskStatus?.toString() != "COMPLETE") {
        getJobResponse = getJob(jobId.toString())
        segmentationTaskStatus = getJobResponse.json("jobPlans.#(taskType==\"SEGMENTATION\").taskDetails.0.status");
        sleep(sleepTime);
    }

    let segmentationCompletedTime = new Date().getTime();
    segmentationInProgressDurationTrend.add(segmentationCompletedTime - segmentationInProgressStartTime, { segmentation_in_progress_duration: "zeus_segmentation_in_progress_duration" });
    console.log("Segmentation completed for jobId: " + jobId.toString());

    let lcpScoreTaskStatus = getJobResponse.json("jobPlans.#(taskType==\"LCP_SCORE\").taskDetails.0.status");
    console.log("LCP Score task status: " + lcpScoreTaskStatus?.toString() + " for jobId: " + jobId.toString());
    while (lcpScoreTaskStatus?.toString() != "COMPLETE") {
        getJobResponse = getJob(jobId.toString())
        lcpScoreTaskStatus = getJobResponse.json("jobPlans.#(taskType==\"LCP_SCORE\").taskDetails.0.status");
        console.log("LCP Score completed for jobId: " + jobId.toString());
        sleep(sleepTime);
    }

    return completedDetectionId
}
