let TokenHandler = require("../utils/token");
let ErrorHandler = require("../utils/response_handler");
let ErrorCode = require("../utils/error_codes");
const firestoreFactory = require("../environments/firestore_factory");
let DailyLog = require("../models/daliy_log");
const firestore = firestoreFactory();
const dailyLogDb = firestore.collection(DailyLog.prototype.collectionName);

exports.get = (req, res, next) => {
    let {year, month, day} = req.params;
    let email = TokenHandler.getEmail(req);
    let id = DailyLog.prototype.generateId(year, month, day, email);
    dailyLogDb.doc(id)
        .get()
        .then(doc => {
            if (doc.exists) {
                let log = new DailyLog(doc.data(), doc.id);
                ErrorHandler.success(res, log.toJSON(true));
            } else {
                ErrorHandler.success(res, {})
            }
        }).catch(error => {
            ErrorHandler.error(res, ErrorCode.ERROR, error);
    })
};

exports.update = (req, res, next) => {
    let {year, month, day} = req.params;
    let email = TokenHandler.getEmail(req);
    let id = DailyLog.prototype.generateId(year, month, day, email);
   let updateLog = new DailyLog(req.body);
   dailyLogDb.doc(id)
       .get()
       .then(doc => {
           if (doc.exists) {
               return dailyLogDb.doc(id).update(updateLog.toJSON(false))
           } else {
               return dailyLogDb.doc(id).set(updateLog.toJSON(false));
           }
       }).then(doc => {
           updateLog.setId(id);
           ErrorHandler.success(res, updateLog.toJSON(true));
   })
       .catch(error => ErrorHandler.error(res, ErrorCode.ERROR, error));
};
