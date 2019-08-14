function Reservation(input, id) {
    this.values = {};
    if (input.created_date) this.values.created_date = input.created_date;
    if (input.date_string) this.values.date_string = input.date_string;
    if (input.total) this.values.total = input.total;
    if (input.foods) this.values.foods = input.foods;
    if (input.restaurant_id) this.values.restaurant_id = input.restaurant_id;
    if (input.restaurant_name) this.values.restaurant_name = input.restaurant_name;
    if (input.owner) this.values.owner = input.owner;
    if (id) {
        this.id = id;
    }

}

Reservation.prototype.create_date = function(value) {
    if (value) {
        this.values.created_date = value;
    }
    return this.values.created_date;
};

Reservation.prototype.date_string = function(value) {
    if (value) {
        this.values.date_string = value;
    }
    return this.values.date_string;
};

Reservation.prototype.createDateString = function(year, month, day) {
    return year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
};

Reservation.prototype.total = function(value) {
    if (value) {
        this.values.total = value;
    }
    return this.values.total;
};

Reservation.prototype.foods = function(foods) {
    if (foods) {
        this.values.foods = foods;
    }
    return this.values.foods;
};

Reservation.prototype.restaurant_id = function(value) {
    if (value) {
        this.values.restaurant_id = value;
    }
    return this.values.restaurant_id;
};

Reservation.prototype.restaurant_name = function(value) {
    if (value) {
        this.values.restaurant_name = value;
    }
    return this.values.restaurant_name;
};

Reservation.prototype.owner = function(value) {
    if (value) {
        this.values.owner = value;
    }
    return this.values.owner;
};

Reservation.prototype.getId = function() {
    return this.id;
};

Reservation.prototype.setId = function(id) {
    this.id = id;
};

Reservation.prototype.validateInput = function(input, create) {
    if (input.foods) {
        if (!Array.isArray(input.foods)) return "Foods must be a array";
        for (let item of input.foods) {
            if (typeof item.amount !== "number") return "Amount must be a number";
            if (typeof item.food_id !== "string") return "Food id is invalid";
        }
    } else {
        return "Foods is required"
    }

    if (create && !input.hasOwnProperty("date_string")) return "date_string is required (yyyy-mm-dd)";

    if (!!input.date_string) {
        var regEx = /^\d{4}-\d{2}-\d{2}$/;
        if (typeof input.date_string !== "string" || input.date_string.match(regEx) === null) return "date_string must be yyyy-mm-dd"
    }

    if (typeof input.restaurant_id !== "string") return "Restaurant id is invalid or missing";
    return null;
};

Reservation.prototype.validateId = function(id) {
    let parts = id.split("_");
    if (parts.length === 4) {
        return null;
    } else {
        return "reservation id has wrong format";
    }
};

Reservation.prototype.createId = function(restaurant_id, userEmail) {
    return "rsv_" + restaurant_id + "_" + userEmail + "_" + new Date().getTime();
};

Reservation.prototype.resolveId = function(id) {
    let parts = id.split("_");
    return {
        restaurant_id : parts[1],
        email : parts[2],
        timestamp : parts[3]
    }
};

Reservation.prototype.collectionName = function() {
    return "reservations"
};

Reservation.prototype.toJSON = function() {
    let values =  this.values;
    if (this.id) {
        values.id = this.id;
    }
    return values;
};

Reservation.prototype.forEachFood = function(func) {
    for (let food of this.values.foods) {
        let {food_id, amount} = food;
        func(food_id, amount);
    }
};


module.exports = Reservation;