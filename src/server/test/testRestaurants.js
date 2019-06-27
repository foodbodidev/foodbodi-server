let Restaurant = require("../models/restaurant");

let r = new Restaurant({name : "A"}, "1213");

console.log(r.toJSON());