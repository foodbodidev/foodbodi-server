var express = require('express');
// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');
const path = require('path');
const Multer = require('multer');
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // no larger than 10mb, you can change as needed.
    },
});

// Your Google Cloud Platform project ID
const projectId = 'Foodbodi';

// Creates a client
const storage = new Storage({
    projectId: projectId,
});

// The name for the new bucket

let ErrorHandler = require("../utils/response_handler");
let ErrorCodes = require("../utils/error_codes");

const router = module.exports = express.Router();
if (process.env.FOODBODI_ENV === "prod") {
    router.post("/photo", multer.single("file"), (req, res, next) => {
        if (!req.file) {
            ErrorHandler.error(res, ErrorCodes.UPLOAD_FAIL, "No file uploaded");
            return;
        }


        // Create a new blob in the bucket and upload the file data.
        const bucketName = "foodbodi-photos";
        let filenamePrefix = req.query.filename || "photo";
        let filename = filenamePrefix + "-" + new Date().getTime();
        console.log("Prepare upload " + filename);

        const blob = storage.bucket(bucketName).file(filename);
        const blobStream = blob.createWriteStream({
            contentType: "image/jpeg",
            gzip: true,
            public: true
        });
        blobStream.on('error', err => {
            console.log("Upload fail " + err.message);
            ErrorHandler.error(res, ErrorCodes.UPLOAD_FAIL, err.message);
        });

        blobStream.on('finish', () => {
            console.log("Upload " + filename + " finish");
            storage.bucket(bucketName).file(filename)
                .get().then(result => {
                ErrorHandler.success(res, result[1]);
            }).catch(err => {
                ErrorHandler.error(res, ErrorCodes.GET_UPLOADED_FILE_FAIL, err.message);
            })
        });
        blobStream.end(req.file.buffer);
    });
} else {
    var localStorage = Multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, "../public/upload"));
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname)
        },
        limits: {
            fileSize: 10 * 1024 * 1024, // no larger than 10mb, you can change as needed.
        },
    });
    const upload = Multer({storage : localStorage});
    router.post("/photo", upload.single("file"), (req, res, next) => {
        if (!req.file) {
            ErrorHandler.error(res, ErrorCodes.UPLOAD_FAIL, "No file uploaded");
            return;
        }
        ErrorHandler.success(res, {mediaLink : "/upload/" + req.file.filename})
    });
}

router.get('/photo', (req, res) => {
    res.render('upload.pug');
});