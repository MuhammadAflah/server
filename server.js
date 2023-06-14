// const express = require('express');
// const AWS = require('aws-sdk');

// const app = express();
// const port = 3000;

// // AWS SDK Configuration
// AWS.config.update({
//   accessKeyId: 'AKIAVTMTOCLBTL2UXUV2',
//   secretAccessKey: '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',
//   region: 'Asia Pacific (Tokyo) ap-northeast-1',
// });

// // Create a new instance of the S3 service
// const s3 = new AWS.S3();

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });
// app.get('/signed-url', (req, res) => {
//   const signedUrlExpiry = 300; // 5 minutes

//   const params = {
//     Bucket: 'muhammadaflah',
//     Key: 's3://muhammadaflah/mern.webp',
//     Expires: signedUrlExpiry,
//   };

//   // Generate a signed URL
//   try {
//     const signedUrl = s3.getSignedUrl('getObject', params);
//     console.log(signedUrl);
//     res.send(signedUrl);
//   } catch (error) {
//     console.error('AWS SDK error:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });





const express = require('express');
const AWS = require('aws-sdk');
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = 3000;

// AWS SDK Configuration
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'ap-northeast-1',
});

// Create a new instance of the S3 service
const s3 = new AWS.S3();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/signed-url', (req, res) => {
  const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN;
  const imageKey = process.env.S3_BUCKET_IMAGE_URL;

  // Calculate the expiration time
  const expiresInSeconds = 300; // 5 minutes
  const expirationTime = Math.floor(Date.now() / 1000) + expiresInSeconds;

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: imageKey,
    Expires: expiresInSeconds,
  };

  // Generate a signed URL
  try {
    const signedUrl = s3.getSignedUrl('getObject', params);
    const cloudFrontSignedUrl = `https://${cloudFrontDomain}/${imageKey}?Expires=${expirationTime}&Signature=${encodeURIComponent(
      signedUrl.split('Signature=')[1].split('&')[0]
    )}&Key-Pair-Id=${process.env.CLOUDFRONT_KEY_PAIR_ID}`;

    console.log(cloudFrontSignedUrl);
    res.send(cloudFrontSignedUrl);
  } catch (error) {
    console.error('AWS SDK error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
