const admin = require('firebase-admin');
const token = require("../utils/token");
let serviceAccount = require('./Foodbodi-service-account.json');
const {OAuth2Client} = require('google-auth-library');
const iOS_CLIENT_ID = "513844011252-2qlodmja1av20n55vro79uv0jc5vj3ck.apps.googleusercontent.com";
const WEB_CLIENT_ID = "513844011252-0220ffhr75mivnrv0jub2ue1kkkgckfr.apps.googleusercontent.com";

const client = new OAuth2Client(iOS_CLIENT_ID);
const axios = require('axios');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

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

let db = admin.firestore();

/*const google_account_info = verify("eyJhbGciOiJSUzI1NiIsImtpZCI6IjY4NjQyODlmZmE1MWU0ZTE3ZjE0ZWRmYWFmNTEzMGRmNDBkODllN2QiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNTEzODQ0MDExMjUyLTAyMjBmZmhyNzVtaXZucnYwanViMnVlMWtra2dja2ZyLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNTEzODQ0MDExMjUyLTAyMjBmZmhyNzVtaXZucnYwanViMnVlMWtra2dja2ZyLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE3NzUyMzE1NDQyNDMwMDYxMDg3IiwiZW1haWwiOiJkdXl5LnVpdEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6InZkdVYxTUR6R0FkMlJsQUhhTC1CS2ciLCJuYW1lIjoiTmd1eWVuIER1eSBZIiwicGljdHVyZSI6Imh0dHBzOi8vbGg0Lmdvb2dsZXVzZXJjb250ZW50LmNvbS8tb3VxMWhGdThMdVEvQUFBQUFBQUFBQUkvQUFBQUFBQUFBVnMvMVVKZDFYNkVaaEUvczk2LWMvcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6Ik5ndXllbiIsImZhbWlseV9uYW1lIjoiRHV5IFkiLCJsb2NhbGUiOiJ2aSIsImlhdCI6MTU2MTEzMDg0MiwiZXhwIjoxNTYxMTM0NDQyLCJqdGkiOiI3MmIyMGIwYzhkZDEzMWZiMjcyNWIxZTVhYWQ5NmVhZTU4ZDhlMmIyIn0.KZcLL-F__GlLGqodlb_iWsIZ12Rl1m5ygpgESyqMqAwafvkZZkfR0PMElQbnTbILR12dRBxBs6dtOilbjEfngb015fup4unQE0BVDuzgEnob9-uOyBlty4nZhcnYsNZR3Gh3r6Xvtko-ta8vtAZa_6Nth-qytSA0rsHpYNrGJ7kdKdDg_cmVrO_9gZG9-RDjvkLgxnZ37tF5MW9lnmWQV5-hBi4rt7lAgg-kKNUIJ9vf4VoC1qPUZG4bEG5GXzLxDl2TAngkOjbLCAREFoxe8ut2CdBbki-uwHACwvQQRUx4Ax30ygPa9uPcsMRM6K0GcUyl-fn2XqWcQpJXLG5SNA");
 google_account_info.then((result) => {
     console.log(result);
 });*/

const url = "https://graph.facebook.com/2218318608259617?fields=name,email&access_token=EAAKVWmALQBsBADRWZBKIE6hBxozOZBGX9kaR2eUYLDQVgz8EIEvW3H8ANJahcGS2D8H5MoOEExlrAjphtR69DEqlnx1ZAoFqwCYCgp6qhZANRWrZAZCl1HJKmb3gxyrQbviPm53CZA9o1i91HezZA7pCZAMbeKwvENB9DMWENnOndz7tZAWYTBoiD3tQIDlRxDxIwOwIolMrgwLAZDZD";
axios.get(url)
    .then(response => {
        const json = JSON.parse(response);
        if (json && json.email) {
            let userRef = db.collection('users').doc(json.email);
            let getDoc = userRef.get()
                .then(doc => {
                    if (!doc.exists) {
                        let docRef = db.collection("users").doc(json.email);
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
                })

        } else {
            res.send({status : "error", fb_message : json})
        }
    }).catch(error => {
    console.warn(JSON.stringify(error));
    res.send({status : "error", message : "Unexpected error while facebookSignIn"})

});
