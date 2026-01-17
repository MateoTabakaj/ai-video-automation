

import fetch from 'node-fetch';


export async function generateScript(content) {
const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + process.env.GEMINI_KEY, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
contents: [{ parts: [{ text: content.prompt }] }]
})
});
const data = await response.json();
return data.candidates[0].content.parts[0].text;
}