import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';


export async function createVoice(text) {
const client = new textToSpeech.TextToSpeechClient();
const file = `/tmp/audio-${Date.now()}.mp3`;
const [res] = await client.synthesizeSpeech({
input: { text },
voice: { languageCode: 'en-US', name: 'en-US-Studio-O' },
audioConfig: { audioEncoding: 'MP3' }
});
fs.writeFileSync(file, res.audioContent);
return file;
}