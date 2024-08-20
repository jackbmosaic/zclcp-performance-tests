import http from "k6/http";
import {check} from "k6";
import {Trend} from "k6/metrics";

const myTrend = new Trend('zeus_api_create_job_request_duration');

export function createJob(seriesUid: String) {

    const createJobUrl = 'https://zclcp-zeus-gamma.labs.optellum.com/jobs';

    const params = {
        headers: {
            'apiKey': 'BeCpKZ1ZupGwrtE)%IbBqo2.8gAe\'oTF',
        },
    };
    const createJobRequestBody = `{"seriesUid": {"value": "${seriesUid}"}}`
    const createJobResponse = http.post(createJobUrl, createJobRequestBody, params);

    check(createJobResponse, { 'Create job request status is 200': (r) => r.status === 200 }, { create_job: "zeus_api_create_job_request_duration" });
    myTrend.add(createJobResponse.timings.duration, { create_job: "zeus_api_create_job_request_duration" });

    // console.log("Create job response status: " + createJobResponse.status);
    console.log("Create job response id: " + createJobResponse.json('id'));

    return createJobResponse;
}