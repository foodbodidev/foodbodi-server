const admin = require('firebase-admin');
const functions = require('firebase-functions');
let serviceAccount = require('../credentials/firestore-service-account.json');
let Food = require("../models/food");

admin.initializeApp(functions.config().firebase);
let firestore_prod = admin.firestore();

firestore_prod.collection("foods").get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            let r = new Food(doc.data());
            firestore_prod.collection("foods").doc(doc.id)
                .update({"trash" : false})
                .then(result => console.log(result));
        });
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });