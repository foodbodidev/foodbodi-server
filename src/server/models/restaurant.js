let Category  = require("./restaurant_category");
let Type = require("./restaurant_type");
let validator = require("validator");
let Model = require("./model");
var Geohash = require('latlon-geohash');
let ObjTool = require("../utils/object_tools");

function Restaurant(input, id) {
    //Model.call(this, "restaurants");
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
    this._menu = input.menu || [];
    this._geohash = input.geohash ||  Geohash.encode(this._lat, this._lng, this.geo_hash_precision);
    this._priority = input.priority || 10;
    this._last_updater = input.last_updater || null;
    this._created_date = input.created_date || null;
    this._last_updated_date = input.last_updated_date || null;

}

/*
Restaurant.prototype = Object.create(Model.prototype);
Restaurant.prototype.constructor = Restaurant;
*/


Restaurant.prototype.geo_hash_precision = 5;

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

Restaurant.prototype.toJSON = function(ignoreNull) {
    let result = {
        name : this._name,
        creator : this._creator,
        address : this._address,
        category : this._category,
        type : this._type,
        lat : this._lat,
        lng : this._lng,
        geohash : this._geohash,
        open_hour : this._open_hour,
        close_hour : this._close_hour,
        priority : this._priority,
        last_updater : this._last_updater,
        created_date : this.created_date,
        last_updated_date : this.last_updated_date
    };
    if (this._id) {
        result.id = this._id
    }
    if (ignoreNull || false) {
        ObjTool.clean(result);
    }
    return result;
};


Restaurant.prototype.created_date = function(value) {
    if (value) {
        this._created_date = value;
    }
    return this._created_date
};

Restaurant.prototype.updated_date = function(value) {
    if (value) {
        this._last_updated_date = value;
    }
    return this._last_updated_date
};

Restaurant.prototype.updater = function(value) {
    if (value) {
        this._last_updater = value;
    }
    return this._last_updater;
};



Restaurant.prototype.collectionName = function() {
    return "restaurants";
};

Restaurant.prototype.menu = function(value) {
    if (value && Array.isArray(value)) {
        this._menu = value
    }
    return this._menu;
};

Restaurant.prototype.validateInput = function(input) {
    let {name, address, category, type, lat, lng, open_hour, close_hour, priority} = input;
    if (!!name && typeof name !== "string") return "Name must be a string";
    if (!!address && typeof address !== "string") return "Address must be a string";
    if (!!category && !Category.hasOwnProperty(category)) return "Category " + category + " is not supported";
    if (!!type && !Type.hasOwnProperty(type)) return "Type " + type + " is not supported";
    if (!!lat && typeof  lat !== "number") return "Latitude must be a number";
    if (!!lng && typeof  lng !== "number") return "Longtitude must be a number";

    let hourRegex = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;

    if (!!open_hour && !hourRegex.test(open_hour)) {
        return "Open hour must be a HH:mm";
    }
    if (!!close_hour && !hourRegex.test(close_hour)) return "Close hour must be HH:mm";
    if (!!priority) return "Update priority directly is not allowed";
    return null;
};

module.exports = Restaurant;