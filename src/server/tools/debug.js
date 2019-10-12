const admin = require('firebase-admin');
const token = require("../utils/token");
let serviceAccount = require('../credentials/firestore-service-account.json');
const {OAuth2Client} = require('google-auth-library');
const iOS_CLIENT_ID = "513844011252-2qlodmja1av20n55vro79uv0jc5vj3ck.apps.googleusercontent.com";
const WEB_CLIENT_ID = "513844011252-0220ffhr75mivnrv0jub2ue1kkkgckfr.apps.googleusercontent.com";

const client = new OAuth2Client(iOS_CLIENT_ID);
const axios = require('axios');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

async function verify(token) {
    console.info("Verify google token " + token);
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: [iOS_CLIENT_ID, WEB_CLIENT_ID]
    });
    const payload = ticket.getPayload();
    console.info("Google account " + JSON.stringify(payload));
    return payload;
}

let db = admin.firestore();

db.collection("restaurants").doc("19wdIUspOj0FVPJT16xX").delete().then(result => {
        console.log(result);
});