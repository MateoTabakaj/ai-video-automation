import { exec } from 'child_process';


export function buildVideo(audio) {
const output = `/tmp/video-${Date.now()}.mp4`;
return new Promise((resolve) => {
exec(`ffmpeg -loop 1 -i stock.mp4 -i ${audio} -shortest -vf scale=1080:1920 ${output}`, () => resolve(output));
});
}