exports.clean = (obj) => {
    for (var propName in obj) {
        if (obj[propName] === null || typeof obj[propName] === "undefined") {
            delete obj[propName];
        }
    }
};