const axios = require('axios');

module.exports = async function (context) {
    const baseUrl = process.env.REACT_APP_URL;
    const uploadEndpoint = `${baseUrl}/api/upload`;
    const getEndpoint = `${baseUrl}/api/get/?uuid=00000000`;

    const uploadStatus = { lastSuccess: null, lastError: null, result: null, url: uploadEndpoint };
    const getStatus = { lastSuccess: null, lastError: null, result: null, url: getEndpoint };

    try {
        const uploadResponse = await axios.put(uploadEndpoint, {});
        uploadStatus.lastSuccess = new Date();
        uploadStatus.result = uploadResponse.data;
    } catch (error) {
        uploadStatus.lastError = new Date();
        uploadStatus.result = {
            message: error.message,
            status: error.response ? error.response.status : null,
            data: error.response ? error.response.data : null
        };
    }

    try {
        const getResponse = await axios.get(getEndpoint);
        getStatus.lastSuccess = new Date();
        getStatus.result = getResponse.data;
    } catch (error) {
        getStatus.lastError = new Date();
        getStatus.result = {
            message: error.message,
            status: error.response ? error.response.status : null,
            data: error.response ? error.response.data : null
        };
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