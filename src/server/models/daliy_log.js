let Reservation = require("./reservation");
function DailyLog(input, id) {
    this.values = {};
    if (input.step) this.values.step = input.step;
    if (input.burned_calo) this.values.burned_calo = input.burned_calo;
    if (input.calo_threshold) this.values.calo_threshold = input.calo_threshold;
    if (input.reservations) this.values.reservations = input.reservations;
    if (input.total_eat) this.values.total_eat = input.total_eat;
    if (input.date) this.values.date = input.date;
    if (input.owner) this.values.owner = input.owner;
    if (id) {
        this.id = id;
    }
}

DailyLog.prototype.toJSON = function(includeId) {
    let result = this.values;
    if (includeId) result.id = this.id;
    return result;
};

DailyLog.prototype.generateId = function(year, month , day, userEmail) {
    let monthStr = parseInt(month) < 10 ? "0" + parseInt(month) : "" + parseInt(month);
    let dayStr = parseInt(day) < 10 ? "0" + parseInt(day) : "" + parseInt(day);

    return year + "-" + monthStr +"-" + dayStr + "-" + userEmail;
};

DailyLog.prototype.owner = function(owner) {
    if (owner) {
        this.values.owner = owner;
    }
    return this.values.owner;
};

DailyLog.prototype.validateInput = function(input) {
    if (!!input.step && typeof input.step !== "number") return "Step must be a number";
    if (!!input.calo_threshold && typeof input.calo_threshold !== "number") return "Calo threshold must be a number";
    if (!!input.total_eat && typeof input.total_eat !== "number") return "total_eat must be a number";
    if (!!input.burned_calo && typeof input.burned_calo !== "number") return "burned_calo must be a number";
    if (!!input.date && typeof input.date !== "string") return "Date must be a string";
    if (!!input.reservations && !Array.isArray(input.reservations)) return "Reservations must be an array";
    return null;
};


DailyLog.prototype.getId = function() {
    return this.id;
};

DailyLog.prototype.setId = function(id) {
    return this.id = id;
};

DailyLog.prototype.eat = function(value) {
    if (value) {
        this.values.total_eat = value;
    }
    return this.values.total_eat;
};

DailyLog.prototype.reservations = function(values) {
    if (values) {
        this.values.reservations = values;
    }
    return this.values.reservations;
};

DailyLog.prototype.collectionName = "dailylogs";


module.exports = DailyLog;