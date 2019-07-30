let Restaurant = require("../models/restaurant");
let Food = require("../models/food");
const firestoreFactory = require("../environments/firestore_factory");
const firestore = firestoreFactory();

exports.addCaloToRestaurant = (restaurant_id, calo, successCb, errorCb) => {
    let ref = firestore.collection(Restaurant.prototype.collectionName()).doc(restaurant_id);
    firestore.runTransaction(t => {
        return t.get(ref)
            .then(doc => {
                if (doc.exists) {
                    let r = new Restaurant(doc.data());
                    r.addCalo(calo);
                    t.update(ref, r.getCaloValuesJSON());
                } else {
                    errorCb("Restaurant " + restaurant_id + " not found");
                }
            })
    }).then(result => {
        successCb(result)
    }).catch(error => {
        errorCb(error);
    })
};

exports.removeCaloFromRestaurant = (restaurant_id, calo, successCb, errorCb) => {
    let ref = firestore.collection(Restaurant.prototype.collectionName()).doc(restaurant_id);
    firestore.runTransaction(t => {
        return t.get(ref)
            .then(doc => {
                if (doc.exists) {
                    let r = new Restaurant(doc.data());
                    r.removeCalo(calo);
                    t.update(ref, r.getCaloValuesJSON());
                } else {
                    errorCb("Restaurant " + restaurant_id + " not found");
                }
            })
    }).then(result => {
        successCb(result)
    }).catch(error => {
        errorCb(error);
    })
};

exports.changeCaloInRestaurant = (restaurant_id, oldcalo, newCalo, successCb, errorCb) => {
    let ref = firestore.collection(Restaurant.prototype.collectionName()).doc(restaurant_id);
    firestore.runTransaction(t => {
        return t.get(ref)
            .then(doc => {
                if (doc.exists) {
                    let r = new Restaurant(doc.data());
                    r.changeCalo(oldcalo, newCalo);
                    t.update(ref, r.getCaloValuesJSON());
                } else {
                    errorCb("Restaurant " + restaurant_id + " not found");
                }
            })
    }).then(result => {
        successCb(result)
    }).catch(error => {
        errorCb(error);
    })
};
