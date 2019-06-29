function Restaurant(input, id) {
    this._name = input.name || null;
    this._creator = input.creator || null;
    this._address = input.address || null;
    this._location = input.location || null;
    this._lat = input.lat || null;
    this._lng = input.lng || null;
    this._type = input.type || "RESTAURANT";
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
        this._lat = lat;
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

Restaurant.prototype.toJSON = function() {
    let result = {
        name : this._name,
        creator : this._creator,
        address : this._address,
        lat : this._lat,
        lng: this._lng
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
}

Restaurant.prototype.collectionName = function() {
    return "restaurants";
};

module.exports = Restaurant;