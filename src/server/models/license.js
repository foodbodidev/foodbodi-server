let Status = require("./license_status");
let ObjTool = require("../utils/object_tools");
function License(input) {
    this.values = {};
    if (input.business_name) this.values.business_name = input.business_name;
    if (input.registration_number) this.values.registration_number = input.registration_number;
    if (input.proprietors) this.values.proprietors = input.proprietors;
    if (input.principle_place) this.values.principle_place = input.principle_place;
    if (input.license_photo) this.values.license_photo = input.license_photo;
    if (input.status) this.values.status = input.status;
    if (input.secret_approve) this.values.secret_approve = input.secret_approve;
    if (input.secret_deny) this.values.secret_deny = input.secret_deny;
}

License.prototype.business_name = function(value) {
    if (value) {
        this._business_name = value;
    }
    return this._business_name;
};

License.prototype.secretApprove = function(value) {
    if (value) {
        this._secret_approve = value;
    }
    return this._secret_approve;
};

License.prototype.secretDeny = function(value) {
    if (value) {
        this._secret_deny = value;
    }
    return this._secret_deny;
};

License.prototype.toJSON = function(includeSecrets) {
    let result = ObjTool.clone(this.values);
    if (!includeSecrets) {
        result.secret_approve = null;
        result.secret_deny = null;
    }
    return result;
};


License.prototype.approve = function() {
    this._status = Status.APPROVED.key;
    return this._status
};

License.prototype.deny = function() {
    this._status = Status.DENIED.key;
    return this._status
};

License.prototype.validateInput = function(input, create) {
    let {business_name, restaurant_id, boss_id, license_photo, registration_number, principle_place, proprietors, status} = input;
    if (create) {
        if (business_name == null) return "Missing Business name";
        if (license_photo == null) return "Missing license photo";
        if (registration_number == null) return "Missing registration number";
        if (principle_place == null) return "Missing Priciple place";
        if (proprietors == null) return "Missing list of proprietors";
        if (!!status) return "Not allow to set status"
    }
    if (!!business_name && typeof business_name !== "string") return "Business name must be a string";
    if (!!license_photo && typeof license_photo !== "string") return "License photo is invalid";
    if (!!registration_number && typeof registration_number !== "string") return "Registration number must be a string";
    if (!!principle_place && typeof principle_place !== "string") return "Principle place must be a string";
    if (!!proprietors && !Array.isArray(proprietors)) return "Proprietors must be an array of string";
    if (!!status && !Status.hasOwnProperty(status)) return "Invalid status";

    return null;
};

module.exports = License;