let ErrorHandler = require("../utils/response_handler");
let ErrorCodes = require("../utils/error_codes");
const firestoreFactory = require("../environments/firestore_factory");
const firestore = firestoreFactory();
const SystemProp = require("../models/system_property");
const systemPropDB = firestore.collection(SystemProp.prototype.collectionName);
const LICENSE_PERMISSION_KEY = "license_permission_key";
module.exports = (req, res, next) => {
    let {token} = req.query;
    if (token) {
        systemPropDB.doc(LICENSE_PERMISSION_KEY)
            .get().then(doc => {
            if (doc.exists) {
                let prop = new SystemProp(doc.data(), doc.id);
                if (token === prop.value()) {
                    next()
                } else {
                    ErrorHandler.error(res, ErrorCodes.UNAUTHORIZED, "Wrong token")
                }
            } else {
                ErrorHandler.error(res, ErrorCodes.UNAUTHORIZED,  LICENSE_PERMISSION_KEY + " has not been set up");
            }
        });
        next();
    } else {
        ErrorHandler.error(res, ErrorCodes.UNAUTHORIZED, "Require token")
    }
};