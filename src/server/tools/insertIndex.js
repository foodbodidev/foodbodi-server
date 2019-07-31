let {addIndex} = require("../controllers/search");

let document = {
    name : "Restaurant Greenhouse",
    address : "123 Truong Chinh Tan Binh"
};
addIndex(document.name + " " + document.address, "restaurant", "exampleId", document, (result ) => {
    console.log(result)
}, error => {
    console.log(error);
});


let document1 = {
    name : "Restaurant Redhouse",
    address : "123 Street America"
};
addIndex(document1.name + " " + document1.address, "restaurant", "exampleId1", document1, (result ) => {
    console.log(result)
}, error => {
    console.log(error);
});

let document2 = {
    name : "Restaurant Outsider",
    address : "4/18 Hai Ba Trung Tan Phu"
};

addIndex(document2.name + " " + document2.address, "restaurant", "exampleId2", document2, (result ) => {
    console.log(result)
}, error => {
    console.log(error);
});