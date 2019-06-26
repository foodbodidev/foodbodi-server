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

Restaurant.prototype.name = (value) => {
    if (value) {
        this._name = value;
    }
    return this._name;

};

Restaurant.prototype.address = (value) => {
    if (value) {
        this._address = value;
    }
    return this._address;

};


Restaurant.prototype.creator = (value) => {
    if (value) {
        this._creator = value;
    }
    return this._creator;

};

Restaurant.prototype.location = (lat, lng) => {
    if (!!lat && !!lng) {
        this._lat = lat;
        this._lng = lng;
    }
    return {
        lat : this._lat,
        lng : this._lng
    }
};

Restaurant.prototype.type = (value) => {
    if (value) {
        this._type = value;
    }
    return this._type;
};

Restaurant.prototype.toJSON = () => {
    return {
        id : this._id,
        name : this._name,
        creator : this._creator,
        address : this._address,
        lat : this._lat,
        lng: this._lng
    }
};

Restaurant.prototype.collectionName = () => {
    return "restaurants";
};

module.exports = Restaurant;