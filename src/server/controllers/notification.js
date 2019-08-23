let TokenHandler = require("../utils/token");
let ErrorHandler = require("../utils/response_handler");
let ErrorCodes = require("../utils/error_codes");
const firestoreFactory = require("../environments/firestore_factory");
const firestore = firestoreFactory();

let Notification = require("../models/notification");
let notificationDb = firestore.collection(Notification.prototype.collectionName);

exports.get = (req, res, next) => {

};

exports.markRead = (req, res, next) => {
    let {id} = req.query;
    notificationDb.doc(id)
        .get()
        .then(doc => {
            if (doc.exists) {
                let n = new Notification(doc.data(), doc.id);
                if (n.receiver() !== TokenHandler.getEmail(req)) throw "Permission denied";
                n.markRead();
                notificationDb.doc(id)
                    .update(n.toJSON())
                    .then(result => {
                        ErrorHandler.success(res, {});
                    })
            } else {
                throw "Notification not found"
            }
        }).catch(error => {
            ErrorHandler.error(res, ErrorCodes.ERROR, error);
    })
};

exports.markUnread = (req, res, next) => {
    let {id} = req.query;
    notificationDb.doc(id)
        .get()
        .then(doc => {
            if (doc.exists) {
                let n = new Notification(doc.data(), doc.id);
                if (n.receiver() !== TokenHandler.getEmail(req)) throw "Permission denied";
                n.markUnread();
                notificationDb.doc(id)
                    .update(n.toJSON())
                    .then(result => {
                        ErrorHandler.success(res, {});
                    })
            } else {
                throw "Notification not found"
            }
        }).catch(error => {
        ErrorHandler.error(res, ErrorCodes.ERROR, error);
    });
};

