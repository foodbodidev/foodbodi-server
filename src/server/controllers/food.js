const foodDB = firestore.collection(__Food.prototype.collectionName());

exports.create = (req, res, next) => {
    try {
        let checked = __Food.prototype.validateInput(req.body);
        if (checked.status) {
            let food = new __Food(req.body);
            const creator = req.token_data.email;
            food.creator(creator);
            
            foodDB.add(food.addFieldCreateAt())
                .then(doc => {
                    food.id(doc.id);
                    return ErrorHandler.success(res, food.toJSON());
                })
                .catch(error => {
                    return ErrorHandler.error(res, ErrorCodes.RESTAURANT_CREATE_FAIL, error.message);
                })
        } else {
            return ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, checked.data);
        }
    } catch (error) {
        return ErrorHandler.error(res, ErrorCodes.RESTAURANT_CREATE_FAIL, error.message);
    }
};

exports.get = (req, res, next) => {
    try {
        let {id} = req.params;
        if (id) {
            foodDB.doc(id).get()
            .then(doc => {
                if (doc.exists) {
                    let food = new __Food(doc.data(), doc.id);
                    return ErrorHandler.success(res, { food : food.toJSON() });
                } else {
                    return ErrorHandler.error(res, ErrorCodes.RESTAURANT_NOT_FOUND, "Can not found food " + id);
                }
            }).catch(error=> {
                return ErrorHandler.error(res, ErrorCodes.ERROR, error.message);
            })
        } else {
            ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Missing id");
        }
    } catch (error) {
        return ErrorHandler.error(res, ErrorCodes.RESTAURANT_CREATE_FAIL, error.message);
    }
};

exports.gets = (req, res, next) => {
    try {
        let { name, restaurant, calogt, calolt, pricegt, pricelt } = req.query;
        let food = firestore.collection(__Food.prototype.collectionName());

        food
        .where('restaurant_id', '==', restaurant)
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
    try {
        let {id} = req.params;
        if (id) {
            let checked = __Food.prototype.validateInput(req.body, true);
            if (checked.status) {
                foodDB.doc(id).update(req.body)
                .then(doc => {
                    return ErrorHandler.success(res, {});
                }).catch(error => {
                    return ErrorHandler.error(res, ErrorCodes.ERROR, error.message);
                });
            } else {
                return ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, checked.data);
            }
        } else {
            return ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Missing id");
        }
    } catch (error) {
        return ErrorHandler.error(res, ErrorCodes.RESTAURANT_CREATE_FAIL, error.message);
    }
};

exports.delete = (req, res, next) => {
    let {id} = req.params;
    if (id) {
        foodDB.doc(id).delete()
            .then(res => {
                return ErrorHandler.success(res, {})
            })
            .catch(error => {
                return ErrorHandler.error(res, ErrorCodes.ERROR, error.message);
            })
    } else {
        return ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Missing id");
    }
};