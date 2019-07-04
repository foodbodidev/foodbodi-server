function Food(input, id) {
    this._name = input.name || null;
    this._restaurant_id = input.restaurant_id || null;
    this._creator = input.creator || null;
    this._calo = input.calo || null;
    this._price = input.price || null;
    this._descript = input.descript || null;
    if (id) {
        this._id = id;
    }
}

Food.prototype.name = function(value) {
    if (value) {
        this._name = value;
    }
    return this._name;
};

Food.prototype.restaurant_id = function(value) {
    if (value) {
        this._restaurant_id = value;
    }
    return this._restaurant_id;
};

Food.prototype.creator = function(value) {
    if (value) {
        this._creator = value;
    }
    return this._creator;
};

Food.prototype.calo = function(lat, lng)  {
    if (value) {
        this._calo = value;
    }
    return this._calo;
};

Food.prototype.price = function(value) {
    if (value) {
        this._price = value;
    }
    return this._price;
};

Food.prototype.descript = function(value) {
    if (value) {
        this._descript = value;
    }
    return this._descript;
};

Food.prototype.toJSON = function() {
    let result = {
        name: this._name,
        restaurant_id: this._restaurant_id,
        creator: this._creator,
        calo: this._calo,
        price: this._price,
        descript: this._descript
    };
    if (this._id) {
        result.id = this._id
    }
    return result;
};

Food.prototype.addFieldCreateAt = function() {
    let result = this.toJSON();
    result.createAt = timeNow;
    return result;
};

Food.prototype.id = function(value) {
    if (value) {
        this._id = value
    };
    return this._id;
};

Food.prototype.collectionName = function() {
    return "foods";
};

Food.prototype.validateInput = function(input, update) {
    let mess = [];
    if (update) {
        input.name ? validator.isAlphanumeric(input.name) ? "" : mess.push("Name is invalid") : "";
        input.restaurant_id ? validator.isAlphanumeric(input.restaurant_id) ? "" : mess.push("Restaurant is invalid") : "";
    } else {
        input.name ? validator.isAlphanumeric(input.name) ? "" : mess.push("Name is invalid") : mess.push("Name is required");
        input.restaurant_id ? validator.isAlphanumeric(input.restaurant_id) ? "" : mess.push("Restaurant is invalid") : mess.push("Restaurant is required");
    }
    input.calo ? validator.isNumeric(input.calo.toString()) ? "" : mess.push("Calo is invalid") : "";
    input.price ? validator.isNumeric(input.price.toString()) ? "" : mess.push("Price is invalid") : "";
    input.descript ? validator.isAlphanumeric(input.descript) ? "" : mess.push("Descript is invalid") : "";
    if (mess.length === 0) {
        return { status: true, data: input }
    }
    return { status: false, data: mess }
};

module.exports = Food;