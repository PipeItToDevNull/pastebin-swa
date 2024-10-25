## APIs
### Put
The upload function listens on `/api/upload` for PUT or POST requests. The upload is stored in Azure blob storage and a UUID appended to a URL is returned to the client in the format `https://contoso.com/UUID`

#### Example
##### Basic upload
```
curl -T test.md https://contoso.com/api/upload
```

##### HTML upload
```
curl -H "Content-Type: text/html" -T test.html https://contoso.com/api/upload
```

### Get
The get function listens on `/api/get` and is only intended to be used by the SWA to request a blob based on the UUID in the URL.
