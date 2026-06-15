// Express server that provides paste APIs and serves the built frontend.
const crypto = require('crypto');
const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs/promises');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// Load environment variables from the centralized repo-root .env file.
dotenv.config({ path: path.join(rootDir, '.env') });

const app = express();
const port = Number(process.env.PORT) || 3000;
const uuidRegex = /^[0-9a-f]{8}$/i;
const storageDirSetting = process.env.STORAGE_DIR || 'src/data';
const storageDir = path.isAbsolute(storageDirSetting)
    ? storageDirSetting
    : path.resolve(rootDir, storageDirSetting);
const buildDir = path.resolve(rootDir, 'build');
const bodySizeLimit = process.env.MAX_BODY_SIZE || '1mb';

// Maps a paste ID to its JSON storage file path.
function getPastePath(pasteId) {
    return path.join(storageDir, `${pasteId}.json`);
}

// Logs request method, URL, status, and latency for every response.
app.use((req, res, next) => {
    const startedAt = Date.now();

    res.on('finish', () => {
        const durationMs = Date.now() - startedAt;
        console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`);
    });

    next();
});

// Returns stored paste content by UUID.
app.get('/api/download', async (req, res) => {
    const pasteId = String(req.query.uuid || '');

    if (!pasteId || !uuidRegex.test(pasteId)) {
        res.status(400).send('Invalid or missing uuid in query');
        return;
    }

    try {
        const raw = await fs.readFile(getPastePath(pasteId), 'utf8');
        const storedPaste = JSON.parse(raw);
        const decodedText = Buffer.from(storedPaste.data, 'base64').toString('utf8');

        res.setHeader('Content-Type', storedPaste.contentType || 'text/plain');
        res.send(decodedText);
    } catch (err) {
        if (err.code === 'ENOENT') {
            res.status(404).send('The specified paste does not exist');
        } else {
            res.status(500).send(`An error occurred downloading the paste: ${err.message}`);
        }
    }
});

// Accepts raw text/markdown/html payloads and stores them as a paste.
app.put('/api/upload', express.raw({ type: () => true, limit: bodySizeLimit }), async (req, res) => {
    const pasteId = crypto.randomUUID().split('-')[0];
    const mimetype = (req.headers['content-type'] || 'text/plain').split(';')[0];
    const text = Buffer.isBuffer(req.body)
        ? req.body.toString('utf8')
        : typeof req.body === 'string'
            ? req.body
            : '';

    if (!text) {
        res.status(400).send('Request body is required');
        return;
    }

    try {
        await fs.writeFile(getPastePath(pasteId), JSON.stringify({
            contentType: mimetype,
            data: Buffer.from(text, 'utf8').toString('base64')
        }), 'utf8');

        const proto = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.headers['x-forwarded-host'] || req.headers.host;
        res.send(`${proto}://${host}/${pasteId}\n`);
    } catch (err) {
        res.status(500).send(`An error occurred uploading the paste: ${err.message}`);
    }
});

// Shared health response used by both health endpoints.
async function sendHealth(res) {
    try {
        await fs.mkdir(storageDir, { recursive: true });
        const storedFiles = await fs.readdir(storageDir);

        res.status(200).send({
            status: 'ok',
            storage: {
                type: 'local-filesystem',
                path: storageDir,
                totalPastes: storedFiles.filter((name) => name.endsWith('.json')).length
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: err.message
        });
    }
}

// Root health endpoint for container checks.
app.get('/health', async (req, res) => {
    await sendHealth(res);
});

app.use(express.static(buildDir));

// Serves the SPA entrypoint for non-API routes.
app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
        next();
        return;
    }

    const indexPath = path.join(buildDir, 'index.html');
    res.sendFile(indexPath);
});

const pasteMaxAgeHours = Number(process.env.VITE_PASTE_MAX_AGE_HOURS) || 24;
const PASTE_MAX_AGE_MS = pasteMaxAgeHours * 60 * 60 * 1000;
const cleanupIntervalHours = Number(process.env.CLEANUP_INTERVAL_HOURS) || 1;
const CLEANUP_INTERVAL_MS = cleanupIntervalHours * 60 * 60 * 1000;

// Removes paste files older than the configured retention window.
async function cleanupExpiredPastes() {
    let deleted = 0;
    try {
        const files = await fs.readdir(storageDir);
        const now = Date.now();
        for (const file of files) {
            if (!file.endsWith('.json')) continue;
            const filePath = path.join(storageDir, file);
            const stat = await fs.stat(filePath);
            if (now - stat.mtimeMs > PASTE_MAX_AGE_MS) {
                await fs.unlink(filePath);
                deleted++;
            }
        }
    } catch (err) {
        console.error(`Cleanup error: ${err.message}`);
    }
    if (deleted > 0) {
        console.log(`${new Date().toISOString()} Cleanup deleted ${deleted} expired paste(s)`);
    }
}

// Initializes storage, starts HTTP server, and schedules periodic cleanup.
async function startServer() {
    try {
        await fs.mkdir(storageDir, { recursive: true });

        app.listen(port, () => {
            console.log('KittyPost server started');
            console.log(`Listening on port ${port}`);
            console.log(`Serving static files from ${buildDir}`);
            console.log(`Using local storage at ${storageDir}`);
            console.log(`Max request body size is ${bodySizeLimit}`);
            console.log(`Paste retention: ${pasteMaxAgeHours} hour(s), cleanup interval: ${cleanupIntervalHours} hour(s)`);
            console.log('Available endpoints: GET /health, PUT /api/upload, GET /api/download?uuid=<id>');
        });

        // Run once at startup to catch anything that expired while the container was down
        await cleanupExpiredPastes();
        setInterval(cleanupExpiredPastes, CLEANUP_INTERVAL_MS);
    } catch (err) {
        console.error(`Failed to initialize local storage: ${err.message}`);
        process.exit(1);
    }
}

// Exits cleanly on Ctrl+C in local development.
process.on('SIGINT', () => {
    process.exit();
});

startServer();
