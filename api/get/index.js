const { BlobServiceClient } = require('@azure/storage-blob');

module.exports = async function (context, req) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AzureBlobConnectionString);
    const blobUUID = req.params.uuid;
    const containerClient = blobServiceClient.getContainerClient('linx-container');
    const blockBlobClient = containerClient.getBlockBlobClient(blobUUID);

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