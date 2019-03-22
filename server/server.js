const express = require("express"); //loads the express library into the file
const mysql = require("mysql");
const mysqlcredentials = require("./mysqlcreds.js");
const db = mysql.createConnection(mysqlcredentials); //"use these credentials to connect to the database"

const server = express(); //instantiates a server into the const variable server 

server.use(express.static(__dirname + "/html"));

server.get("/api/grades", (request, response)=>{
    response.send(`{
        "success": true,
        "data": [{
            "id": 10,
            "name": "Eric George",
            "course": "Linear Algebra",
            "grade": 85
        }, {
            "id": 12,
            "name": "Sandy Happyfeet",
            "course": "Penguin Dancing",
            "grade": 80
        }, {
            "id": 14,
            "name": "Chewie Bacca",
            "course": "Porg Roasting",
            "grade": 89
        }]
    }`);
});

server.listen(3001, ()=>{
    console.log("carrier has arrived");
}); //tells the server to listen for a connection at port 3001, and to execute the callback function 


