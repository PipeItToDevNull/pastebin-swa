const axios = require('axios');

module.exports = async function (context, req) {
    const originalUrl = req.originalUrl;
    const baseUrl = originalUrl.substring(0, originalUrl.indexOf('/api')) + '/api';

    const uploadUrl = `${baseUrl}/upload`;
    const getUrl = `${baseUrl}/get/?uuid=00000000-0000-0000-0000-000000000000`;

    let uploadStatus = { lastSuccess: null, lastError: null, result: null, url: uploadUrl };
    let getStatus = { lastSuccess: null, lastError: null, result: null, url: getUrl };

    try {
        const uploadResponse = await axios.put(uploadUrl, {});
        uploadStatus.lastSuccess = new Date();
        uploadStatus.result = uploadResponse.data;
    } catch (error) {
        uploadStatus.lastError = new Date();
        uploadStatus.result = error.message;
    }

    try {
        const getResponse = await axios.get(getUrl);
        getStatus.lastSuccess = new Date();
        getStatus.result = getResponse.data;
    } catch (error) {
        getStatus.lastError = new Date();
        getStatus.result = error.message;
    }

    context.res = {
        status: 200,
        body: {
            message: "Keep-alive endpoint is working!",
            uploadStatus,
            getStatus
        }
    };
};