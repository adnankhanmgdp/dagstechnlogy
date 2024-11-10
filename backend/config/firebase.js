require('dotenv').config();
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(require(process.env.GOOGLE_APPLICATION_CREDENTIALS))
});
