let TokenHandler = require("../utils/token");
let ErrorHandler = require("../utils/response_handler");
const firestoreFactory = require("../environments/firestore_factory");
const firestore = firestoreFactory();
const commentDB = firestore.collection(__Comment.prototype.collectionName());

exports.create = (req, res, next) => {
    let comment = new __Comment(req.body);
    const creator = TokenHandler.getEmail(req);
    comment.creator(creator);
    comment.created_date(new Date());
    commentDB.add(comment.toJSON())
        .then(doc => {
            comment.id(doc.id);
            ErrorHandler.success(res, comment.toJSON());
        })
        .catch(error => {
            ErrorHandler.error(res, ErrorCodes.CREATE_COMMENT_FAIL, error.message);
        })
};

exports.reads = (req, res, next) => {
    commentDB
        .where("topic", "==", req.body.topic)
        .orderBy("created_date", "desc")
        .limit(3)
        .get()
        .then(snapshot => {
            let arr = [];
            snapshot.docs.forEach(doc => {
                let r = new __Comment(doc.data(), doc.id);
                arr.push(r.toJSON());
            });  
            ErrorHandler.success(res, {comments : arr});
        })
        .catch(err => {
            ErrorHandler.error(res, ErrorCodes.ERROR, err.message);
        });
};
