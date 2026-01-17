import express from 'express';
import { generateScript } from './video/script.js';
import { createVoice } from './video/voice.js';
import { buildVideo } from './video/buildVideo.js';
import { uploadVideo } from './video/upload.js';
import { autoPost } from './post/poster.js';


const app = express();
app.get('/generate', async (req, res) => {
try {
const content = CONTENT_TYPES[Math.floor(Math.random() * CONTENT_TYPES.length)];
const script = await generateScript(content);
const audio = await createVoice(script);
const video = await buildVideo(audio);
const url = await uploadVideo(video);
await autoPost(video, content.name);
res.send({ status: 'ok', type: content.name, url });
} catch (e) {
console.error(e);
res.status(500).send('error');
}
});


app.listen(8080);