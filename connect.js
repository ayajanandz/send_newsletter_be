'use strict';

// const dotenv = require('dotenv')
// dotenv.config();

const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://innovaiton2023:%21nnovait-On%402023@cluster0.yyzjiep.mongodb.net/?retryWrites=true&w=majority"

const databaseName ='version_1'
const client = new MongoClient(uri);

const connectDB = async () => {
    let result =  await client.connect();
    let mongoDB = result.db(databaseName);
    return mongoDB;
}

module.exports = {
    connectDB
};