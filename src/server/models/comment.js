function Comment(input, id) {
    this._message = input.message || null;
    this._restaurant_id = input.restaurant_id || null;
    this._creator = input.creator || null;
    this._topic = input.topic || null;
    this._created_date = input.created_date || null;
}

Comment.prototype.message = function(value) {
    if (value) {
        this._message = value;
    }
    return this._message;
};

Comment.prototype.restaurant_id = function(value) {
    if (value) {
        this._restaurant_id = value;
    }
    return this._restaurant_id;
};

Comment.prototype.creator = function(value) {
    if (value) {
        this._creator = value;
    }
    return this._creator;
};

Comment.prototype.topic = function(value) {
    if (value) {
        this._topic = value;
    }
    return this._topic;
};

Comment.prototype.created_date = function(value) {
    if (value) {
        this._created_date = value;
    } else {
        return this._created_date;
    }
};

Comment.prototype.toJSON = function() {
    let result = {
        message: this._message,
        restaurant_id: this._restaurant_id,
        creator: this._creator,
        topic : this._topic,
        created_date : this._created_date
    };
    if (this._id) {
        result.id = this._id
    }
    return result;
};


Comment.prototype.id = function(value) {
    if (value) {
        this._id = value
    }
    return this._id;
};

Comment.prototype.collectionName = function() {
    return "comments";
};

Comment.prototype.validateInput = function(input, update) {
    let {message, restaurant_id} = input;
    
    if (!!message && typeof message !== "string" && message !== "") return "Comment is invalid";
    if (!!restaurant_id && !validator.isAlphanumeric(restaurant_id)) return "Restaurant id is invalid";

    return null;
};

module.exports = Comment;