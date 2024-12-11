const axios = require('axios');

module.exports = async function (context) {
    // Define our URL and endpoints
    const baseUrl = process.env.REACT_APP_URL;
    const uploadEndpoint = `${baseUrl}/api/upload`;
    const getEndpoint = `${baseUrl}/api/get/?uuid=00000000`;

    // Set base status values
    const uploadStatus = { lastSuccess: null, lastError: null, result: null, url: uploadEndpoint };
    const getStatus = { lastSuccess: null, lastError: null, result: null, url: getEndpoint };

    const validUpload = "An error occurred uploading the text: contentLength cannot be null or undefined."
    const validGet = "An error occurred downloading the blob: The specified blob does not exist."

    // UPLOAD testing
    try {
        const uploadResponse = await axios.put(uploadEndpoint, {});
        uploadStatus.lastSuccess = new Date();
        uploadStatus.result = uploadResponse.data;
    } catch (error) {
        if (error.response && error.response.data === validUpload) {
            uploadStatus.lastSuccess = new Date();
            uploadStatus.result = { message: "UPLOAD returned valid error for missing payload" };
        } else {
            uploadStatus.lastError = new Date();
            uploadStatus.result = {
                message: error.message,
                status: error.response ? error.response.status : null,
                data: error.response ? error.response.data : null
            };
        }
    }

    // GET testing
    try {
        const getResponse = await axios.get(getEndpoint);
        getStatus.lastSuccess = new Date();
        getStatus.result = getResponse.data;
    } catch (error) {
        if (error.response && error.response.data === validGet) {
            getStatus.lastSuccess = new Date();
            getStatus.result = { message: "GET returned valid error for unknown blob" };
        } else {
            getStatus.lastError = new Date();
            getStatus.result = {
                message: error.message,
                status: error.response ? error.response.status : null,
                data: error.response ? error.response.data : null
            };
        }
    }


    // Basic return to have text
    context.res = {
        status: 200,
        body: {
            message: "Keep-alive endpoint is working!",
            uploadStatus,
            getStatus
        }
    };
};