import https from 'https';

const projectId = '2saavkiq';
const token = 'skbYQRN3iBjvFexIM1kXgxiMKuhfs516ooCbcsag7gYXO3XFv0V3BwusQkmmDCKmC2sXbJQsN9qsEiyH0EVbvgN3Ixom1GxheJgaCVYuhPM0fnBby0U9UhNkqyqGSm0aHJyLsTIxJsVAPXTuPYqHS2UtBw5gYO49ViCqqFZm1WT30tux7XP1';
const origin = 'https://counsellorprenuer.github.io';

const data = JSON.stringify({
    origin: origin,
    allowCredentials: true
});

const options = {
    hostname: 'api.sanity.io',
    port: 443,
    path: `/v1/projects/${projectId}/cors`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': `Bearer ${token}`
    }
};

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (d) => body += d);
    res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Response: ${body}`);
    });
});

req.on('error', (e) => {
    console.error(e);
});

req.write(data);
req.end();
