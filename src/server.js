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

function getPastePath(pasteId) {
    return path.join(storageDir, `${pasteId}.json`);
}

app.use((req, res, next) => {
    const startedAt = Date.now();

    res.on('finish', () => {
        const durationMs = Date.now() - startedAt;
        console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`);
    });

    next();
});

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

        res.send(`/${pasteId}`);
    } catch (err) {
        res.status(500).send(`An error occurred uploading the paste: ${err.message}`);
    }
});

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

app.get('/api/health', async (req, res) => {
    await sendHealth(res);
});

app.get('/health', async (req, res) => {
    await sendHealth(res);
});

app.use(express.static(buildDir));

app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
        next();
        return;
    }

    const indexPath = path.join(buildDir, 'index.html');
    res.sendFile(indexPath);
});

async function startServer() {
    try {
        await fs.mkdir(storageDir, { recursive: true });

        app.listen(port, () => {
            console.log('KittyPost server started');
            console.log(`Listening on port ${port}`);
            console.log(`Serving static files from ${buildDir}`);
            console.log(`Using local storage at ${storageDir}`);
            console.log(`Max request body size is ${bodySizeLimit}`);
            console.log('Available endpoints: GET /health, GET /api/health, PUT /api/upload, GET /api/download?uuid=<id>');
        });
    } catch (err) {
        console.error(`Failed to initialize local storage: ${err.message}`);
        process.exit(1);
    }
}

process.on('SIGINT', () => {
    process.exit();
});

startServer();
