const express = require("express"); //loads the express library into the file
const mysql = require("mysql"); //loads the mysql library into the file 
const mysqlcredentials = require("./mysqlcreds.js");
const db = mysql.createConnection(mysqlcredentials); //"use these credentials to establish preliminary connection to the database"

const server = express(); //instantiates a server into the const variable server 
server.use(express.static(__dirname + "/html"));
server.use(express.urlencoded({extended: false})); //have express pull urlencoded data from the body and store it in 'body'

server.get("/api/grades", (request, response)=>{
    db.connect(()=>{
        const query = "SELECT `id`, CONCAT(`givenname`, ' ', `surname`) AS `name`, `course`, `grade` FROM `grades`";
        db.query(query, (error, data)=>{ //sends the query to the database (error=null if there was no error)
            const output = {
                success: false,
            };
            if (!error){
                output.success = true;
                output.data = data;
            } else {
                output.error = error;
            }
            response.send(output);
        });
    });
});
//in reality, we wouldn't send the error data back to the client...only during development for our purposes 

server.post("/api/grades", (request, response)=>{

}); //for adding data to the database



server.listen(3001, ()=>{
    console.log("carrier has arrived");
}); //tells the server to listen for a connection at port 3001, and to execute the callback function 


