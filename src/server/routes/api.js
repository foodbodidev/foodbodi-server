var express = require('express');
var router = express.Router();
const firestoreFactory = require("../environments/firestore_factory");
const firestore = firestoreFactory();

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
    let {email, password} = req.body;
    if (!!email && !!password) {
        let userRef = db.collection('users').doc(email);
        let getDoc = userRef.get()
            .then(doc => {
                if (!doc.exists) {
                    let docRef = firestore.collection("users").doc(email);
                    docRef.set({
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
router.post("/googleSignIn", (req, res, next) => {

});
router.post('/facebookSignIn', (req, res, next) => {

});

module.exports = router;
