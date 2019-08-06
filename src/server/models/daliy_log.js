function DailyLog(input, id) {
    this.values = {};
    if (input.step) this.values.step = input.step;
    if (input.calo_threshold) this.values.calo_threshold = input.calo_threshold;
    if (input.remain_calo) this.values.remain_calo = input.remain_calo;
    if (input.date) this.values.date = input.date;
    if (input.user_id) this.values.user_id = input.user_id;
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
    let monthStr = month < 10 ? "0" + month : "" + month;
    let dayStr = day < 10 ? "0" + day : "" + day;

    return year + "-" + month +"-" + day + "-" + userEmail;
};

DailyLog.prototype.validateInput = function(input) {
    if (!!input.step && typeof input.step !== "number") return "Step must be a number";
    if (!!input.calo_threshold && typeof input.calo_threshold !== "number") return "Calo threshold must be a number";
    if (!!input.remain_calo && typeof input.remain_calo !== "number") return "Calo threshold must be a number";
    if (!!input.date && typeof input.date !== "string") return "Calo threshold must be a string";
    return null;
};


DailyLog.prototype.getId = function() {
    return this.id;
};

DailyLog.prototype.setId = function(id) {
    return this.values.id = id;
};

DailyLog.prototype.collectionName = "dailylogs";


module.exports = DailyLog;