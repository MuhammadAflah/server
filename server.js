const express = require('express');
const AWS = require('aws-sdk');
require('dotenv').config();

const app = express();
const port = 3000;

const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN;
const s3BucketName = process.env.BUCKET_NAME;
const imageKey = process.env.S3_BUCKET_IMAGE_URL;
const region = 'ap-northeast-1';

// Configure AWS SDK with credentials
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  // signatureVersion: process.env.SIGNATURE_VERSION,
  region: region,
});

app.get('/', (req, res) => {

  const s3 = new AWS.S3();

  // Generate a signed URL with a 5-minute expiry for the image file
  const params = {
    Bucket: s3BucketName,
    Key: imageKey,
    Expires: 120, // 5 minutes in seconds
  };

  s3.getSignedUrl('getObject', params, (err, url) => {
    if (err) {
      console.error('Error generating signed URL:', err);
      res.sendStatus(500);
    } else {
      console.log('Signed URL:', url);
      res.send(url)
      return res.status(200).send("Check console for Signed URL"); //send message to see in console
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
