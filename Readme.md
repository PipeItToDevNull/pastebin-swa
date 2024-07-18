# Pastebin-SWA
An Azure Static Web App with API functions for uploading and returning plain text markdown files to be displayed on the site dynamically.

## APIs
## Put
The upload function listens on `/api/upload` for PUT or POST requests. The upload is stored in Azure blob storage and a UUID appended to a URL is returned to the client in the format `https://contoso.com/UUID`

## Get
The get function listens on `/api/get` and is only intended to be used by the SWA to request a blob based on the UUID in the URL.