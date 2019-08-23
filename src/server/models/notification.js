function Notification(input, id) {
  if (id) this.id = id;
  this.values = {};
  this.update(input);
}

Notification.prototype.update = function(input) {
    if (!!input.receiver) this.values.receiver = input.receiver;
    if (!!input.message) this.values.message = input.message;
    if (!!input.read) this.values.status = input.read;
    if (!!input.type) this.values.type = input.type;
    if (!!input.data) this.values.data = input.data;
};

Notification.prototype.receiver = function(value) {
    if (value) {
        this.values.receiver = value;
    }
    return this.values.receiver;
};

Notification.prototype.message = function(value) {
    if (value) {
        this.values.message = value;
    }
    return this.values.message;
};

Notification.prototype.type = function(value) {
    if (value) {
        this.values.type = value;
    }
    return this.values.type;
};

Notification.prototype.generateId = function() {
    return this.type() + "-" + this.receiver() + "-" + new Date().getTime();
};

Notification.prototype.collectionName = "notifications";

Notification.prototype.toJSON = function() {
    let value = this.values;
    if (this.id) {
        value.id = this.id;
    }
    return value;
};

module.exports = Notification;