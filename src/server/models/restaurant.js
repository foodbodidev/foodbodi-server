let Category  = require("./restaurant_category");
let Type = require("./restaurant_type");
let validator = require("validator");

function Restaurant(input, id) {
    this._name = input.name || null;
    this._creator = input.creator || null;
    this._address = input.address || null;
    this._lat = input.lat || null;
    this._lng = input.lng || null;
    this._type = input.type || Type.RESTAURANT.key;
    this._category = input.category || Category.ORDINARY.key;
    this._open_hour = input.open_hour || null;
    this._close_hour = input.close_hour || null;
    if (id) {
        this._id = id;
    }

}

Restaurant.prototype.name = function(value) {
    if (value) {
        this._name = value;
    }
    return this._name;

};

Restaurant.prototype.category = function(value) {
    if (value) {
        this._category = value;
    }
    return this._category;

};


Restaurant.prototype.address = function(value) {
    if (value) {
        this._address = value;
    }
    return this._address;

};


Restaurant.prototype.creator = function(value) {
    if (value) {
        this._creator = value;
    }
    return this._creator;

};

Restaurant.prototype.location = function(lat, lng)  {
    if (!!lat && !!lng) {
        this.location_lat = lat;
        this._lng = lng;
    }
    return {
        lat : this._lat,
        lng : this._lng
    }
};

Restaurant.prototype.type = function(value) {
    if (value) {
        this._type = value;
    }
    return this._type;
};

Restaurant.prototype.openHour = function(value) {
    if (value) {
        this._openHour = value;
    }
    return this._open_hour;
};

Restaurant.prototype.closeHour = function(value) {
    if (value) {
        this._close_hour = value;
    }
    return this._close_hour;
};

Restaurant.prototype.toJSON = function() {
    let result = {
        name : this._name,
        creator : this._creator,
        address : this._address,
        category : this._category,
        type : this._type,
        lat : this._lat,
        lng : this._lng
    };
    if (this._id) {
        result.id = this._id
    }
    return result;
};

Restaurant.prototype.id = function(value) {
    if (value) {
        this._id = value
    };
    return this._id;
};

Restaurant.prototype.collectionName = function() {
    return "restaurants";
};

Restaurant.prototype.validateInput = function(input) {
    let {name, address, category, type, lat, lng, open_hour, close_hour} = input;
    let valid = !name  || validator.isAlphanumeric(name);
    valid &= !address  || validator.isAlphanumeric(address);
    valid &= !category  || Category.hasOwnProperty(category);
    valid &= !type  || Type.hasOwnProperty(type);
    valid &= !lat  || validator.isNumeric(lat);
    valid &= !lng  || validator.isNumeric(lng);
    valid &= !open_hour || validator.isAlphanumeric(open_hour);
    valid &= !close_hour || validator.isAlphanumeric(close_hour);
    return valid;
};

module.exports = Restaurant;