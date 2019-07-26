module.exports = {
    error : (res, error_code, message) => {
        if (!!message && typeof message === "object") {
            res.send({status_code: error_code, message: message.message});
        } else {
            res.send({status_code: error_code, message: message});
        }
    },
    success : (res, data) => {
        res.send({status_code : 0, data : data});
    },
};