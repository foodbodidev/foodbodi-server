var describe = require ('mocha').describe;
var chai = require('chai');
var chaiHttp = require('chai-http');
var assert = chai.assert;
var validator = require("validator");
const firestoreFactory = require("../environments/firestore_factory");
const firestore = firestoreFactory();
let Restaurant = require("../models/restaurant");

chai.use(chaiHttp);

describe('test Restaurant', function() {
    it("test model", (done) => {
        let r = new Restaurant({name : "A"}, "1213");
        const json = r.toJSON();
        assert.equal(json.name, "A");
        assert.equal(json.id, "1213");
        let a = validator.isAscii("Chung cư Phú Hoà");
        assert.equal(r.collectionName(), "restaurants");
        done();
    });

    it("test create restaurant", (done) => {
        let r = new Restaurant({name : "Test restauranr"});
        firestore.collection("users").doc("A").set({
            name : "Test"
        }).then(doc => {
            console.log(doc);
        }).catch(err => {
            console.log(err)
        });
        done();
    });
    it('test calculate neighbour', (done) => {
       let r = new Restaurant({"name" : "ABC", lat : 48.669, lng :-4.329});
       r.calculateNeighbour();
       let neighbour = r.getNeighbours();
       assert.equal(neighbour.indexOf("gbsuv") > -1, true);
       assert.equal(neighbour.indexOf("gbsvj") > -1, true);
       assert.equal(neighbour.indexOf("gbsut") > -1, true);
       assert.equal(neighbour.indexOf("gbsuu") > -1, true);
       assert.equal(neighbour.indexOf("gbsuy") > -1, true);
       assert.equal(neighbour.indexOf("gbsvh") > -1, true);
       assert.equal(neighbour.indexOf("gbsvn") > -1, true);
       assert.equal(neighbour.indexOf("gbsus") > -1, true);
       assert.equal(neighbour.indexOf("gbsuw") > -1, true);

       done()

    });

});