import express from 'express';
import { generateScript } from './video/script.js';
import { createVoice } from './video/voice.js';
import { buildVideo } from './video/buildVideo.js';
import { uploadVideo } from './video/upload.js';
import { autoPost } from './post/poster.js';

const app = express();

// Define your content types here
// (Add your own types or import from a config file)
const CONTENT_TYPES = [
  { name: "storytelling" },
  { name: "facts" },
  { name: "motivation" }
];

app.get('/generate', async (req, res) => {
  try {
    const content = CONTENT_TYPES[Math.floor(Math.random() * CONTENT_TYPES.length)];
    const script = await generateScript(content);
    const audio = await createVoice(script);
    const video = await buildVideo(audio);
    const url = await uploadVideo(video);

    // Read options from URL
    const options = {
      youtube: req.query.youtube === "1",
      tiktok: req.query.tiktok === "1",
      instagram: req.query.instagram === "1"
    };

    await autoPost(video, content.name, options);

    res.send({ status: 'ok', type: content.name, url });
  } catch (e) {
    console.error(e);
    res.status(500).send('error');
  }
});

app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: Arial; text-align: center; margin-top: 50px;">
      <h1>Go to Generate Video Automation</h1>
      <a href="/generate?youtube=1&tiktok=0&instagram=1">
        <button style="padding: 10px 20px; font-size: 16px;">
          Click Here
        </button>
      </a>
    </div>
  `);
});

app.listen(8080, () => {
  console.log('Server running on port 8080');
});
