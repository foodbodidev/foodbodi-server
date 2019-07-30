function Model(collectionname, id) {
    this._collectionName = collectionname;
    this._fields = {};
    this._data = {};
    this._id = id;
}

Model.prototype.collectionName = function() {return this._collectionName};

Model.prototype.id = function(value) {
    if (value) {
        this._id = value
    }
    return this._id;
};

Model.prototype.setData = function(data) {
    for (let name in data) {
        const cf = data[name];
        if (this._fields.hasOwnProperty(name)) {
            const {type} = this._fields[name];

        }
    }
};
/**
 *
 * @param name
 * @param options : field configuration
 * {secured : Boolean,
 *
 * }
 */
Model.prototype.addField = function(name, options) {
    Object.assign(this._fields[name], options);
};

module.exports = Model;

