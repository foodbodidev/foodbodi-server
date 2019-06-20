var express = require('express');
var router = express.Router();
const firestoreFactory = require("../environments/firestore_factory");
const firestore = firestoreFactory();

let tokenVerifier = require("../middlewares/verify_token");

router.post('/login', function(req, res, next) {
    let {email, password} = req.body;
    if (!!email && !!password) {
        let userRef = db.collection('users').doc(email);
        let getDoc = userRef.get()
            .then(doc => {
                if (!doc.exists) {
                    res.send({status : "error", message : "User not found"});
                } else {
                    res.send({status : "OK", token : "generetedtoken"});
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
                res.send({status : "error", message : "Unexpected error"});
            });

    } else {
        res.send({status : "error", message : "Invalid email or password"});
    }
});
router.post("/register", (req, res, next) => {
    let {email, password, sex, height, weight, target_weight} = req.body;
    if (!!email && !!password) {
        let userRef = db.collection('users').doc(email);
        let getDoc = userRef.get()
            .then(doc => {
                if (!doc.exists) {
                    let docRef = firestore.collection("users").doc(email);
                    docRef.set({
                        sex : sex,
                        height : height,
                        weight : weight,
                        target_weight : target_weight,
                        password: password
                    }).then(result => {
                        res.send({status: "OK"});
                    });
                } else {
                    res.send({status : "error", message : "User already exists"})
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
                res.send({status : "error", message : "Unexpected error"});
            });

    } else {
        res.send({status : "error", message : "Invalid email or password"});
    }

});

router.post("/profile", tokenVerifier, (req, res, next) => {
    let {sex, height, weight, target_weight} = req.body;

});

router.get("/profile", tokenVerifier, (req, res, next) => {
    let {email} = req.token_data;
    if (!!email) {
        let userRef = db.collection('users').doc(email);
        let getDoc = userRef.get()
            .then(doc => {
                if (!doc.exists) {
                    const data = doc.data();
                    data.password = "";
                    res.send({status : "error", data : data});
                } else {
                    res.send({status : "error", token : "Not found"});
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
                res.send({status : "error", message : "Unexpected error"});
            });

    } else {
        res.send({status : "error", message : "Invalid email"});
    }
});


router.post("/googleSignIn", (req, res, next) => {
    let {google_id_token} = req.body;
    if (!!google_id_token) {
        //TODO : verify with google
        //TODO : determine should register or login
    } else {

    }
});
router.post('/facebookSignIn', (req, res, next) => {

});

router.post('/')

module.exports = router;
