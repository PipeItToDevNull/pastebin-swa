# KittyPost
An Azure Static Web App with API functions for uploading and returning plain text markdown files to be displayed on the site dynamically.

## Variables
`.env.example` is used to handle the SWA frontend. These entries should be placed into your Github repo Secrets & Variables area as Variables

The following should be entered as Environment Variables in your Azure SWA dashboard.
- `REACT_APP_URL`
    - The URL that your website will be running under
- `REACT_APP_BLOB_CONTAINER`
    - The Azure blob container name that you used in `parameters.json`
- `AzureBlobConnectionString`
    - The Azure blob connection string that you find in the Azure control panel for your created blob storage

## APIs
### Put
The upload function listens on `/api/upload` for PUT or POST requests. The upload is stored in Azure blob storage and a UUID appended to a URL is returned to the client in the format `https://contoso.com/UUID`

#### Example
##### Basic upload
```
curl -T test.md https://contoso.com/api/upload
curl -H "Content-Type: text/markdown" -T test.md https://contoso.com/api/upload
```

##### HTML upload
```
curl -H "Content-Type: text/html" -T test.html https://contoso.com/api/upload
```

### Get
The get function listens on `/api/get` and is only intended to be used by the SWA to request a blob based on the UUID in the URL.

## Deploying the ARM template
Parameters for the ARM `template.json` are defined in `parameters.json`.

```bash
az login
az group create --name ExampleGroup --location eastus2
az deployment group create --name ExampleDeployment --resource-group ExampleGroup --template-file ./template.json --parameters ./parameters.json
```

Once deployed, the SWA will now be pointed at your repo and is waiting for a build to be submitted. You must create and configure your own GithubAction for this portion of the deployment.

## Technical notes
- `staticwebapp.config.json` is used to route all URLs back to index.html, this allows the React router to hand off UUID URLs to the API.
