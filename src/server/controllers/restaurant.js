const validation = require("../utils/validation");
const ErrorHandler = require("../utils/response_handler");
const ErrorCodes = require("../utils/error_codes");
// const SearchInfo = require("../utils/search_info");
let GeoHash = require("latlon-geohash");
let License = require("../models/license");
const firestoreFactory = require("../environments/firestore_factory");
const firestore = firestoreFactory();
let Random = require("../utils/random");

let Restaurant = require("../models/restaurant");
let Food = require("../models/food");
let TokenHandler = require("../utils/token");

let validator = require("validator");
const SECRET_LENGTH = 6;

exports.create = (req, res, next) => {
    const restaurant = new Restaurant(req.body);
    const creator = TokenHandler.getEmail(req);
    restaurant.creator(creator);
    restaurant.created_date(new Date());
    let license = restaurant.license();
    license.secretApprove(Random.randomString(SECRET_LENGTH));
    license.secretDeny(Random.randomString(SECRET_LENGTH));

    if (req.body.foods) {
        const caloValues = req.body.foods.map((value, index) => value);
        restaurant.caloValues(caloValues);
    }

    firestore.collection(restaurant.collectionName()).add(restaurant.toJSON(true)).then((doc) => {
        restaurant.id(doc.id);
        return restaurant;
    }).then((data) => {
        if (req.body.foods) {
            let batch = firestore.batch();
            for (let item of req.body.foods) {
                let food = new Food(item);
                food.restaurant_id(restaurant.id());
                let ref = firestore.collection(Food.prototype.collectionName()).doc();
                batch.set(ref, food.toJSON());
            }
            batch.commit().then(result => {
                let json = restaurant.toJSON();
                ErrorHandler.success(res, json);
            })
        } else {
            ErrorHandler.success(res, restaurant.toJSON(false));
        }
    }).catch(error => {
        console.log(error);
        ErrorHandler.error(res, ErrorCodes.RESTAURANT_CREATE_FAIL, error.message);
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
                    restaurant : restaurant.toJSON( false)});
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
        let update_data = new Restaurant(req.body);
        let ref = firestore.collection(Restaurant.prototype.collectionName()).doc(id);
        ref.update(update_data.toJSON( false)).then(doc => {
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
                result.push(r.toJSON(false));
            });
            ErrorHandler.success(res, {restaurants : result});
        }).catch(err => {
            ErrorHandler.error(res, ErrorCodes.ERROR, err.message);
    });
};

exports.myRestaurant = (req, res, next) => {
    const email = TokenHandler.getEmail(req);
    firestore.collection(Restaurant.prototype.collectionName())
        .where("creator", "==", email)
        .get()
        .then(snapshot => {
            let result = [];
            snapshot.forEach(item => {
                const restaurant = new Restaurant(item.data(), item.id);
                result.push(restaurant);
            });
           ErrorHandler.success(res, {restaurants : result});
        }).catch(error =>{
            ErrorHandler.error(res, ErrorCodes.ERROR, error);
    });
};