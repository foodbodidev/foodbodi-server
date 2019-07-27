let TokenHandler = require("../utils/token");
let ErrorHandler = require("../utils/response_handler");
let ErrorCodes = require("../utils/error_codes");
const firestoreFactory = require("../environments/firestore_factory");
const firestore = firestoreFactory();
let License = require("../models/license");
let SystemProp = require("../models/system_property");
let EmailConfig = require("../models/email_config");
let Restaurant = require("../models/restaurant");
const licenseDB = firestore.collection(License.prototype.collectionName());
const Status = require("../models/license_status");
const Random = require("../utils/random");
const Sendgrid = require("@sendgrid/mail");
const SECRET_LENGTH = 6;

exports.create = (req, res, next) => {
    let license = new License(req.body);
    let {restaurant_id} = req.body;
    let bossId = TokenHandler.getEmail(req);
    license.boss_id(bossId);
    license.created_date(new Date());
    license.secretApprove(Random.randomString(SECRET_LENGTH));
    license.secretDeny(Random.randomString(SECRET_LENGTH));
    licenseDB.where("restaurant_id", "==", restaurant_id)
        .get()
        .then(snapshot => {
            let exist = false;
            if (snapshot.docs.length > 0) {
                snapshot.forEach(doc => {
                    let data = doc.data();
                    if (Status.WAITING.key === data.status || Status.APPROVED.key === data.status) exist = true;
                });
            } else {
                exist = false;
            }
            if (exist) {
                throw "License exists";
            } else {
                return licenseDB.add(license.toJSON(false, true))
            }
        })
        .then((doc) => {
            if (!!doc) {
                license.id(doc.id);
                ErrorHandler.success(res, license.toJSON());
            }
        })
        .catch(error => {
            console.log("Create license error" + error);
            ErrorHandler.error(res, ErrorCodes.ERROR, error);
        });

};

exports.notifyManager = (req, res, next) => {
    const apiKey = process.env.SENDGRID_API_KEY;
    const from = process.env.OWNER_EMAIL;
    const {id} = req.query;
    const template = "notify_new_license";
    var to, subject, html, licenseInfo, restaurantInfo, bossInfo, bossId;
    if (apiKey) {
        Sendgrid.setApiKey(apiKey);
        licenseDB.doc(id).get().then(license => {
           if (license.exists) {
               let l = new License(license.data(), license.id);
               const restaurantId = l.restaurant_id();
               bossId = l.boss_id();
               licenseInfo = l.toJSON(false, true);
               return firestore.collection(Restaurant.prototype.collectionName()).doc(restaurantId).get()
           } else {
               throw "License not exists";
           }
        }).then(r => {
            if (r.exists) {
                restaurantInfo = new Restaurant(r.data(), r.id).toJSON(false);
                return firestore.collection("users").doc(bossId).get()
            } else {
                throw "Restaurant not found";
            }
        }).then(u => {
            if (u.exists) {
                bossInfo = u.data();
                return firestore.collection(EmailConfig.prototype.collectionName).doc(template).get()
            } else {
                throw "User " + bossId + " not found";
            }
        }).then((emailCf) => {
            if (emailCf.exists) {
                const cf = new EmailConfig(emailCf.data(), emailCf.id);
                const msg = cf.compile({
                    licenseInfo : licenseInfo,
                    restaurantInfo : restaurantInfo,
                    bossInfo : bossInfo,
                });
                console.log("Trying to send email to " + msg.to + ": " + msg.subject);
                return Sendgrid.send(msg);
            } else {
                throw "Missing email config " + template;
            }
        }).then(result => {
            ErrorHandler.success(res, {message : "Email sent"})
        }).catch(error => {
            ErrorHandler.error(res, ErrorCodes.ERROR, error);
        });

    } else {
        ErrorHandler.error(res, ErrorCodes.ERROR, "Mail service has not been set up");
    }
};

exports.get = (req, res, next) => {
    let {restaurant_id} = req.query;
    if (restaurant_id) {
        licenseDB.where("restaurant_id", "==", restaurant_id)
            .get()
            .then(snapshot => {
                if (snapshot.docs.length < 1) {
                    ErrorHandler.error(res, ErrorCodes.ERROR, "License not found");
                } else {
                    let l = new License(snapshot.docs[0].data(), snapshot.docs[0].id);
                    ErrorHandler.success(res, l.toJSON(false, false));
                }
            })
            .catch(error => {
                ErrorHandler.error(res, ErrorCodes.ERROR, error.message)
            })
    } else {
        ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Require restaurant_id")
    }
};

exports.approve = (req, res, next) => {
    let {id, secret} = req.query;
    if (id) {
        let l = new License({});
        l.approve();
        licenseDB.doc(id).get()
            .then(doc => {
               if (doc.exists) {
                   const license = new License(doc.data(), doc.id);
                   if (license.secretApprove() === secret) {
                       return licenseDB.doc(id).update(l.toJSON(true))
                   } else {
                       throw "Secret is not correct";
                   }
               } else {
                   throw "License not exists";
               }
            })
            .then(doc => {
                if (!!doc) {
                    res.render("license_approved_info", {});
                } else {
                    throw "Flow is crashed"
                }
            })
            .catch(error => {
                res.render("error", {message : error})
            })

    } else {
        ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Missing license id");
    }
};

exports.deny = (req, res, next) => {
    let {id, secret} = req.query;
    if (id) {
        let l = new License({});
        l.deny();
        licenseDB.doc(id).get()
            .then(doc => {
                if (doc.exists) {
                    const license = new License(doc.data(), doc.id);
                    if (license.secretDeny() === secret) {
                        return licenseDB.doc(id).delete()
                    } else {
                        throw "Secret is not correct";
                    }
                } else {
                    throw "License not exists";
                }
            })
            .then(doc => {
                if (!!doc) {
                    res.render("license_denied_info", {});
                } else {
                    throw "Unknown error"
                }
            })
            .catch(error => {
                res.render("error", {message : error})
            })
    } else {
        ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Missing license id");
    }
};

