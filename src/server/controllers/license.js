let TokenHandler = require("../utils/token");
let ErrorHandler = require("../utils/response_handler");
let ErrorCodes = require("../utils/error_codes");
const firestoreFactory = require("../environments/firestore_factory");
const firestore = firestoreFactory();
let License = require("../models/license");
const licenseDB = firestore.collection(License.prototype.collectionName());
const Status = require("../models/license_status");
const Random = require("../utils/random");
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
                ErrorHandler.success(res, license.toJSON())
            }
        })
        .catch(error => {
            ErrorHandler.error(res, ErrorCodes.ERROR, error);
        });

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

