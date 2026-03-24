import http from 'k6/http';
import { check } from 'k6';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/2.4.0/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

// Đọc file CSV mới
const csvData = new SharedArray('CSV Data', function () {
    const csvPath = __ENV.CSV_PATH || 'practice_data.csv';
    const fileContent = open(csvPath);
    return papaparse.parse(fileContent, { header: true, skipEmptyLines: true }).data;
});

// Cấu hình tải (Bắn nhẹ nhàng 60 req/phút vì đây là API công cộng)
export const options = {
    scenarios: {
        practice_scenario: {
            executor: 'constant-arrival-rate', 
            rate: __ENV.THROUGHPUT_PER_MIN || 60, 
            timeUnit: '1m',                        
            duration: `${__ENV.DURATION || 30}s`,  
            preAllocatedVUs: __ENV.USERS || 5,     
            maxVUs: 50,
        },
    },
};

export default function () {
    const row = csvData[__ITER % csvData.length];

    // Trỏ vào API công cộng để thực hành
    const domain = 'jsonplaceholder.typicode.com'; 
    const protocol = 'https'; 
    const method = row['Method'] || 'GET'; 
    const apiEndpoint = row['API endpoint'] || ''; 
    const body = row['Body'] || ''; 

    const url = `${protocol}://${domain}${apiEndpoint}`; 

    const params = {
        headers: {
            'Content-Type': 'application/json',        
        },
    };

    const res = http.request(method, url, body, params);

    // Kiểm tra mã 200 (GET) hoặc 201 (POST tạo mới thành công)
    check(res, {
        'Status is 200 or 201': (r) => r.status === 200 || r.status === 201,
    });
}

// Hàm xuất HTML Report
export function handleSummary(data) {
    return {
        "test_result.html": htmlReport(data),
        stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
}