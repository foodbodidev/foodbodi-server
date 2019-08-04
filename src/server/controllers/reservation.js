let TokenHandler = require("../utils/token");
let ErrorHandler = require("../utils/response_handler");
let ErrorCode = require("../utils/error_codes");
const firestoreFactory = require("../environments/firestore_factory");
const firestore = firestoreFactory();
let Reservation =  require("../models/reservation");
let Restaurant =  require("../models/restaurant");
let Food =  require("../models/food");
const reservationDb = firestore.collection(Reservation.prototype.collectionName());
const foodDb = firestore.collection(Food.prototype.collectionName());
const restaurantDb = firestore.collection(Restaurant.prototype.collectionName());

exports.create = function (req, res, next) {
    let {foods, restaurant_id} = req.body;

    let restuarantRef = restaurantDb.doc(restaurant_id);
    let reservation = new Reservation({});
    reservation.foods(foods);
    reservation.restaurant_id(restaurant_id);
    reservation.owner(TokenHandler.getEmail(req));
    reservation.create_date(new Date().getTime());

    let amountMap = {};
    let id = Reservation.prototype.createId(restaurant_id, TokenHandler.getEmail(req));
    let ref = reservationDb.doc(id);

    let foodRefs = [];
    reservation.forEachFood((foodId, amount) => {
        foodRefs.push(foodDb.doc(foodId));
        amountMap[foodId] = amount;
    });
    firestore.getAll(...foodRefs, restuarantRef)
        .then(docs => {
            let totalCalo = 0;
            for (let i = 0; i < docs.length; i++) {
                const doc = docs[i];
                if (i === docs.length - 1) {
                    const restaurant = new Restaurant(doc.data(), doc.id);
                    reservation.restaurant_name(restaurant.name());
                } else {
                    let food = new Food(doc.data(), doc.id);
                    let amount = amountMap[food.id()];
                    let calo = food.calo();
                    totalCalo += calo * amount;
                }
            }
            reservation.total(totalCalo);
            return ref.set(reservation.toJSON())
        }).then(doc => {
        reservation.setId(id);
        ErrorHandler.success(res, reservation.toJSON());
    }).catch(error => {
        ErrorHandler.error(res, ErrorCode.ERROR, error)
    });
};

exports.update = function(req, res, next) {
    let {reservation_id} = req.params;
    let {email} = Reservation.prototype.resolveId(reservation_id);
    if (TokenHandler.getEmail(req) !== email) {
        return ErrorHandler.error(res, ErrorCode.UNAUTHORIZED, "This reservation is not yours");
    }

    let {foods, restaurant_id} = req.body;
    let ref = reservationDb.doc(reservation_id);
    let reservation = new Reservation(req.body);
    let foodRefs = [];
    let amountMap = {};

    reservation.forEachFood((foodId, amount) => {
        foodRefs.push(foodDb.doc(foodId));
        amountMap[foodId] = amount;
    });
    firestore.getAll(...foodRefs)
        .then(docs => {
            let totalCalo = 0;
            for (let doc of docs) {
                let food = new Food(doc.data(), doc.id);
                let amount = amountMap[food.id()];
                let calo =  food.calo();
                totalCalo += calo * amount;
            }
            reservation.total(totalCalo);
            return ref.set(reservation.toJSON())
        }).then(doc => {
        reservation.setId(reservation_id);
        ErrorHandler.success(res, reservation.toJSON());
    }).catch(error => {
        ErrorHandler.error(res, ErrorCode.ERROR, error)
    });
};

exports.delete = function(req, res, next) {
    let {reservation_id} = req.params;
    reservationDb.doc(reservation_id).delete().then(result => {
        ErrorHandler.success(res, {})
    }).catch(error => ErrorHandler.error(res, ErrorCode.ERROR, error));
};

exports.get = function(req, res, next) {
    let {reservation_id} = req.params;
    let {restaurant_id, email} = Reservation.prototype.resolveId(reservation_id);
    let restaurantRef = firestore.collection(Restaurant.prototype.collectionName()).doc(restaurant_id);
    let reservationRef = firestore.collection(Reservation.prototype.collectionName()).doc(reservation_id);
    let restaurant, reservation;
    let foods = {};
    firestore.getAll(restaurantRef, reservationRef)
        .then(result => {
            restaurant = new Restaurant(result[0].data(), result[0].id);
            reservation = new Reservation(result[1].data(), result[0].id);
            let foods = reservation.foods();
            let foodRefs = [];
            for (let food of foods) {
                foodRefs.push(foodDb.doc(food.food_id));
            }
            return firestore.getAll(...foodRefs)

        }).then(snapshots => {
            for (let snapshot of snapshots) {
                let f = new Food(snapshot.data(), snapshot.id);
                foods[f.id()] = f.toJSON();
            }

            ErrorHandler.success(res, {
                restaurant : restaurant.toJSON(false),
                foods : foods,
                reservation : reservation.toJSON()

            })
    }).catch(error => {
        ErrorHandler.error(res, ErrorCode.ERROR, error);
    })
};

exports.mine = function(req, res, next) {
    let currentUser = TokenHandler.getEmail(req);
    let {cursor} = req.query;
    let promise = new Promise((resolve, reject) => {
       if (cursor) {
           let lastReservation = reservationDb.doc(cursor);
           resolve(lastReservation.get());
       } else {
           resolve(null);
       }
    }).then(doc => {
        let query = firestore.collection(Reservation.prototype.collectionName());
        query = query.where("owner", "==", currentUser);
        query = query.orderBy("created_date", "desc").limit(50);
        if (doc !== null) {
            query = query.startAfter(doc);
        }
        return query.get();
    }).then(snapshot => {
        let docs = snapshot.docs;
        let last = docs.length > 0 ? docs[docs.length - 1] : null;
        let result = [];
        docs.forEach(item => {
            let r = new Reservation(item.data(), item.id);
            result.push(r.toJSON());
        });
        let data = {
            reservations : result
        };
        if (last !== null) {
            data.cursor = last.id
        }
        ErrorHandler.success(res, data)
    }).catch(error => {
        ErrorHandler.error(res, ErrorCode.ERROR, error);
    });

};
