# Pastebin-Upload
An Azure function that listens on `/api/upload` for PUT requests. The upload is stored in Azure blob storage and a UUID appended to a URL is returned to the client.

This is intended to be used in a pastebin SWA which will dynamically load a text file based on its ID in the returned URL `https://paste.contoso.com/UUID`

This function is deployed via VSCode and the Azure Function extension.