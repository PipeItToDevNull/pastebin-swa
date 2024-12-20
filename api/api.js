const express = require('express');
const { BlobServiceClient } = require('@azure/storage-blob');
const uuid = require('uuid');
const dotenv = require('dotenv');
const axios = require('axios');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Function to convert a readable stream to a buffer
async function streamToBuffer(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on('data', (data) => {
            chunks.push(data instanceof Buffer ? data : Buffer.from(data));
        });
        readableStream.on('end', () => {
            resolve(Buffer.concat(chunks));
        });
        readableStream.on('error', reject);
    });
}

// GET endpoint to download a blob
app.get('/download', async (req, res) => {
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AzureBlobConnectionString);
    const blobUUID = req.query.uuid;

    // Regular expression to validate UUID
    const uuidRegex = /^[0-9a-f]{8}$/i;

    if (!blobUUID || !uuidRegex.test(blobUUID)) {
        res.status(400).send("Invalid or missing uuid in query");
        return;
    }

    const containerClient = blobServiceClient.getContainerClient('linx-container'); // Define blob container name
    const blockBlobClient = containerClient.getBlockBlobClient(blobUUID);

    try {
        const downloadBlockBlobResponse = await blockBlobClient.download(0);
        const blobContent = (await streamToBuffer(downloadBlockBlobResponse.readableStreamBody)).toString();
        const mimetype = downloadBlockBlobResponse.contentType; // Get the mimetype from the response headers

        res.setHeader('Content-Type', mimetype);
        res.send(blobContent);
    } catch (err) {
        if (err.message.includes("The specified blob does not exist.")) {
            res.status(404).send("The specified blob does not exist");
        } else {
            res.status(500).send(`An error occurred downloading the blob: ${err.message}`);
        }
    }
});

// PUT endpoint to upload a blob
app.put('/upload', async (req, res) => {
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AzureBlobConnectionString);
    const containerClient = blobServiceClient.getContainerClient(process.env.REACT_APP_BLOB_CONTAINER); // Define the Azure storage container to be used
    const blobUUID = uuid.v4().split('-')[0]; // Get the first part of the UUID
    const blockBlobClient = containerClient.getBlockBlobClient(blobUUID);
    const text = req.body;
    const mimetype = req.headers['content-type'] || 'text/plain'; // Get the mimetype from the request headers or default to 'text/plain'
    const site = process.env.REACT_APP_URL;

    try {
        await blockBlobClient.upload(text, text.length, {
            blobHTTPHeaders: { blobContentType: mimetype } // Set the content type
        });
        res.send(`${site}/${blobUUID}`);
    } catch (err) {
        res.status(500).send(`An error occurred uploading the text: ${err.message}`);
    }
});

// Health endpoint to check the status of the upload and download endpoints
app.get('/health', async (req, res) => {
    // Define our URL and endpoints
    const baseUrl = process.env.REACT_APP_URL;
    const uploadEndpoint = `${baseUrl}/api/upload`;
    const getEndpoint = `${baseUrl}/api/get/?uuid=00000000`;

    // Set base status values
    const uploadStatus = { lastSuccess: null, lastError: null, result: null, url: uploadEndpoint };
    const getStatus = { lastSuccess: null, lastError: null, result: null, url: getEndpoint };

    // Set expected error messages
    const validUpload = "An error occurred uploading the text: contentLength cannot be null or undefined.";
    const validGet = "An error occurred downloading the blob: The specified blob does not exist.";

    // UPLOAD testing
    try {
        const uploadResponse = await axios.put(uploadEndpoint, {});
        uploadStatus.lastSuccess = new Date();
        uploadStatus.result = uploadResponse.data;
    } catch (error) {
        if (error.response?.data?.startsWith(validUpload)) {
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
        if (error.response?.data?.startsWith(validGet)) {
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

    res.status(200).send({
        uploadStatus,
        getStatus
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});