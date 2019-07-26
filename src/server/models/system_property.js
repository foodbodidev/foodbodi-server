function SystemProperty(input, id) {
    if (id) {
        this._id = id;
    }
    this._value = input.value || null;
}

SystemProperty.prototype.value = function(value) {
    if (value) {
        this._value = value;
    }
    return this._value;
};

SystemProperty.toJSON = function() {
    return {
        id : this._id,
        value : this._value
    }
};

SystemProperty.prototype.collectionName = "system_properties";

module.exports = SystemProperty;