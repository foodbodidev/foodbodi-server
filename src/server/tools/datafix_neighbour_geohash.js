const admin = require('firebase-admin');
const functions = require('firebase-functions');
let serviceAccount = require('../credentials/firestore-service-account.json');
let Restaurant = require("../models/restaurant");

admin.initializeApp(functions.config().firebase);
let firestore_prod = admin.firestore();

firestore_prod.collection("restaurants").get()
.then(snapshot => {
    snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        let r = new Restaurant(doc.data());
        firestore_prod.collection("restaurants").doc(doc.id)
            .update({"neighbour_geohash" : r.calculateNeighbour()})
            .then(result => console.log(result));
    });
})
    .catch(err => {
        console.log('Error getting documents', err);
    });