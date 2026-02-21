const admin = require('firebase-admin');
const path = require('path');
const serviceAccount = require('../../secret/directory.json');
const dataPath = path.resolve(__dirname, serviceAccount.fbsa_dir);

console.log('datapath',dataPath);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(dataPath),
  });
}

module.exports = admin;