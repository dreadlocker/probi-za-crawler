"use strict";

const init = (db) => {
    const collection = db.collection("items2");
    return collection.find({}).toArray();
}

module.exports = { init };