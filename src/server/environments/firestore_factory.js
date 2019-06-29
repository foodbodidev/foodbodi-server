const admin = require('firebase-admin');
const functions = require('firebase-functions');
let serviceAccount = require('../credentials/firestore-service-account.json');
module.exports = () => {
    if (!this.firestore) {
        const env = process.env.FOODBODI_ENV || "dev";
        if (env === "dev") {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            this.firestore = admin.firestore();
        } else if (env === "prod") {
            admin.initializeApp(functions.config().firebase);
            this.firestore = admin.firestore();
        } else if (env === "test") {
            //TODO : mock firestore
        }
    }
    return this.firestore;

};