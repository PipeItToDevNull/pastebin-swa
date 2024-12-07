const axios = require('axios');

module.exports = async function (context, req) {
    const baseUrl = `${req.headers['x-forwarded-proto']}://${req.headers.host}/api`;

    const uploadUrl = `${baseUrl}/upload`;
    const getUrl = `${baseUrl}/get?uuid=00000000-0000-0000-0000-000000000000`;

    let uploadStatus = { lastSuccess: null, lastError: null, result: null };
    let getStatus = { lastSuccess: null, lastError: null, result: null };

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