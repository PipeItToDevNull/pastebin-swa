const axios = require('axios');

module.exports = async function (context) {
    // Derive the URL we are gonna get against
    const baseUrl = process.env.REACT_APP_URL;
    const uploadUrl = `${baseUrl}/api/upload`;
    const getUrl = `${baseUrl}/api/get/?uuid=00000000`;

    const uploadStatus = { lastSuccess: null, lastError: null, result: null, url: uploadUrl };
    const getStatus = { lastSuccess: null, lastError: null, result: null, url: getUrl };

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
    context.log('Health check completed.');
};