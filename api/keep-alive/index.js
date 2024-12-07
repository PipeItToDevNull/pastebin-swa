const axios = require('axios');

module.exports = async function (context, req) {
    const baseUrl = `${req.headers['x-forwarded-proto']}://${req.headers.host}/api`;

    const uploadUrl = `${baseUrl}/upload`;
    const getUrl = `${baseUrl}/get?uuid=00000000-0000-0000-0000-000000000000`;

    let uploadStatus = { lastSuccess: null, lastError: null };
    let getStatus = { lastSuccess: null, lastError: null };

    try {
        await axios.put(uploadUrl, {});
        uploadStatus.lastSuccess = new Date();
    } catch (error) {
        uploadStatus.lastError = new Date();
    }

    try {
        await axios.get(getUrl);
        getStatus.lastSuccess = new Date();
    } catch (error) {
        getStatus.lastError = new Date();
    }

    context.res = {
        status: 200,
        body: {
            uploadStatus,
            getStatus
        }
    };
};