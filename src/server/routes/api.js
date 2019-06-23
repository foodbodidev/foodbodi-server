var express = require('express');
var router = express.Router();

const firestoreFactory = require("../environments/firestore_factory");
const firestore = firestoreFactory();

var tokenHandler = require("../utils/token");
let {hash} = require("../utils/password");

let tokenVerifier = require("../middlewares/verify_token");

const {OAuth2Client} = require('google-auth-library');
const iOS_CLIENT_ID = "513844011252-2qlodmja1av20n55vro79uv0jc5vj3ck.apps.googleusercontent.com";
const WEB_CLIENT_ID = "513844011252-0220ffhr75mivnrv0jub2ue1kkkgckfr.apps.googleusercontent.com";
const client = new OAuth2Client(iOS_CLIENT_ID);

const axios = require('axios');

async function verify(token) {
    console.info("Verify google token " + token);
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: [iOS_CLIENT_ID, WEB_CLIENT_ID]
    });
    const payload = ticket.getPayload();
    console.info("Google account " + JSON.stringify(payload));
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
                    res.send({status : "error", message : "User not found"});
                } else {
                    const hashPassword = hash(password);
                    const savedHash = doc.data().password;
                    const data = doc.data();
                    delete data.password;
                    if (hashPassword === savedHash) {
                        console.info("User login " + JSON.stringify(doc.data()));
                        res.send({status: "OK",
                            data : data,
                            token: tokenHandler.createToken({email: doc.id})});
                    } else {
                        console.warn("Wrong password : " + email + "-" + password);
                        res.send({status : "Unauthorized", message : "Wrong password"});
                    }
                }
            })
            .catch(err => {
                console.error('Error getting document', err);
                res.send({status : "error", message : "Unexpected error"});
            });

    } else {
        res.send({status : "error", message : "Invalid email or password"});
    }
});
router.post("/register", (req, res, next) => {
    let {email, password, sex, height, weight, target_weight} = req.body;
    if (!!email && !!password) {
        let userRef = firestore.collection('users').doc(email);
        let getDoc = userRef.get()
            .then(doc => {
                if (!doc.exists) {
                    let docRef = firestore.collection("users").doc(email);
                    docRef.set({
                        sex : sex || "MALE",
                        height : height || 0,
                        weight : weight || 0,
                        target_weight : target_weight || 0,
                        password: hash(password),
                        email : email
                    }).then(result => {
                        res.send({status: "OK"});
                    });
                } else {
                    res.send({status : "error", message : "User already exists"})
                }
            })
            .catch(err => {
                console.error('Error getting document', err);
                res.send({status : "error", message : "Unexpected error"});
            });

    } else {
        res.send({status : "error", message : "Invalid email or password"});
    }

});

router.post("/profile", tokenVerifier, (req, res, next) => {
    let update_data = req.body;
    if (update_data.email || update_data.password) {
        res.send({status : "error", message : "Can not update field"});
    } else {
        const {email} = req.token_data;
        if (!!email) {
            let userRef = firestore.collection('users').doc(email);
            let getDoc = userRef.get()
                .then(doc => {
                    if (!doc.exists) {
                        res.send({status: "error", message: "User not found"});
                    } else {
                        userRef.update(update_data)
                            .then(result => {
                                res.send({status : "OK"});
                            })
                            .catch(error => {
                                res.send({status: "error", message: "Unexpected error when updating data"});
                            })
                    }
                })
                .catch(err => {
                    console.error('Error getting document', err);
                    res.send({status: "error", message: "Unexpected error"});
                });

        } else {
            res.send({status: "error", message: "Invalid email or password"});
        }
    }

});

router.get("/profile", tokenVerifier, (req, res, next) => {
    let {email} = req.token_data;
    if (!!email) {
        let userRef = firestore.collection('users').doc(email);
        let getDoc = userRef.get()
            .then(doc => {
                if (doc.exists) {
                    const data = doc.data();
                    delete data.password;
                    res.send({status : "OK", data : data});
                } else {
                    res.send({status : "error", token : "Not found"});
                }
            })
            .catch(err => {
                console.error('Error getting document', err);
                res.send({status : "error", message : "Unexpected error"});
            });

    } else {
        res.send({status : "error", message : "Invalid email"});
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
                            userRef.set({
                                need_password : false
                            }).then(result => {
                                res.send({status: "OK", token : tokenHandler.createToken({email : email})});
                            });
                        } else {
                            let data = doc.data;
                            delete data.password;
                            res.send({status : "OK",
                                data : data,
                                token : tokenHandler.createToken({email : doc.id})})
                        }
                    })
                    .catch(err => {
                        console.error('Error getting document', err);
                        res.send({status : "error", message : "Unexpected error"});
                    });
            } else {
                res.send({status : "error", message : "Email is null"});
            }
        }).catch(error => {
            console.error(error);
            res.send({status : "error", message : "Unexpected error while googleSignIn"})
        });

    } else {
        res.send({status : "error", message : "Missing google if token"});
    }
});
router.post('/facebookSignIn', (req, res, next) => {
    let {facebook_access_token, user_id} = req.body;
    if (!!facebook_access_token && !!user_id) {
        const url = "https://graph.facebook.com/" + user_id + "?fields=name,email&access_token=" + facebook_access_token;
        axios.get(url)
            .then(response => {
               const json = response.data;
               if (json && json.email) {
                   let userRef = firestore.collection('users').doc(json.email);
                   let getDoc = userRef.get()
                       .then(doc => {
                           if (!doc.exists) {
                               let docRef = firestore.collection("users").doc(json.email);
                               userRef.set({
                                   need_password : false
                               }).then(result => {
                                   res.send({status: "OK",
                                       token : tokenHandler.createToken({email : json.email})});
                               });
                           } else {
                               let data = doc.data;
                               delete data.password;
                               res.send({status : "OK",
                                   data : data,
                                   token : tokenHandler.createToken({email : doc.id})})
                           }
                       }).catch(error => {
                           res.send({status : "error", message : "Can not get document"})
                       })

               } else {
                   res.send({status : "error", fb_message : json})
               }
            }).catch(error => {
                console.warn(JSON.stringify(error));
                res.send({status : "error", message : "Unexpected error while facebookSignIn"})

        });
    } else {
        res.send({status :"Unauthorized", message : "Missing access token or userID"});
    }
});

module.exports = router;
