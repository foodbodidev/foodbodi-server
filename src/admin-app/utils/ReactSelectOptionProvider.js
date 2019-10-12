module.exports = {
    from : function(obj) {
        let result = [];
        for (let key of Object.keys(obj)) {
            result.push({
                value : key,
                label : obj[key].name
            })

        }
        return result
    }
};