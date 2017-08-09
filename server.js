"use strict";

const async = () => {
    return Promise.resolve();
}

async()
.then(() => require("./db").init())
    .then((db) => require("./data").init(db))
    .then((data) => require("./app").init(data))
    .then((app) => app.listen(3001, () => console.log("Listen to 3001")));



// const { MongoClient } = require("mongodb");
// MongoClient.connect("mongodb://localhost/items-db2")
//     .then((db) => {
//         const collection = db.collection("items2");
//         return collection.find({}).toArray();
//     })
//     .then((data) => {
//         console.log(data);
//     })