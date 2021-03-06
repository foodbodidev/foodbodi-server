function Food(input, id) {
    this._name = input.name || null;
    this._restaurant_id = input.restaurant_id || null;
    this._creator = input.creator || null;
    this._calo = input.calo || null;
    this._price = input.price || null;
    this._description = input.description || null;
    if (id) {
        this._id = id;
    }
    this._created_date = input.created_date || null;
    this._photo = input.photo || null;
    this._trash = input.trash || false;
}

Food.prototype.name = function(value) {
    if (value) {
        this._name = value;
    }
    return this._name;
};

Food.prototype.restaurant_id = function(value) {
    if (value) {
        this._restaurant_id = value;
    }
    return this._restaurant_id;
};

Food.prototype.creator = function(value) {
    if (value) {
        this._creator = value;
    }
    return this._creator;
};

Food.prototype.calo = function(value)  {
    if (value) {
        this._calo = value;
    }
    return this._calo;
};

Food.prototype.price = function(value) {
    if (value) {
        this._price = value;
    }
    return this._price;
};

Food.prototype.descript = function(value) {
    if (value) {
        this._description = value;
    }
    return this._description;
};

Food.prototype.toJSON = function() {
    let result = {
        name: this._name,
        restaurant_id: this._restaurant_id,
        creator: this._creator,
        calo: this._calo,
        price: this._price,
        description: this._description,
        created_date : this._created_date,
        photo : this._photo,
        trash : this._trash
    };
    if (this._id) {
        result.id = this._id
    }
    return result;
};


Food.prototype.id = function(value) {
    if (value) {
        this._id = value
    }
    return this._id;
};

Food.prototype.markAsTrash = function() {
    this._trash = true;
    return this;
};

Food.prototype.created_date = function(value) {
    if (value) {
        if (value instanceof Date) {
            this._created_date = value;
        } else {
            this._created_date = value;
        }
    } else {
        return this._created_date;
    }
};

Food.prototype.collectionName = function() {
    return "foods";
};

Food.prototype.validateInput = function(input, update) {
    let {name, restaurant_id, calo, price, description, photo} = input;
    if (!update) { // create
        if (!name) return "Name is required";
        if (!restaurant_id) return "Restaurant id is required";
        if (!calo) return "Calo is required";
    }

    if (!!name && typeof name !== "string") return "Name is invalid";
    if (!!restaurant_id && !validator.isAlphanumeric(restaurant_id)) return "Restaurant id is invalid";
    if (!!calo && typeof calo !== "number") return "Calo is invalid";
    if (!!price && typeof price !== "number") return "Price is invalid";
    if (!!description && typeof description !== "string") return "Description is invalid";
    if (!!photo && typeof photo !== "string") return "Photo must be a link";

    return null;
};

Food.prototype.searchText = function() {
    return this.name();
};

Food.prototype.searchDoc = function() {
    return {
        name : this._name,
        restaurant_id : this._restaurant_id,
        photo : this._photo || null
    }
};
module.exports = Food;