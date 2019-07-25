let TokenHandler = require("../utils/token");
let ErrorHandler = require("../utils/response_handler");
let ErrorCodes = require("../utils/error_codes");
const firestoreFactory = require("../environments/firestore_factory");
const firestore = firestoreFactory();
let License = require("../models/license");
const licenseDB = firestore.collection(License.prototype.collectionName());
const Status = require("../models/license_status");

exports.create = (req, res, next) => {
    let license = new License(req.body);
    let {restaurant_id} = req.body;
    let bossId = TokenHandler.getEmail(req);
    license.boss_id(bossId);
    license.created_date(new Date());
    licenseDB.where("restaurant_id", "==", restaurant_id)
        .get()
        .then(snapshot => {
            let exist = false;
            if (snapshot.docs.length > 0) {
                let data = snapshot.docs[0].data();
                exist = Status.WAITING.key === data.status || Status.APPROVED.key === data.status;
            } else {
                exist = false;
            }
            if (exist) {
                ErrorHandler.error(res, ErrorCodes.ERROR, "License exists");
            } else {
                return licenseDB.add(license.toJSON())
            }
        })
        .then((doc) => {
            if (!!doc && doc.exists) {
                license.id(doc.id);
                ErrorHandler.success(res, license.toJSON())
            }
        })
        .catch(error => {
            ErrorHandler.error(res, ErrorCodes.ERROR, error.message);
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
                    ErrorHandler.success(res, l.toJSON());
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
    let {id} = req.query;
    if (id) {
        let l = new License({});
        l.approve();
        licenseDB.doc(id).update(l.toJSON())
            .then(doc => {
                res.render()
            }).catch(error => {
                ErrorHandler.error(res, ErrorCodes.ERROR, error.message)
        })
    } else {
        ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Missing license id");
    }
};

exports.deny = (req, res, next) => {
    let {id} = req.query;
    if (id) {
        let l = new License({});
        l.deny();
        licenseDB.doc(id).update(l.toJSON())
            .then(doc => {
                res.render()
            }).catch(error => {
            ErrorHandler.error(res, ErrorCodes.ERROR, error.message)
        })
    } else {
        ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Missing license id");
    }
};

