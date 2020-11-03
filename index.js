const express = require('express');

async function main() {

  process.env.GOOGLE_APPLICATION_CREDENTIALS = './speechtotext.json' // Set downloaded json private key path
      
  // Imports the Google Cloud client library
      
  const speech = require('@google-cloud/speech').v1p1beta1;
  // const speech = require('@google-cloud/speech');
      
  // Creates a client
  const client = new speech.SpeechClient();

  // 1. Create bucket from the google cloud storage
  // 2. Upload audio file to google cloud bucket
  // 3. Copy your audio file uri from the bucket
        
  const audio = {
    uri: 'paste audio file uri'
  };
      
  const config = {
    encoding: 'FLAC',
    sampleRateHertz: '48000',
    languageCode: 'en-US',
    "enableWordTimeOffsets": true,
    audioChannelCount: 2,
  };

  const request = {
    audio: audio,
    config: config,
  };
      
  const [operation] = await client.longRunningRecognize(request);
  // Get a Promise representation of the final result of the job
  const [response] = await operation.promise();
  response.results.forEach(result =>  {
    // console.log(JSON.stringify(result))
    // console.log(`Transcription: ${result.alternatives[0].transcript}`);
    result.alternatives[0].words.forEach(wordInfo => {
      // NOTE: If you have a time offset exceeding 2^32 seconds, use the
      // wordInfo.{x}Time.seconds.high to calculate seconds.
      const startSecs =
        `${wordInfo.startTime.seconds}` +
        '.' +
        wordInfo.startTime.nanos / 100000000;
        const endSecs =
        `${wordInfo.endTime.seconds}` +
        '.' +
        wordInfo.endTime.nanos / 100000000;

        console.log(wordInfo.word, startSecs, endSecs);
    });
  });  
}
main().catch(console.error);








