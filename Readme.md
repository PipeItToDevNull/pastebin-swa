# KittyPost
A single-container paste app with a React frontend and local filesystem-backed backend.

## Variables
All variables are configured via environment variables passed at container launch.

| Variable | Default | Description |
|---|---|---|
| `SITE_NAME` | `KittyPost` | Site name shown in the header and page title. |
| `REPO_URL` | *(empty)* | GitHub URL shown in the footer. Leave blank to link to `#`. |
| `PASTE_MAX_AGE_HOURS` | `24` | How many hours a paste is kept before deletion. Used by the retention notice in the UI and the server-side cleanup job. |
| `CLEANUP_INTERVAL_HOURS` | `1` | How often (in hours) the server scans for and deletes expired pastes. |
| `PORT` | `80` | Port the server listens on inside the container. |
| `STORAGE_DIR` | `/app/data` | Path where paste files are stored. Mount a volume here for persistence. |
| `MAX_BODY_SIZE` | `1mb` | Maximum upload size accepted by the API (Express/bytes format: `1mb`, `512kb`, etc.). |

## Running the container

```bash
podman build -t pastebin-swa .
podman run --rm -p 80:80 \
  -e SITE_NAME=MyPaste \
  -e REPO_URL=https://github.com/you/repo \
  -e PASTE_MAX_AGE_HOURS=48 \
  -e CLEANUP_INTERVAL_HOURS=1 \
  -e STORAGE_DIR=/data \
  -v /host/paste-data:/data \
  pastebin-swa
```

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

## Technical notes
- The frontend calls the backend on the same origin via `/api`.
- The backend serves the built React app from `build/`.
- The backend server entrypoint is `src/server.js`.
- `SITE_NAME`, `REPO_URL`, and `PASTE_MAX_AGE_HOURS` are injected into `index.html` at request time by the server as `window.__CONFIG__`, making them runtime-configurable.
