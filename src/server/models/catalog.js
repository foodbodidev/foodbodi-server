let ObjectTool = require("../utils/object_tools");
function Catalog(input, id) {
    this.values = {};
    if (input.word) this.values.word = input.word;
    if (input.document_id) this.values.document_id = input.document_id;
    if (input.kind) this.values.kind = input.kind;
    if (input.position) this.values.position = input.position;
    if (input.document) this.values.document = input.document;

    if (id) this.values.id = id;

}

Catalog.prototype.collectionName = "catalogs";

Catalog.prototype.toJSON = function() {
    return this.values;

};

Catalog.prototype.word = function(value) {
    if (value) {
        this.values.word = value;
    }
    return this.values.word;
};

Catalog.prototype.kind = function(value) {
    if (value) {
        this.values.kind = value;
    }
    return this.values.kind;
};

Catalog.prototype.document_id = function(value) {
    if (value) {
        this.values.document_id = value;
    }
    return this.values.document_id;
};

Catalog.prototype.position = function(value) {
    if (value) {
        this.values.position = value;
    }
    return this.values.position;
};

Catalog.prototype.document = function(value) {
    if (value) {
        this.values.document = value;
    }
    return this.values.document;
};

Catalog.prototype.id = function() {
    return this.values.id;
};

module.exports = Catalog;