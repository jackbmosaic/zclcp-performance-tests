import http from "k6/http";
import {check} from "k6";
import {Trend} from "k6/metrics";

const myTrend = new Trend('zeus_api_upload_series_request_duration');

export function uploadSeries(seriesUid: String, seriesZip: ArrayBuffer) {

    const uploadSeriesUrl = `https://zclcp-zeus-gamma.labs.optellum.com/series/${seriesUid}`;

    const params = {
        headers: {
            'Content-Type': 'application/zip',
            'apiKey': 'BeCpKZ1ZupGwrtE)%IbBqo2.8gAe\'oTF',
        },
        data: seriesZip,
        timeout: '720s'
    };

    const uploadSeriesResponse = http.put(uploadSeriesUrl, seriesZip, params);

    check(uploadSeriesResponse, { 'Upload series request status is 200': (r) => r.status === 200 }, { upload_series_request: "zeus_api_upload_series_request_duration" });
    myTrend.add(uploadSeriesResponse.timings.duration, { upload_series_request: "zeus_api_upload_series_request_duration" });

    return uploadSeriesResponse;
}