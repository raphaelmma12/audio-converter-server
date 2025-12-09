const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const unlinkAsync = promisify(fs.unlink);

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    methods: ['POST', 'GET'],
}));

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/tmp/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'audio-converter' });
});

// Audio conversion endpoint
app.post('/convert-audio', upload.single('audio'), async (req, res) => {
    const startTime = Date.now();

    if (!req.file) {
        return res.status(400).json({ error: 'No audio file provided' });
    }

    const inputPath = req.file.path;
    const outputPath = `/tmp/${Date.now()}-output.mp3`;

    console.log(`[${new Date().toISOString()}] Converting: ${inputPath} -> ${outputPath}`);

    try {
        await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .audioCodec('libmp3lame')
                .audioBitrate('64k')
                .format('mp3')
                .on('start', (cmd) => {
                    console.log('FFmpeg command:', cmd);
                })
                .on('progress', (progress) => {
                    console.log(`Processing: ${progress.percent?.toFixed(2)}%`);
                })
                .on('end', () => {
                    console.log(`Conversion complete in ${Date.now() - startTime}ms`);
                    resolve();
                })
                .on('error', (err) => {
                    console.error('FFmpeg error:', err);
                    reject(err);
                })
                .save(outputPath);
        });

        // Send converted file
        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Disposition': 'attachment; filename="audio.mp3"'
        });

        const readStream = fs.createReadStream(outputPath);
        readStream.pipe(res);

        // Cleanup after sending
        readStream.on('end', async () => {
            try {
                await unlinkAsync(inputPath);
                await unlinkAsync(outputPath);
                console.log('Cleanup complete');
            } catch (err) {
                console.error('Cleanup error:', err);
            }
        });

    } catch (error) {
        console.error('Conversion error:', error);

        // Cleanup on error
        try {
            if (fs.existsSync(inputPath)) await unlinkAsync(inputPath);
            if (fs.existsSync(outputPath)) await unlinkAsync(outputPath);
        } catch (cleanupErr) {
            console.error('Cleanup error:', cleanupErr);
        }

        res.status(500).json({
            error: 'Audio conversion failed',
            details: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🎵 Audio Converter Server running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
});
