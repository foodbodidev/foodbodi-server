const validation = require("../utils/validation");
const ErrorHandler = require("../utils/response_handler");
const ErrorCodes = require("../utils/error_codes");
const firestoreFactory = require("../environments/firestore_factory");
const firestore = firestoreFactory();
let Restaurant = require("../models/restaurant");
let validator = require("validator");

exports.create = (req, res, next) => {
    let val = validation.checkReq({
        type: { type: String, required: true },
        name: { type: String, required: true },
        location: { type: Object, required: true }
    }, req.body);

    if (validation.isObject(val.wrong)) {
        return ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, val.wrong);
    }

    if (val.right.location.latitude && typeof val.right.location.latitude != "number") {
        return ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "latitude must be number");
    }
        
    if (val.right.location.longitude && typeof val.right.location.longitude != "number") {
        return ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "longitude must be number");
    }
    let doc = val.right.location.toString();
    val.right.location = new firebase.firestore.GeoPoint(val.right.location.latitude, val.right.location.longitude)

    const restaurant = new Restaurant(req.body);
    let restaurantRef = firestore.collection().add(restaurant.toJSON())
        .then(doc => {
            const created = new Restaurant(doc.data(), doc.id);
            ErrorHandler.success(res, created.toJSON());
        })
        .catch(error => {
            console.log(error);
            ErrorHandler.error(res, ErrorCodes.RESTAURANT_CREATE_FAIL, "Can not create restaurant");
        })

};

exports.get = (req, res, next) => {
    let {id} = req.params;
    if (id) {
        let ref = firestore.collection("restaurant").doc(id);
        ref.get().then(doc => {
            if (doc.exists) {
                const restaurant = new Restaurant(doc.data());
                ErrorHandler.success(res, {
                    restaurant : restaurant.toJSON()
                });
            } else {
                ErrorHandler.error(res, ErrorCodes.RESTAURANT_NOT_FOUND, "Can not found restaurant " + id);
            }
        })
    } else {
        ErrorHandler.error(res, ErrorCodes.ERROR, "Missing id");
    }
};

exports.update = (req, res, next) => {

};

exports.delete = (req, res, next) => {

};