let ErrorHandler = require("../utils/response_handler");
let ErrorCodes = require("../utils/error_codes");
const firestoreFactory = require("../environments/firestore_factory");
let Ingredient = require("../models/ingredient");
const firestore = firestoreFactory();
let ingredientDb = firestore.collection(Ingredient.prototype.collectionName);

exports.get = (req, res, next) => {
    let {id} = req.params;
    ingredientDb.doc(id)
        .get()
        .then(doc => {
            if (doc.exist) {
                let ingr = new Ingredient(doc.data(), doc.id);
                ErrorHandler.success(res, ingr.toJSON());
            } else {
                ErrorHandler.error(res, ErrorCodes.ERROR, "Not found");
            }
        })
        .catch(error => ErrorHandler.error(res, ErrorCodes.ERROR, error));
};

exports.create = (req, res, next) => {
    let ingr = new Ingredient(req.body);
    ingredientDb.doc()
        .set(ingr.toJSON())
        .then(doc => {
            ErrorHandler.success(res, ingr.toJSON());
        })
        .catch(error => ErrorHandler.error(res, ErrorCodes.ERROR, error));
};

exports.update = (req, res, next) => {
    let {id} = req.params;
    let ingr = new Ingredient(req.body);
    ingredientDb.doc(id)
        .update(ingr.toJSON())
        .then(doc => {
            ErrorHandler.success(res, ingr.toJSON());
        })
        .catch(error => ErrorHandler.error(res, ErrorCodes.ERROR, error));
};

exports.delete = (req, res, next) => {
    let {id} = req.params;
    ingredientDb.doc(id)
        .delete()
        .then(result => ErrorHandler.success(res, {}))
        .catch(error => ErrorHandler.error(res, ErrorCodes.ERROR, error));
};