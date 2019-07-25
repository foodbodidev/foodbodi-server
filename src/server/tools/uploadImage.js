let FormData = require("form-data");
let fs = require("fs");
let https = require("https");
let request = https.request;



const readstream = fs.createReadStream("./IMG_0048.JPG");
const formData = new FormData();
formData.append("file", readstream);
console.log(formData.getHeaders());

const req = request({
        host: 'foodbodi.appspot.com',
        //port : "3000",
        path: '/api/upload/photo?filename=concho2',
        method: 'POST',
        headers: formData.getHeaders(),
    },
    response => {

        console.log(response.statusCode); // 200
    });

formData.pipe(req);