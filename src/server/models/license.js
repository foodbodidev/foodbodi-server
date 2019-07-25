let Status = require("./license_status");
function License(input, id) {
    this._business_name = input.business_name || null;
    this._restaurant_id = input.restaurant_id || null;
    this._registration_number = input.registration_number || null;
    this._proprietors = input.proprietors || [];
    this._principle_place = input.principle_place || null;
    this._license_photo = input.license_photo || null;
    if (id) {
        this._id = id;
    }
    this._created_date = input.created_date || null;
    this._restaurant_id = input.restaurant_id || null;
    this._boss_id = input.boss_id || null;
    this._status = input.status || Status.WAITING.key;
}

License.prototype.business_name = function(value) {
    if (value) {
        this._business_name = value;
    }
    return this._business_name;
};

License.prototype.restaurant_id = function(value) {
    if (value) {
        this._restaurant_id = value;
    }
    return this._restaurant_id;
};

License.prototype.boss_id = function(value) {
    if (value) {
        this._boss_id = value;
    }
    return this._boss_id;
};

License.prototype.toJSON = function() {
    let result = {
        business_name: this._business_name,
        restaurant_id: this._restaurant_id,
        boss_id: this._boss_id,
        created_date : this._created_date,
        license_photo : this._license_photo,
        registration_number : this._registration_number,
        principle_place : this._principle_place,
        proprietors : this._proprietors,
        status : this._status
    };
    if (this._id) {
        result.id = this._id
    }
    return result;
};


License.prototype.id = function(value) {
    if (value) {
        this._id = value
    }
    return this._id;
};

License.prototype.created_date = function(value) {
    if (value) {
        this._created_date = value;
    } else {
        return this._created_date;
    }
};

License.prototype.approve = function() {
    this._status = Status.APPROVED.key;
    return this._status
};

License.prototype.deny = function() {
    this._status = Status.DENIED.key;
    return this._status
};

License.prototype.collectionName = function() {
    return "licenses";
};

License.prototype.validateInput = function(input, create) {
    let {business_name, restaurant_id, boss_id, license_photo, registration_number, principle_place, proprietors, status} = input;
    if (create) {
        if (business_name == null) return "Missing Business name";
        if (restaurant_id == null) return "Missing Restaurant id";
        if (!!boss_id) return "Now allow to set boss id directly";
        if (license_photo == null) return "Missing license photo";
        if (registration_number == null) return "Missing registration number";
        if (principle_place == null) return "Missing Priciple place";
        if (proprietors == null) return "Missing list of proprietors";
        if (!!status) return "Not allow to set status"
    }
    if (!!business_name && typeof business_name !== "string") return "Business name must be a string";
    if (!!restaurant_id && !validator.isAlphanumeric(restaurant_id)) return "Restaurant id is invalid";
    if (!!boss_id && !validator.isAlphanumeric(boss_id)) return "Boss id invalid";
    if (!!license_photo && typeof license_photo !== "string") return "License photo is invalid";
    if (!!registration_number && typeof registration_number !== "string") return "Registration number must be a string";
    if (!!principle_place && typeof principle_place !== "string") return "Principle place must be a string";
    if (!!proprietors && !Array.isArray(proprietors)) return "Proprietors must be an array of string";
    if (!!status && !Status.hasOwnProperty(status)) return "Invalid status";

    return null;
};

module.exports = License;