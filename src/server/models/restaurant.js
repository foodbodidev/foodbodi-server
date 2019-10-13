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
    if (input.phone) this.values.phone = input.phone;
    if (input.creator) this.values.creator = input.creator;
    if (input.address) this.values.address = input.address;
    if (input.lat) this.values.lat = input.lat;
    if (input.lng) this.values.lng = input.lng;

    if (input.type) {
        this.values.type = input.type;
        this.values.type_name = Type[input.type].name
    }
    if (input.category) {
        this.values.category = input.category;
        this.values.category_name = Category[input.category].name;
    }
    if (input.open_hour) this.values.open_hour = input.open_hour;
    if (input.close_hour) this.values.close_hour = input.close_hour;
    if (id) this.values.id = id;

    if (input.geohash) {
        this.values.geohash = input.geohash;
    } else if (this.values.lat && this.values.lng){
        this.values.geohash = Geohash.encode(this.values.lat, this.values.lng, this.geo_hash_precision);
    }

    if (input.neighbour_geohash) {
        this.values.neighbour_geohash = input.neighbour_geohash;
    }

    this.values.priority = input.priority || 10;

    if (input.last_updater) this.values.last_updater = input.last_updater;
    if (input.created_date) this.values.created_date = input.created_date;
    if (input.last_updated_date) this.values.last_updated_date = input.last_updated_date;
    //TODO : remove photo field
    if (input.photo) this.values.photo = input.photo;
    if (input.photos) this.values.photos = input.photos;

    if (input.calo_values) this.values.calo_values = input.calo_values;

    if (input.is_branch_of) this.values.is_branch_of = input.is_branch_of;

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
    if (typeof value === "string" && value.length > 0) {
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
        this.values.type_name = Type[value].name
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

Restaurant.prototype.isBranchOf = function(restaurant_id) {
    if (restaurant_id) {
        this.values.is_branch_of = restaurant_id
    }
    return this.values.is_branch_of;
}

Restaurant.prototype.getNeighbours = function() {
    return this.values.neighbour_geohash
};

Restaurant.prototype.calculateNeighbour = function() {
    if (this.values.geohash) {
        const neighbours = Geohash.neighbours(this.values.geohash);
        //reverse the map to get a map of : geohash -> true
        let result = [];
        result.push(this.values.geohash);
        for (let direction of Object.keys(neighbours)) {
            result.push(neighbours[direction])
        }
        this.values.neighbour_geohash = result;
    }
    return this.values.neighbour_geohash;

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

Restaurant.prototype.getFoodRestaurantId = function() {
    if (!!this.isBranchOf()) return this.isBranchOf();
    else return this.id();
};

Restaurant.prototype.validateInput = function(input, create) {
    let {name, address, category, type, lat, lng, open_hour, close_hour, foods, photo, photos} = input;
    if (create) {
        if (!input.hasOwnProperty("name")) return "Name is required";
        if (!input.hasOwnProperty("address")) return "Address is required"
    }
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
    if (!!foods && !Array.isArray(foods)) return "Foods must be an array of food";
    if (!!photo && (typeof photo) !== "string") return "Photo must be a link";
    if (!!photos && !Array.isArray(photos)) return "Photo must be an array of link";
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

Restaurant.prototype.searchText = function() {
    if (ObjTool.isValue(this.name())) {
        return this.name();
    } else return null;
};

Restaurant.prototype.searchDoc = function() {
    return {
        name : this.values.name,
        address : this.values.address || null,
        photos : this.values.photos || []
    }
};

module.exports = Restaurant;