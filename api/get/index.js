const { BlobServiceClient } = require('@azure/storage-blob');

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

module.exports = async function (context, req) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AzureBlobConnectionString);
    const blobUUID = req.query.uuid;

    // Regular expression to validate UUID
    const uuidRegex = /^[0-9a-f]{8}$/i;

    if (!blobUUID || !uuidRegex.test(blobUUID)) {
        context.res = {
            status: 400, // Bad Request
            body: "Invalid or missing uuid in query"
        };
        return;
    }

    const containerClient = blobServiceClient.getContainerClient('linx-container'); // define blob container name
    const blockBlobClient = containerClient.getBlockBlobClient(blobUUID);

    try {
        const downloadBlockBlobResponse = await blockBlobClient.download(0);
        const blobContent = (await streamToBuffer(downloadBlockBlobResponse.readableStreamBody)).toString();
        const mimetype = downloadBlockBlobResponse.contentType; // get the mimetype from the response headers

        context.res = { 
            body: blobContent,
            headers: {
                'Content-Type': mimetype // return the mimetype in the response headers
            }
        };
    } catch (err) {
        if (err.message.includes("The specified blob does not exist.")) {
            context.res = {
                status: 404, // Not Found
                body: "The specified blob does not exist"
            };
        } else {
            context.res = { 
                status: 500, 
                body: `An error occurred downloading the blob: ${err.message}`
            };
        }
    }
}
