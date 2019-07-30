let TokenHandler = require("../utils/token");
let ErrorHandler = require("../utils/response_handler");
const firestoreFactory = require("../environments/firestore_factory");
const firestore = firestoreFactory();
const commentDB = firestore.collection(__Comment.prototype.collectionName());
const restaurantDB = firestore.collection(__Restaurant.prototype.collectionName());

exports.create = (req, res, next) => {
    let comment = new __Comment(req.body);
    let id = req.body.restaurantId
    if (id) {
        restaurantDB.doc(id).get().then(doc => {
            if (doc.exists) {
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
            } else {
                ErrorHandler.error(res, ErrorCodes.RESTAURANT_NOT_FOUND, "Can not found restaurant " + id);
            }
        }).catch(error=> {
            ErrorHandler.error(res, ErrorCodes.ERROR, error.message);
        });
    } else {
        ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Missing id");
    }
};
//TODO : get comment will be handle in mobile. Cursor handling in this API is still not correct, we will comeback later
exports.reads = (req, res, next) => {
    const query =   commentDB
                    .where("restaurant_id", "==", req.body.restaurantId)
                    .orderBy("created_date", "desc")
                    .limit(3);
    query.get().then(snapshot => {
        let lastVisible = snapshot.docs[snapshot.docs.length-1];
        let arr = [];
        let next = query.startAt(lastVisible.data().created_date);

        next.get().then(function(docSn){
                let r = new __Comment(docSn.data(), docSn.id);
                arr.push(r.toJSON());
            })
            ErrorHandler.success(res, {comments : arr});
        })
        .catch(err => {
            ErrorHandler.error(res, ErrorCodes.ERROR, err.message);
        });
};
