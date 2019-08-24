var EmailConfig = require("../models/email_config");
var fs = require("fs");
const admin = require('firebase-admin');
const functions = require('firebase-functions');
let serviceAccount = require('../credentials/firestore-service-account.json');

admin.initializeApp(functions.config().firebase);
let firestore_prod = admin.firestore();

const id = "notify_new_license";

const param = JSON.parse(fs.readFileSync(__dirname + "/email_templates/" + id + ".json"));
const template = fs.readFileSync(__dirname + "/email_templates/" + id + ".pug");
param.template = template.toString();
firestore_prod.collection(EmailConfig.prototype.collectionName)
    .doc(id).set(param).then(doc => {
    console.log(doc)
}).catch(err => console.log(err));