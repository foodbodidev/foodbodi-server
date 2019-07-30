exports.clean = (obj) => {
    for (var propName in obj) {
        if (obj[propName] === null || typeof obj[propName] === "undefined") {
            delete obj[propName];
        }
    }
};

exports.copyFieldWithPrefix = (dest, ori, prefix, ...fields) => {
    for (let field of fields) {
        if (ori[field] !== null) {
            let name = prefix + field;
            dest[name] = ori[field];
        }
    }
};

exports.copyField = (dest, ori, ...fields) => {
    for (let field of fields) {
        if (ori[field] !== null) {
            dest[field] = ori[field];
        }
    }
};

exports.isValue = (value) => {
    return typeof value !== "undefined" && value !== null;
};

exports.clone = (ori) => {
    let result = {};
    for (let fieldName of Object.keys(ori)) {
        result[fieldName] = ori[fieldName];
    }
    return result;
};