# Pastebin-SWA
An Azure Static Web App with API functions for uploading and returning plain text markdown files to be displayed on the site dynamically.

## APIs
### Put
The upload function listens on `/api/upload` for PUT or POST requests. The upload is stored in Azure blob storage and a UUID appended to a URL is returned to the client in the format `https://contoso.com/UUID`

### Get
The get function listens on `/api/get` and is only intended to be used by the SWA to request a blob based on the UUID in the URL.

## Deploying the ARM template

```bash
az login
az group create --name ExampleGroup --location eastus
az deployment group create --name ExampleDeployment --resource-group ExampleGroup --template-file ./template.json --parameters ./parameters.json
```

Once deployed, you will be able to point the generated SWA at your repository and it will create the required GHA to enable CICD on your project.