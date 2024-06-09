// aws-config.ts
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  endpoint: 'https://storage.yandexcloud.net',
  region: 'ru-central1',
  credentials: {
    accessKeyId: process.env.YANDEX_ACCESS_KEY_ID!,
    secretAccessKey: process.env.YANDEX_SECRET_ACCESS_KEY!,
  },
});

export default s3;
