let TokenHandler = require("../utils/token");
let ErrorHandler = require("../utils/response_handler");
let ErrorCode = require("../utils/error_codes");
const firestoreFactory = require("../environments/firestore_factory");
let DailyLog = require("../models/daliy_log");
let Reservation = require("../models/reservation");
const firestore = firestoreFactory();
const dailyLogDb = firestore.collection(DailyLog.prototype.collectionName);
const reservationDb = firestore.collection(Reservation.prototype.collectionName());

exports.get = (req, res, next) => {
    let {year, month, day} = req.params;
    let email = TokenHandler.getEmail(req);
    let id = DailyLog.prototype.generateId(year, month, day, email);
    dailyLogDb.doc(id)
        .get()
        .then(doc => {
            let log = doc.exists ?  new DailyLog(doc.data(), doc.id) : new DailyLog({});
            let date = Reservation.prototype.createDateString(parseInt(year), parseInt(month), parseInt(day));
            reservationDb.where("date_string", "==", date).where("owner", "==", email)
                .get()
                .then(snapshot => {
                    let result = [];
                    let totalEat = 0;
                    for (let doc of snapshot.docs) {
                        let reser = new Reservation(doc.data(), doc.id);
                        result.push(reser.toJSON());
                        totalEat += !!reser.total() ? reser.total() : 0;

                    }
                    log.eat(totalEat);
                    log.reservations(result);
                    ErrorHandler.success(res, log.toJSON())
                });
        }).catch(error => {
            ErrorHandler.error(res, ErrorCode.ERROR, error);
    })
};

exports.update = (req, res, next) => {
    let {year, month, day} = req.params;
    let email = TokenHandler.getEmail(req);
    let id = DailyLog.prototype.generateId(year, month, day, email);
   let updateLog = new DailyLog(req.body);
   new Promise((resolve, reject) => {
       resolve(updateLog)
   }).then(data => {
      return dailyLogDb.doc(id).get()
   }).then(doc => {
       if (doc.exists) {
           return dailyLogDb.doc(id).update(updateLog.toJSON(false))
       } else {
           updateLog.owner(TokenHandler.getEmail(req));
           return dailyLogDb.doc(id).set(updateLog.toJSON(false));
       }
   }).then(doc => {
       updateLog.setId(id);
       ErrorHandler.success(res, updateLog.toJSON(true));
   }).catch(error => ErrorHandler.error(res, ErrorCode.ERROR, error));

};
