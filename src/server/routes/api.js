var express = require('express');
var router = express.Router();

const firestoreFactory = require("../environments/firestore_factory");
const firestore = firestoreFactory();

let Restaurant = require("../models/restaurant");


var tokenHandler = require("../utils/token");
let {hash} = require("../utils/password");

let tokenVerifier = require("../middlewares/verify_token");

const {OAuth2Client} = require('google-auth-library');
const iOS_CLIENT_ID = "513844011252-2qlodmja1av20n55vro79uv0jc5vj3ck.apps.googleusercontent.com";
const WEB_CLIENT_ID = "513844011252-0220ffhr75mivnrv0jub2ue1kkkgckfr.apps.googleusercontent.com";
const client = new OAuth2Client(iOS_CLIENT_ID);

const axios = require('axios');

const ErrorHandler = require("../utils/response_handler");
const ErrorCodes = require("../utils/error_codes");

let logger = require("../environments/logger")();

let createUserInfo = (input) => {
    let {sex, height, weight, target_weight, age, first_name, last_name, email} = input;
    let data = {
        age : age || 0,
        sex : sex || "MALE",
        height : height || 0,
        weight : weight || 0,
        target_weight : target_weight || 0,
        first_name : first_name || "",
        last_name : last_name || "",
        daily_calo : 2500,
        email : email
    };
    return data;

};

async function verify(token) {
    logger.info("Verify google token " + token);
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: [iOS_CLIENT_ID, WEB_CLIENT_ID]
    });
    const payload = ticket.getPayload();
    logger.info("Google account " + JSON.stringify(payload));
    return payload;
}

//TODO : will refactor later, now write it fast to test the cloud

router.post('/login', function(req, res, next) {
    let {email, password} = req.body;
    if (!!email && !!password) {
        let userRef = firestore.collection('users').doc(email);
        let getDoc = userRef.get()
            .then(doc => {
                if (!doc.exists) {
                    ErrorHandler.error(res, ErrorCodes.USER_NOT_FOUND, "User not found");
                } else {
                    const hashPassword = hash(password);
                    const savedHash = doc.data().password;
                    const data = doc.data();
                    delete data.password;
                    if (hashPassword === savedHash) {
                        logger.info("User login " + JSON.stringify(doc.data()));
                        ErrorHandler.success(res, {
                            user : data,
                            token : tokenHandler.createToken({email: doc.id})
                        });
                    } else {
                        logger.warn("Wrong password : " + email + "-" + password);
                        ErrorHandler.error(res, ErrorCodes.UNAUTHORIZED, "Wrong password");
                    }
                }
            })
            .catch(err => {
                logger.error('Error getting document : ' + err);
                ErrorHandler.error(res, ErrorCodes.LOGIN_EXCEPTION, "Login fail");
            });

    } else {
        ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Invalid email or password");
    }
});
router.post("/register", (req, res, next) => {
    let {email, password, sex, height, weight, target_weight, age, first_name, last_name} = req.body;
    if (!!email && !!password) {
        let userRef = firestore.collection('users').doc(email);
        let getDoc = userRef.get()
            .then(doc => {
                if (!doc.exists) {
                    let docRef = firestore.collection("users").doc(email);
                    docRef.set({
                        age : age || 0,
                        sex : sex || "MALE",
                        height : height || 0,
                        weight : weight || 0,
                        target_weight : target_weight || 0,
                        password: hash(password),
                        email : email,
                        first_name : first_name || "",
                        last_name : last_name || ""
                    }).then(result => {
                        ErrorHandler.success(res, {});
                    });
                } else {
                    ErrorHandler.error(res, ErrorCodes.USER_EXISTS, "User already exists");
                }
            })
            .catch(err => {
                logger.error('Error getting document ' + err);
                ErrorHandler.error(res, ErrorCodes.ERROR, "Register fail");
            });

    } else {
        ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Invalid email or password");
    }

});

router.post("/profile", tokenVerifier, (req, res, next) => {
    let update_data = req.body;
    if (update_data.email || update_data.password) {
        ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Can not update fields");
    } else {
        const email = tokenHandler.getEmail(req);
        if (!!email) {
            let userRef = firestore.collection('users').doc(email);
            let getDoc = userRef.get()
                .then(doc => {
                    if (!doc.exists) {
                        ErrorHandler.error(res, ErrorCodes.USER_NOT_FOUND, "User not found");
                    } else {
                        userRef.update(update_data)
                            .then(result => {
                                ErrorHandler.success(res, {});
                            })
                            .catch(error => {
                                ErrorHandler.error(res, ErrorCodes.FIRESTORE_UPDATE_FAIL, "Update user fail");
                            })
                    }
                })
                .catch(err => {
                    console.error('Error getting document', err);
                    ErrorHandler.error(res, ErrorCodes.FIRESTORE_GET_FAIL, "Get user fail");
                });

        } else {
            ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Token is invalid");
        }
    }

});

router.get("/profile", tokenVerifier, (req, res, next) => {
    let {email} = req.token_data;
    let {include_restaurant} = req.query;
    if (!!email) {
        let userRef = firestore.collection('users').doc(email);
        let getDoc = userRef.get()
            .then(doc => {
                if (doc.exists) {
                    const data = doc.data();
                    delete data.password;
                    if (include_restaurant || false) {
                        firestore.collection(Restaurant.prototype.collectionName())
                            .where("creator", "==", email)
                            .get()
                            .then(snapshot => {
                                let restaurants = [];
                                snapshot.docs.forEach(item => {
                                    let restaurant = new Restaurant(item.data(), item.id);
                                    restaurants.push(restaurant.toJSON(false));
                                });
                                data.restaurants = restaurants;
                                ErrorHandler.success(res, data);
                            })
                    } else {
                        ErrorHandler.success(res, data);
                    }
                } else {
                    ErrorHandler.error(res, ErrorCodes.USER_NOT_FOUND, "User not found");
                }
            })
            .catch(err => {
                console.error('Error getting document', err);
                ErrorHandler.error(res, ErrorCodes.FIRESTORE_GET_FAIL, "Get user fail");
            });

    } else {
        ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Token is invalid");
    }
});


router.post("/googleSignIn", (req, res, next) => {
    let {google_id_token} = req.body;
    if (!!google_id_token) {
        const google_account_info = verify(google_id_token);
        google_account_info.then(result => {
            const email = result.email;
            if (email) {
                let userRef = firestore.collection('users').doc(email);
                let getDoc = userRef.get()
                    .then(doc => {
                        if (!doc.exists) {
                            let docRef = firestore.collection("users").doc(email);
                            let userInfo = createUserInfo(req.body);
                            userInfo.email = email;
                            userInfo.need_password = false;
                            userRef.set(userInfo).then(result => {
                                ErrorHandler.success(res, {
                                    data : userInfo,
                                    token : tokenHandler.createToken({email : email})
                                });
                            });
                        } else {
                            let data = doc.data();
                            delete data.password;
                            ErrorHandler.success(res, {
                                data : data,
                                token : tokenHandler.createToken({email : doc.id})
                            });
                        }
                    })
                    .catch(err => {
                        console.error('Error getting document', err);
                        ErrorHandler.error(res, ErrorCodes.FIRESTORE_GET_FAIL, "Get user fail");
                    });
            } else {
                ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Can not get email from google");
            }
        }).catch(error => {
            console.error(error);
            ErrorHandler.error(res, ErrorCodes.GOOGLE_LOGIN_FAIL, "Unexpected error while googleSignIn");
        });

    } else {
        ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Missing google_id_token");
    }
});
router.post('/facebookSignIn', (req, res, next) => {
    let {sex, height, weight, target_weight, age, first_name, last_name} = req.body;
    let {facebook_access_token, user_id} = req.body;
    if (!!facebook_access_token && !!user_id) {
        const url = "https://graph.facebook.com/" + user_id + "?fields=name,email&access_token=" + facebook_access_token;
        axios.get(url)
            .then(response => {
               const json = response.data;
               logger.info("Facebook token data " + JSON.stringify(json));
               if (json && json.id) {
                   let userRef = firestore.collection('users').doc(json.id);
                   let getDoc = userRef.get()
                       .then(doc => {
                           if (!doc.exists) {
                               let docRef = firestore.collection("users").doc(json.id);
                               let userInfo = createUserInfo(req.body);
                               userInfo.email = json.id
                               userInfo.need_password = false;
                               userRef.set(userInfo).then(result => {
                                   ErrorHandler.success(res, {
                                       data : userInfo,
                                       token : tokenHandler.createToken({email : json.id})
                                   });
                               });
                           } else {
                               let data = doc.data();
                               delete data.password;
                               ErrorHandler.success(res, {
                                   data : data,
                                   token : tokenHandler.createToken({email : doc.id})
                               });
                           }
                       }).catch(error => {
                           ErrorHandler.error(res, ErrorCodes.FIRESTORE_GET_FAIL, "Can not get user");
                       })

               } else {
                   ErrorHandler.error(res, ErrorCodes.FACEBOOK_LOGIN_FAIL, "Missing facebook id");
               }
            }).catch(error => {
                console.warn(JSON.stringify(error));
                ErrorHandler.error(res, ErrorCodes.FACEBOOK_LOGIN_FAIL, "Unexpected error while facebookSignIn");

        });
    } else {
        ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Missing facebook_access_token or user_id");
    }
});

module.exports = router;
