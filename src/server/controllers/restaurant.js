const validation = require("../utils/validation");
const ErrorHandler = require("../utils/response_handler");
const ErrorCodes = require("../utils/error_codes");
const firestoreFactory = require("../environments/firestore_factory");
const firestore = firestoreFactory();
const firebase = require('firebase-admin');

exports.create = (req, res, next) => {
    let val = validation.checkReq({
        type: { type: String, required: true },
        name: { type: String, required: true },
        location: { type: Object, required: true }
    }, req.body)

    if (validation.isObject(val.wrong)) {
        return ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, val.wrong);
    }

    if (val.right.location.latitude && typeof val.right.location.latitude != "number") {
        return ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "latitude must be number");
    }
        
    if (val.right.location.longitude && typeof val.right.location.longitude != "number") {
        return ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "longitude must be number");
    }
    let doc = val.right.location.toString()
    val.right.location = new firebase.firestore.GeoPoint(val.right.location.latitude, val.right.location.longitude)
    
    let restaurantC = firestore.collection('restaurants').doc(doc);
    let getDoc = restaurantC.get()
        .then(doc => {
            if (!doc.exists) {
                let docRef = firestore.collection("restaurants").doc(doc);
                    docRef.set(val.right).then(result => {
                        ErrorHandler.success(res, {});
                    });
                } else {
                    // ErrorHandler.error(res, ErrorCodes.USER_EXISTS, "User already exists");
                }
            })
            .catch(err => {
                ErrorHandler.error(res, ErrorCodes.ERROR, "Create restaurant fail");
            });
}

exports.reads = (req, res, next) => {
    let latitude = req.query.latitude
    let longitude = req.query.longitude
    let distance = req.query.distance

    let doc = {latitude: latitude, longitude: longitude}.toString()

    // ~1 mile of lat and lon in degrees
    // let lat = 0.0144927536231884
    // let lon = 0.0181818181818182

    // let lowerLat = latitude - (lat * distance)
    // let lowerLon = longitude - (lon * distance)

    // let greaterLat = latitude + (lat * distance)
    // let greaterLon = longitude + (lon * distance)

    // let lesserGeopoint = new firebase.firestore.GeoPoint(lowerLat, lowerLon);
    // let greaterGeopoint = new firebase.firestore.GeoPoint(greaterLat, greaterLon);

    // let docRef = firestore.collection("locations")
    // let query = docRef.get("location", isGreaterThan: lesserGeopoint).whereField("location", isLessThan: greaterGeopoint)

}