const ErrorHandler = require("../utils/response_handler");
const ErrorCodes = require("../utils/error_codes");
const firestoreFactory = require("../environments/firestore_factory");
const firestore = firestoreFactory();
let Catalog = require("../models/catalog");
let CatalogDb = firestore.collection(Catalog.prototype.collectionName);
exports.search = function(req, res, next) {
  let {q} = req.query;
  if (q) {
      const words = q.split(" ");
      let promises = [];
      for (let word of words) {
          promises.push(CatalogDb.where("word", "==", word).get())
      }
      Promise.all(promises)
          .then(snapshots => {
              if (snapshots.length > 0) {
                  let map = {};
                  let result = [];
                  //TODO : more precise merge algorithm
                  for (let i = 0; i < snapshots.length; i++) {
                      snapshots[i].docs.forEach(doc => {
                          const catalog = new Catalog(doc.data(), doc.id);
                          if (map.hasOwnProperty(catalog.document_id())) {
                              map[catalog.document_id()].count++;
                          } else {
                              map[catalog.document_id()] = {
                                  data : catalog,
                                  count : 1
                              }
                          }
                      });
                  }

                  ErrorHandler.success(res, Object.values(map));

              } else {
                  ErrorHandler.success(res, []);
              }
          })
  } else {
      ErrorHandler.error(res, ErrorCodes.WRONG_FORMAT, "Require a phrase");
  }
};

exports.addIndex = function(text, kind, document_id, document, successCb, errorCb) {
    if (text !== null) {
        let preprocessedText = preprocessText(text);
        let words = preprocessedText.split(" ");

        if (words.length > 0) {
            let batch = firestore.batch();
            for (let i in words) {
                const word = words[i];
                const catalog = new Catalog({});
                catalog.word(word);
                catalog.kind(kind);
                catalog.document(document);
                catalog.document_id(document_id);
                catalog.position(i);
                let ref = CatalogDb.doc();
                batch.set(ref, catalog.toJSON());
            }
            batch.commit().then(result => {
                successCb(result);
            }).catch(error => {
                errorCb(error);
            })
        }
    }
};

exports.removeIndexOfDocument = function(kind, document_id, successCb, errorCb) {

    CatalogDb.where("kind", "==", kind).where("document_id", "==", document_id).get()
        .then(snapshot => {
            let batch = firestore.batch();
            for (let doc of snapshot.docs) {
                batch.delete(CatalogDb.doc(doc.id))
            }
            return batch.commit()
        }).then(result => {
            successCb(result)
    }).catch(error => errorCb(error));

};

exports.updateIndex = function(kind, document_id, oldText, newText, newDocument, successCb, errorCb) {
    let oldWords = preprocessText(oldText).split(" ");
    let newWords = preprocessText(newText).split(" ");

    CatalogDb.where("kind", "==", kind).where("document_id", "==", document_id)
        .get()
        .then(snapshot => {
            let batch = firestore.batch();
            for (let doc of snapshot.docs) {
                let catalog = new Catalog(doc.data(), doc.id);
                const word = catalog.word();
                const shouldDelete = oldWords.indexOf(word) >= 0 && newWords.indexOf(word) < 0;
                const shouldUpdate = oldWords.indexOf(word) >= 0 && newWords.indexOf(word) >= 0;
                if (shouldDelete) {
                    batch.delete(CatalogDb.doc(doc.id))
                } else if (shouldUpdate) {
                    catalog.position(newWords.indexOf(word));
                    catalog.document(newDocument);
                    batch.update(CatalogDb.doc(doc.id),catalog.toJSON());
                } else { //non effect indexes
                    catalog.document(newDocument);
                    batch.update(CatalogDb.doc(doc.id), catalog.toJSON());
                }
            }
            //shouldCreate
            for (let word of newWords) {
                if (oldWords.indexOf(word) < 0) {
                    let catalog = new Catalog({});
                    catalog.word(word);
                    catalog.document(newDocument);
                    catalog.document_id(document_id);
                    catalog.position(newWords.indexOf(word));
                    batch.set(CatalogDb.doc(), catalog.toJSON());
                }
            }
            return batch.commit();
        }).then(result => successCb(result)).catch(error => errorCb(error));

};

let preprocessText = function(text) {
    return text.trim().toLowerCase().replace(/\s\s+/g, ' ');
};
