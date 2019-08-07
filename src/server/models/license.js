let Status = require("./license_status");
let ObjTool = require("../utils/object_tools");
function License(input) {
    this.values = {};
    if (input.company_name) this.values.company_name = input.company_name;
    if (input.registration_number) this.values.registration_number = input.registration_number;
    if (input.representative_name) this.values.representative_name = input.representative_name;
    if (input.address) this.values.address = input.address;
    if (input.status) this.values.status = input.status;
    if (input.secret_approve) this.values.secret_approve = input.secret_approve;
    if (input.secret_deny) this.values.secret_deny = input.secret_deny;
}

License.prototype.company_name = function(value) {
    if (value) {
        this._company_name = value;
    }
    return this._company_name;
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
    let {company_name, registration_number, address, representative_name, status} = input;
    if (create) {
        if (registration_number == null) return "Missing registration number";
        if (representative_name == null) return "Missing representative_name";
        if (!!status) return "Not allow to set status"
    }
    if (!!company_name && typeof company_name !== "string") return "Company name must be a string";
    if (!!registration_number && typeof registration_number !== "string") return "Registration number must be a string";
    if (!!address && typeof address !== "string") return "Address must be a string";
    if (!!representative_name && typeof address !== "string") return "representative_name must be an array of string";
    if (!!status && !Status.hasOwnProperty(status)) return "Invalid status";

    return null;
};

module.exports = License;