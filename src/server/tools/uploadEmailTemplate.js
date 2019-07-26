var EmailConfig = require("../models/email_config");
var fs = require("fs");

const firestoreFactory = require("../environments/firestore_factory");
const firestore = firestoreFactory();
const id = "notify_new_license";

const param = JSON.parse(fs.readFileSync(__dirname + "/email_templates/" + id + ".json"));
const template = fs.readFileSync(__dirname + "/email_templates/" + id + ".pug");
param.template = template.toString();
firestore.collection(EmailConfig.prototype.collectionName)
    .doc(id).set(param).then(doc => {
    console.log(doc.data())
}).catch(err => console.log(err));