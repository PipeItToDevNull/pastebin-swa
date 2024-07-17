const { BlobServiceClient } = require('@azure/storage-blob');


module.exports = async function (context, req) {
    const uuid = req.params.uuid; // Get the UUID from the request

    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AzureBlobConnectionString);
    const containerClient = blobServiceClient.getContainerClient('linx-container'); // define the azure storage container to be used
    const blockBlobClient = containerClient.getBlockBlobClient(uuid);

    try {
        const downloadBlockBlobResponse = await blockBlobClient.download(0);
        const blobContent = (await streamToBuffer(downloadBlockBlobResponse.readableStreamBody)).toString();

        context.res = {
            body: blobContent
        };
    } catch (err) {
        context.res = {
            status: 500,
            body: `An error occurred downloading the blob: ${err.message}`
        };
    }
}

// Helper function to stream the blob to a Buffer
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