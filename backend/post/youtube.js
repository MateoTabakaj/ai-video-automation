youtube.videos.insert({
  part: 'snippet,status',
  requestBody: {
    snippet: { title, description },
    status: { privacyStatus: 'public' }
  },
  media: { body: fs.createReadStream(video) }
});
