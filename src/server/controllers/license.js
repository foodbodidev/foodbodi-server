let TokenHandler = require("../utils/token");
let ErrorHandler = require("../utils/response_handler");
let ErrorCodes = require("../utils/error_codes");
const firestoreFactory = require("../environments/firestore_factory");
const firestore = firestoreFactory();
const licenseDB = firestore.collection(__License.prototype.collectionName());
let License = require("../models/license");

exports.create = (req, res, next) => {
    let license = new License(req.body);
    let {restaurant_id} = req.body;
    let bossId = TokenHandler.getEmail(req);
    license.boss_id(bossId);
    license.created_date(new Date());
    licenseDB.where("restaurant_id", "==", restaurant_id)
        .get()
        .then(snapshot => {
            if (snapshot.length > 0) {
                ErrorHandler.error(res, ErrorCodes.ERROR, "License exists");
            } else {
                return licenseDB.doc().add(license.toJSON())
            }
        })
        .then((doc) => {
            license.id(doc.id);
            ErrorHandler.success(res, license.toJSON())
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
                if (snapshot.length < 1) {
                    ErrorHandler.error(res, ErrorCodes.ERROR, "License not found");
                } else {
                    let l = new License(snapshot[0].data(), snapshot[0].id);
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

