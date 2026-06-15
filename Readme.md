# KittyPost
A single-container paste app with a React frontend and local filesystem-backed backend.

## Variables
`.env.example` shows the variables used by both the frontend build and the backend server.

The following should be placed in the single root `.env` file or injected into the container environment.
- `VITE_SITE_NAME`
    - The site name embedded into the frontend build.
- `VITE_REPO_URL`
    - The GitHub URL shown in the footer.
- `VITE_PASTE_MAX_AGE_HOURS`
    - How many hours a paste is kept before automatic deletion. Used by both the frontend (retention notice) and the server (cleanup). Default: `24`.
- `CLEANUP_INTERVAL_HOURS`
    - How often the server scans for and deletes expired pastes. Default: `1`.
- `PORT`
    - The port the container listens on.
- `STORAGE_DIR`
    - Where paste files are stored on disk.
- `MAX_BODY_SIZE`
    - Maximum upload size accepted by the API.

## APIs
### Put
The upload function listens on `/api/upload` for PUT requests. The upload is stored on disk and the full URL to the paste is returned to the client, e.g. `https://contoso.com/f046f390`.

#### Example
##### Basic upload
```
curl -T test.txt https://contoso.com/api/upload
curl -T test.md https://contoso.com/api/upload
curl -H "Content-Type: text/markdown" -T test.md https://contoso.com/api/upload
```

##### HTML upload
```
curl -H "Content-Type: text/html" -T test.html https://contoso.com/api/upload
```

### Get
The download function listens on `/api/download` and returns the stored paste for the UUID in the URL.

To run the single container locally:

```bash
npm run build
podman build -t paste-app .
podman run --rm -p 3000:3000 --env-file .env paste-app
```

## Technical notes
- The frontend calls the backend on the same origin via `/api`.
- The backend serves the built React app from `build/`.
- The backend server entrypoint is `src/server.js`.
- The root `.env` file controls both the frontend build-time values and the backend runtime settings.
