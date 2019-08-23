function Ingredient(input, id) {
    if (id) {
        this.id = id;
    }
    this.values = {};
    this.update(input);
}

Ingredient.prototype.update = function(input) {
    if (typeof this.values !== "object") this.values = {};
    if (input.name) this.values.name = input.name;
    if (input.kcalo) this.values.kcalo = input.kcalo;
};

Ingredient.prototype.toJSON = function() {
    return this.values;
};

Ingredient.prototype.kcalo = function(value) {
    if (value) {
        this.values.kcalo = value;
    }

    return this.values.kcalo;
};

Ingredient.prototype.name = function(value) {
    if (value) {
        this.values.name = value;
    }
    return this.values.name;
};

Ingredient.prototype.collectionName = "ingredients";

module.exports = Ingredient;