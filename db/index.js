require('dotenv').config();

var { Client } = require("pg");
var db = process.env.NODE_ENV === "test" ? "studentstest" : "students";

var dbConnection = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${db}`

console.log("CONNECTION STRING: ", dbConnection);

client = new Client({
    connectionString: dbConnection
})

client.connect();

module.exports = client;