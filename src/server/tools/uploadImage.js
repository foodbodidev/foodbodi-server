let FormData = require("form-data");
let fs = require("fs");
let http = require("http");
let request = http.request;



const readstream = fs.createReadStream("./IMG_0048.JPG");
const formData = new FormData();
formData.append("file", readstream);
console.log(formData.getHeaders());

const req = request({
        host: 'localhost',
        port: '3000',
        path: '/api/upload/photo?filename=concho',
        method: 'POST',
        headers: formData.getHeaders(),
    },
    response => {
        console.log(response); // 200
    });

formData.pipe(req);