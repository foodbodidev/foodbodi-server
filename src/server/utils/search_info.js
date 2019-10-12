function SearchInfo(input){
    this._length = input.length || 10;
    this._cursor = input.cursor || null;
    this._query = input.query || null;
}

SearchInfo.prototype.length = (value) => {
    if (value) {
        this._length = value;
    }
    return this._length;
}

SearchInfo.prototype.cursor = (value) => {
    if (value) {
        this._cursor = value;
    }
    return this._cursor;
}

SearchInfo.prototype.query = (value) => {
    if (value) {
        this._query = value;
    }
    return this._query;
}

SearchInfo.prototype.validate = (input) => {
    let {length, cursor, query} = input;
    if (!!length && typeof length !== "number") return "Length must be a number";
    if (!!cursor && typeof cursor !== "string") return "Cursor must be a string";
    if (!!query && typeof query !== "object") return "Query must be an object";
    if (!!query) {
        for (let field in query) {
            const data = query[field];
            if (typeof data !== "object") {
                return "Query item must be an object"
            }
        }
    }
    return null;
};

module.exports = SearchInfo;