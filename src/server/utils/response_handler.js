module.exports = {
    error : (res, error_code, message) => {
        res.send({status_code : error_code, message : message});
    },
    success : (res, data) => {
        res.send({status_code : 0, data : data});
    }
};