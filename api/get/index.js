const azure = require('azure-storage');
const blobServiceString = BlobServiceClient.fromConnectionString(process.env.AzureBlobConnectionString);

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.query.uuid || (req.body && req.body.uuid)) {
        const blobUUID = req.query.uuid || req.body.uuid;

        blobServiceString.getBlobToText('linx-container', blobUUID, function(error, blobContent, blob) {
            if (!error) {
                context.res = {
                    // status: 200, /* Defaults to 200 */
                    body: blobContent
                };
            }
            else {
                context.res = {
                    status: 500,
                    body: "Error fetching blob: " + error
                };
            }
            context.done();
        });
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a uuid on the query string or in the request body"
        };
        context.done();
    }
};
