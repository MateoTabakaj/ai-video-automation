app.get('/generate', async () => {
  await generateScript();
  await createVoice();
  await buildVideo();
  await upload();
  await post();
});
