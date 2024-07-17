const { BlobServiceClient } = require('@azure/storage-blob');
const uuid = require('uuid');

module.exports = async function (context, req) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AzureWebJobsStorage);
    const containerClient = blobServiceClient.getContainerClient('linx-container'); // define the azure storage container to be used
    const blobUUID = uuid.v4(); // generate a UUID into a variable
    const blockBlobClient = containerClient.getBlockBlobClient(blobUUID);
    const text = req.body;
    const site = "https://victorious-wave-0a02a5a0f.5.azurestaticapps.net";

    try {
        await blockBlobClient.upload(text, text.length);
        context.res = { body: `${site}/${blobUUID}` };
    } catch (err) {
        context.res = { status: 500, body: `An error occurred uploading the text: ${err.message}` };
    }
}