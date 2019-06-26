const admin = require('firebase-admin');
const functions = require('firebase-functions');

module.exports = () => {
    if (this.firestore) {
        return this.firestore;
    } else {
        /*if (env === "dev") {
            //TODO :connect with emulator
        } else if (env === "prod") {
            //TODO : connect to firestore
        }*/

        admin.initializeApp(functions.config().firebase);
        this.firestore = admin.firestore();
    }

};