let {updateIndex} = require("../controllers/search");

let document = {
    name : "Restaurant Purplehouse ",
    address : "50 Truong dinh"
};

let Olddocument = {
    name : "Restaurant Greenhouse",
    address : "123 Truong Chinh Tan Binh"
};

updateIndex("restaurant", "exampleId", Olddocument.name +" "+ Olddocument.address,
    document.name + " " +document.address, document,
(result) => console.log(result), error => console.log(error));