exports.isPrivilege = (pri) => {
    return (req, res, next) => {
        let { email } = req.token_data;
        next();
        // if (!!email) {
        //     let userRef = firestore.collection('users').doc(email);
        //     let getDoc = userRef.get()
        //         .then(doc => {
        //             if (doc.exists) {
        //                 const data = doc.data();
        //                 delete data.password;
        //                 ErrorHandler.success(res, data);
        //             } else {
        //                 ErrorHandler.error(res, ErrorCodes.USER_NOT_FOUND, "User not found");
        //             }
        //         })
        //         .catch(err => {
        //             console.error('Error getting document', err);
        //             ErrorHandler.error(res, ErrorCodes.FIRESTORE_GET_FAIL, "Get user fail");
        //         });

        // } else {
        //     ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Token is invalid");
        // }
    }
}