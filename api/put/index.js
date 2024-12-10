const { BlobServiceClient } = require('@azure/storage-blob');
const uuid = require('uuid');
const blobServiceString = BlobServiceClient.fromConnectionString(process.env.AzureBlobConnectionString);

module.exports = async function (context, req) {
    const containerClient = blobServiceString.getContainerClient('linx-container'); // define the azure storage container to be used
    const blobUUID = uuid.v4().split('-')[0]; // Get the first part of the UUID
    const blockBlobClient = containerClient.getBlockBlobClient(blobUUID);
    const text = req.body;
    const mimetype = req.headers['content-type'] || 'text/plain'; // get the mimetype from the request headers or default to 'text/plain'
    const site = "https://victorious-wave-0a02a5a0f.5.azurestaticapps.net";

    try {
        await blockBlobClient.upload(text, text.length, {
            blobHTTPHeaders: { blobContentType: mimetype } // set the content type
        });
        context.res = { body: `${site}/${blobUUID}` };
    } catch (err) {
        context.res = { status: 500, body: `An error occurred uploading the text: ${err.message}` };
    }
}