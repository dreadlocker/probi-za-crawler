"use strict";

const { MongoClient } = require("mongodb"),
    init = () => {
        return MongoClient.connect("mongodb://localhost/items-db2");
    }

module.exports = { init };