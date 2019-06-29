var describe = require ('mocha').describe;
var chai = require('chai');
var chaiHttp = require('chai-http');
var assert = chai.assert;
let Restaurant = require("../models/restaurant");

chai.use(chaiHttp);

describe('test Restaurant', function() {
    it("test model", (done) => {
        let r = new Restaurant({name : "A"}, "1213");
        const json = r.toJSON();
        assert.equal(json.name, "A");
        assert.equal(json.id, "1213");
        done();
    });

    it("test create restaurant", (done) => {
        let r = new Restaurant({name : "Test restauranr"});

        done();
    })

});