let TokenHandler = require("../utils/token");
let ErrorHandler = require("../utils/response_handler");
let ErrorCodes = require("../utils/error_codes");
const firestoreFactory = require("../environments/firestore_factory");
const firestore = firestoreFactory();
let License = require("../models/license");
let SystemProp = require("../models/system_property");
let EmailConfig = require("../models/email_config");
let Restaurant = require("../models/restaurant");
const restaurantDB = firestore.collection(Restaurant.prototype.collectionName());
const Status = require("../models/license_status");
const Random = require("../utils/random");
const Sendgrid = require("@sendgrid/mail");
const SECRET_LENGTH = 6;

exports.notifyManager = (req, res, next) => {
    const apiKey = process.env.SENDGRID_API_KEY;
    const {restaurant_id} = req.query;
    const template = "notify_new_license";
    var to, subject, html, licenseInfo, restaurantInfo, bossInfo, bossId;
    if (apiKey) {
        Sendgrid.setApiKey(apiKey);
        restaurantDB.doc(restaurant_id).get().then(r => {
           if (r.exists) {
               let restaurant = new Restaurant(r.data(), r.id);
               restaurantInfo = r.data();
               licenseInfo = restaurant.license().toJSON(false, true);
               bossId = restaurant.license().bossId();
               return firestore.collection("users").doc(bossId).get()
           } else {
               throw "Restaurant not exists";
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

exports.approve = (req, res, next) => {
    let {id, secret} = req.query;
    if (id) {
        restaurantDB.doc(id).get()
            .then(doc => {
               if (doc.exists) {
                   const restaurant = new Restaurant(doc.data(), doc.id);
                   if (restaurant.license().secretApprove() === secret) {
                       const updateData = new Restaurant();
                       const updateLicese = new License();
                       updateLicese.approve();
                       updateData.license(updateLicese);
                       return restaurantDB.doc(id).update(updateData.toJSON(true, false))
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
        restaurantDB.doc(id).get()
            .then(doc => {
                if (doc.exists) {
                    const restaurant = new Restaurant(doc.data(), doc.id);
                    if (restaurant.license().secretDeny() === secret) {
                        const updateData = new Restaurant();
                        const updateLicese = new License();
                        updateLicese.deny();
                        updateData.license(updateLicese);
                        return restaurantDB.doc(id).update(updateData.toJSON(true, false))
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

