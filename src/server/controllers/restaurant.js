const validation = require("../utils/validation");
const ErrorHandler = require("../utils/response_handler");
const ErrorCodes = require("../utils/error_codes");
const SearchInfo = require("../utils/search_info");
let GeoHash = require("latlon-geohash");
const firestoreFactory = require("../environments/firestore_factory");
const firestore = firestoreFactory();

let Restaurant = require("../models/restaurant");
let Food = require("../models/food");

let validator = require("validator");

exports.create = (req, res, next) => {
    const restaurant = new Restaurant(req.body);
    const creator = req.token_data.email;
    restaurant.creator(creator);

    let restaurantRef = firestore.collection(restaurant.collectionName()).add(restaurant.toJSON()).then((doc) => {
        restaurant.id(doc.id);
        ErrorHandler.success(res, restaurant.toJSON());
    }).catch(error => {
        console.log(error);
        ErrorHandler.error(res, ErrorCodes.RESTAURANT_CREATE_FAIL, "Can not create restaurant");
    });

};

exports.get = (req, res, next) => {
    let {id} = req.params;
    let restaurant = null;
    if (id) {
        firestore.collection(Restaurant.prototype.collectionName()).doc(id).get().then(doc => {
            if (doc.exists) {
                restaurant = new Restaurant(doc.data(), doc.id);
                ErrorHandler.success(res, {
                    restaurant : restaurant.toJSON()});
            } else {
                ErrorHandler.error(res, ErrorCodes.RESTAURANT_NOT_FOUND, "Can not found restaurant " + id);
            }
        }).catch(error=> {
            console.log(error);
            ErrorHandler.error(res, ErrorCodes.ERROR, error.message);
        });
    } else {
        ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Missing id");
    }
};

exports.update = (req, res, next) => {
    let {id} = req.params;
    if (id) {
        const update_data = req.body;
        let ref = firestore.collection(Restaurant.prototype.collectionName()).doc(id);
        ref.update(update_data).then(doc => {
                ErrorHandler.success(res, {});

        }).catch(error => {
            console.log(error);
            ErrorHandler.error(res, ErrorCodes.ERROR, error.message);
        });
    } else {
        ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Missing id");
    }

};

exports.delete = (req, res, next) => {
    let {id} = req.params;
    if (id) {
        firestore.collection(Restaurant.prototype.collectionName()).doc(id).detete().then(() => {
            //TODO : find cron op to delete foods
            ErrorHandler.success(res, {});
        }).catch(err => {
            ErrorHandler.error(res, ErrorCodes.ERROR, err.message);
        })

    } else {
        ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Missing id");
    }
};

exports.listFood = (req, res, next) => {
    let {id} = req.params;
    if (id) {
        firestore.collection(Food.prototype.collectionName())
            .where("restaurant_id", "==", id)
            .get()
            .then(snapshot => {
                let result = [];
                snapshot.docs.forEach(item => {
                    let food = new Food(item.data(), item.id);
                    result.push(food.toJSON());
                });
                ErrorHandler.success(res, {foods : result});
            }).catch(err => {
                ErrorHandler.error(res, ErrorCodes.ERROR, err.message);
        })
    } else {
        ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Missing id");
    }
};

exports.list = (req, res, next) => {
    firestore.collection(Restaurant.prototype.collectionName())
        .orderBy("priority").get()
        .then(snapshot => {
            let result = [];
            snapshot.docs.forEach(item => {
                let r = new Restaurant(item.data(), item.id);
                result.push(r.toJSON());
            });
            ErrorHandler.success(res, {restaurants : result});
        }).catch(err => {
            ErrorHandler.error(res, ErrorCodes.ERROR, err.message);
    });
};