let TokenHandler = require("../utils/token");
let ErrorHandler = require("../utils/response_handler");
let ErrorCodes = require("../utils/error_codes");
const firestoreFactory = require("../environments/firestore_factory");
let Restaurant = require("../models/restaurant");
let {addIndex, removeIndexOfDocument, updateIndex} = require("./search");
const firestore = firestoreFactory();
const foodDB = firestore.collection(__Food.prototype.collectionName());
const {addCaloToRestaurant, removeCaloFromRestaurant, changeCaloInRestaurant} = require("./cronop");

exports.create = (req, res, next) => {
    let food = new __Food(req.body);
    const creator = TokenHandler.getEmail(req);
    food.creator(creator);
    food.created_date(new Date());
    foodDB.add(food.toJSON())
        .then(doc => {
            food.id(doc.id);
            ErrorHandler.success(res, food.toJSON());
            addIndex(food.searchText(), food.collectionName(), food.id(), food.searchDoc(),
                (result) => console.log("Add indexes for food " + food.id() + " success"),
                error => console.log("Add indexes for food " + food.id() + " fail : " + error));
        })
        .catch(error => {
            ErrorHandler.error(res, ErrorCodes.CREATE_FOOD_FAIL, error.message);
        });
    let ref = firestore.collection(Restaurant.prototype.collectionName())
        .doc(food.restaurant_id());
    let transaction = firestore.runTransaction(t => {
        return t.get(ref).then(r => {
                if (r.exists) {
                    const restaurant = new Restaurant(r.data());
                    restaurant.addCalo(food.calo());
                    t.update(ref, restaurant.getCaloValuesJSON())
                } else {
                    throw "Restaurant " + food.restaurant_id() + " not found";
                }
            })
    }).then(result => {
        console.log("Transaction update restaurant.calo_values success");
    }).catch(error => {
        console.log("Transaction update restaurant.calo_values fail : " + error)
    });



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
    let food = new __Food(req.body);
    let restaurant_id = food.restaurant_id();
    let restaurant;
    if (!!!restaurant_id) return ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Missing restaurant_id");
    if (id) {
        firestore.runTransaction(t => {
            return t.getAll(foodDB.doc(id), firestore.collection(Restaurant.prototype.collectionName()).doc(restaurant_id))
                .then(docs => {
                    if (docs.length !== 2) {
                        throw "Wrong return doc for food or restaurant"
                    }
                    food = new __Food(docs[0].data(), docs[0].id);
                    restaurant = new Restaurant(docs[1].data(), docs[1].id);
                    t.update(foodDB.doc(id), req.body);
                    if (req.body.calo) {
                        restaurant.changeCalo(food.calo(), req.body.calo);
                        t.update(firestore.collection(Restaurant.prototype.collectionName()).doc(food.restaurant_id()), restaurant.getCaloValuesJSON())
                    }
                })
        }).then(result => {
            ErrorHandler.success(res, {});
        }).catch(error => {
            ErrorHandler.error(res, ErrorCodes.ERROR, error);
        });
    } else {
        return ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Missing food id");
    }
};

exports.delete = (req, res, next) => {
    let {id} = req.params;
    let {restaurant_id} = req.query;
    if (!!!restaurant_id) ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Missing restaurant_id");
    if (id) {
        let restaurantDB= firestore.collection(Restaurant.prototype.collectionName());
        firestore.runTransaction(t => {
            return t.getAll(foodDB.doc(id), restaurantDB.doc(restaurant_id))
                .then(docs => {
                    if (docs.length !== 2) {
                        throw "Wrong return doc for food or restaurant"
                    }
                    let food = new __Food(docs[0].data(), docs[0].id);
                    let restaurant = new Restaurant(docs[1].data(), docs[1].id);
                    t.delete(foodDB.doc(id));
                    restaurant.removeCalo(food.calo());
                    t.update(restaurantDB.doc(food.restaurant_id()), restaurant.getCaloValuesJSON())

                    removeIndexOfDocument(food.collectionName(), id,
                        (result) => {
                        console.log("Remove indexes of food " + id + " success")
                    }, error => {
                        console.log("Remove indexes of food " + id + " fail :" + error);
                        })

                })
        }).then(result => {
            ErrorHandler.success(res, {});
        }).catch(error => {
            ErrorHandler.error(res, ErrorCodes.ERROR, error);
        });
    } else {
        return ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Missing food id");
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