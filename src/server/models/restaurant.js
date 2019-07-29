let Category  = require("./restaurant_category");
let Type = require("./restaurant_type");
let validator = require("validator");
// let Model = require("./model");
var Geohash = require('latlon-geohash');
let ObjTool = require("../utils/object_tools");
let Food = require("./food");
let License = require("./license");

function Restaurant(input, id) {
    //Model.call(this, "restaurants");
    this.values = {};
    if (input.license) {
        this._license = new License(input.license);
    }
    if (input.name) this.values.name = input.name;
    if (input.creator) this.values.creator = input.creator;
    if (input.address) this.values.address = input.address;
    if (input.lat) this.values.lat = input.lat;
    if (input.lng) this.values.lng = input.lng;

    if (input.type) this.values.type = input.type;
    if (input.category) this.values.category = input.category;
    if (input.open_hour) this.values.open_hour = input.open_hour;
    if (input.close_hour) this.values.close_hour = input.close_hour;
    if (id) this.values.id = id;

    if (input.geohash) {
        this.values.geohash = input.geohash;
    }
    else if (this.values.lat && this.values.lng){
      this.values.geohash = Geohash.encode(this.values.lat, this.values.lng, this.geo_hash_precision);
    }
    this.values.priority = input.priority || 10;

    if (input.last_updater) this.values.last_updater = input.last_updater;
    if (input.created_date) this.values.created_date = input.created_date;
    if (input.last_updated_date) this.values.last_updated_date = input.last_updated_date;
    if (input.photo) this.values.photo = input.photo;

    if (input.calo_values) this.values.calo_values = input.calo_values;

}

/*
Restaurant.prototype = Object.create(Model.prototype);
Restaurant.prototype.constructor = Restaurant;
*/


Restaurant.prototype.geo_hash_precision = 5;

Restaurant.prototype.name = function(value) {
    if (value) {
        this.values.name = value;
    }
    return this.values.name;

};

Restaurant.prototype.category = function(value) {
    if (value) {
        this.values.category = value;
    }
    return this.values.category;

};


Restaurant.prototype.address = function(value) {
    if (value) {
        this.values.address = value;
    }
    return this.values.address;

};


Restaurant.prototype.creator = function(value) {
    if (value) {
        this.values.creator = value;
    }
    return this.values.creator;

};

Restaurant.prototype.location = function(lat, lng)  {
    if (!!lat && !!lng) {
        this.values.lng = lng;
    }
    return {
        lat : this.values.lat,
        lng : this.values.lng
    }
};

Restaurant.prototype.license = function(value) {
    if (value) {
        this._license = value;
    }
    return this._license;
}

Restaurant.prototype.type = function(value) {
    if (value) {
        this.values.type = value;
    }
    return this.values.type;
};

Restaurant.prototype.openHour = function(value) {
    if (value) {
        this.values.open_hour = value;
    }
    return this.values.open_hour;
};

Restaurant.prototype.closeHour = function(value) {
    if (value) {
        this.values.close_hour = value;
    }
    return this.values.close_hour;
};

Restaurant.prototype.toJSON = function(includeSecret) {
    let result = ObjTool.clone(this.values);

    if (this._license) {
        result.license = this._license.toJSON(includeSecret);
    }

    return result;
};


Restaurant.prototype.created_date = function(value) {
    if (value) {
        if (value instanceof Date) {
            this.values.created_date = value.getTime();
        } else {
            this.values.created_date = value;
        }
    }
    return this.values.created_date
};

Restaurant.prototype.updated_date = function(value) {
    if (value) {
        this.values.last_updated_date = value;
    }
    return this.values.last_updated_date
};

Restaurant.prototype.updater = function(value) {
    if (value) {
        this.values.last_updater = value;
    }
    return this.values.last_updater;
};

Restaurant.prototype.id = function(value) {
    if (value) {
        this.values.id = value
    }
    return this.values.id;
};

Restaurant.prototype.collectionName = function() {
    return "restaurants";
};

Restaurant.prototype.addCalo = function(value) {
    if (!ObjTool.isValue(this.values.calo_values)) this.values.calo_values = [];
    if (value) {
        this.values.calo_values.push(value);
    }
    return this.values.calo_values;
};

Restaurant.prototype.caloValues = function(values) {
    if (!ObjTool.isValue(this.values.calo_values)) this.values.calo_values = [];
    if (values) {
        this.values.calo_values = values;
    }
    return this.values.calo_values;
};

Restaurant.prototype.getCaloValuesJSON = function() {
    return {calo_values : this.values.calo_values};
};

Restaurant.prototype.removeCalo = function(value) {
    if (!ObjTool.isValue(this.values.calo_values)) this.values.calo_values = [];
    if (value) {
        let newValues = [];
        let removed = false;
        for (let calo of this.values.calo_values) {
            if (calo === value && !removed) {
                removed = true;
            } else {
                newValues.push(calo);
            }
        }
        this.values.calo_values = newValues;
    }
};

Restaurant.prototype.changeCalo = function(oldValue, newValue) {
    if (!ObjTool.isValue(this.values.calo_values)) this.values.calo_values = [];
    if (this.values.calo_values !== null) {
        if (oldValue && newValue) {
            for (let i in this.values.calo_values) {
                let calo = this.values.calo_values[i];
                if (calo === oldValue) {
                    this.values.calo_values[i] = newValue;
                    return this.values.calo_values;
                }
            }
        }
    }
    return this.values.calo_values;
};

Restaurant.prototype.validateInput = function(input, create) {
    let {name, address, category, type, lat, lng, open_hour, close_hour, priority, foods, photo} = input;
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
    if (!!foods && !Array.isArray(foods)) return "Foods must be an array of food";
    if (!!photo && (typeof photo) !== "string") return "Photo must be a link";
    if (!!foods) {
        for (let food of foods) {
            food.restaurant_id = "nonce";
            let error = Food.prototype.validateInput(food, false);
            if (error !== null) return error;
        }
    }

    if (input.hasOwnProperty("license")) {
        const error = License.prototype.validateInput(input.license || {}, create);
        if (error != null) return error;
    } else if (create){
        return "Missing license"
    }
    return null;
};

module.exports = Restaurant;