import { Storage } from '@google-cloud/storage';


export async function uploadVideo(file) {
const storage = new Storage();
const bucket = storage.bucket('ai-generated-videos');
await bucket.upload(file);
return `https://storage.googleapis.com/ai-generated-videos/${file.split('/').pop()}`;
}