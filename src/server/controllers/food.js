let TokenHandler = require("../utils/token");
let ErrorHandler = require("../utils/response_handler");
const firestoreFactory = require("../environments/firestore_factory");
const firestore = firestoreFactory();
const foodDB = firestore.collection(__Food.prototype.collectionName());

exports.create = (req, res, next) => {
    let food = new __Food(req.body);
    const creator = TokenHandler.getEmail(req);
    food.creator(creator);
    food.created_date(new Date());
    foodDB.add(food.toJSON())
        .then(doc => {
            food.id(doc.id);
            ErrorHandler.success(res, food.toJSON());
        })
        .catch(error => {
            ErrorHandler.error(res, ErrorCodes.CREATE_FOOD_FAIL, error.message);
        })

};

exports.get = (req, res, next) => {
    let {id} = req.params;
    if (id) {
        foodDB.doc(id).get()
        .then(doc => {
            if (doc.exists) {
                let food = new __Food(doc.data(), doc.id);
                return ErrorHandler.success(res, { food : food.toJSON() });
            } else {
                return ErrorHandler.error(res, ErrorCodes.FOOD_NOT_FOUND, "Can not found food " + id);
            }
        }).catch(error=> {
            return ErrorHandler.error(res, ErrorCodes.ERROR, error.message);
        })
    } else {
        ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Missing id");
    }
};

exports.search = (req, res, next) => {
    try {
        let { name, restaurant, calogt, calolt, pricegt, pricelt } = req.query;
        let foodQuery = firestore.collection(__Food.prototype.collectionName()).where('restaurant_id', '==', restaurant)
        .where('name', '==', name)
        .where('calo', '>=', calogt)
        .where('calo', '<=', calolt)
        .where('price', '>=', pricegt)
        .where('price', '<=', pricelt)
        .get()
        .then(snapshot => {
            let arr = [];
            snapshot.forEach(doc => { arr.push({...doc.data(), id: doc.id}) });  
            return ErrorHandler.success(res, arr);
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
    } catch (error) {
        return ErrorHandler.error(res, ErrorCodes.RESTAURANT_CREATE_FAIL, error.message);
    }
};

exports.update = (req, res, next) => {
    let {id} = req.params;
    if (id) {
        foodDB.doc(id).update(req.body)
        .then(doc => {
            return ErrorHandler.success(res, {});
        }).catch(error => {
            return ErrorHandler.error(res, ErrorCodes.ERROR, error.message);
        });
    } else {
        return ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Missing id");
    }
};

exports.delete = (req, res, next) => {
    let {id} = req.params;
    if (id) {
        foodDB.doc(id).delete()
            .then(() => {
                return ErrorHandler.success(res, {})
            })
            .catch(error => {
                return ErrorHandler.error(res, ErrorCodes.ERROR, error.message);
            })
    } else {
        return ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Missing id");
    }
};

exports.import = (req, res, next) => {
    let {restaurant_id, foods} = req.body;
    if (!!restaurant_id && !!foods) {
        let batch = firestore.batch();
        for (let item of foods) {
            let food = new __Food(item);
            food.restaurant_id(restaurant_id);
            let ref = foodDB.doc();
            batch.set(ref, food.toJSON());
        }
        batch.commit().then(result => {
            ErrorHandler.success(res, {});
        }).catch(err => ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, err.message));
    } else {
        ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Missing restaurant_id or foods");
    }
};