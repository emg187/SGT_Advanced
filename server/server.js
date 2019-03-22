const express = require("express"); //loads the express library into the file
const mysql = require("mysql"); //loads the mysql library into the file 
const mysqlcredentials = require("./mysqlcreds.js");
const db = mysql.createConnection(mysqlcredentials); //"use these credentials to establish preliminary connection to the database"

const server = express(); //instantiates a server into the const variable server 
server.use(express.static(__dirname + "/html"));
server.use(express.urlencoded({extended: false})); 

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
    if (request.body.name===undefined || request.body.course===undefined || request.body.grade===undefined){
        response.send({
            success: false,
            error: "Invalid name, course, or grade"
        });
        return;
    }
    db.connect(()=>{
        const name = request.body.name.split(" ");
        const query = 'INSERT INTO `grades` SET `surname`="'+name.slice(1).join(" ")+'", `givenname`="'+name[0]+'", `course`="'+request.body.course+'", `grade`='+request.body.grade+', `added`=NOW()';
        db.query(query, (error, result)=>{
            if (!error){
                response.send({
                    success: true,
                    new_id: result.insertId //returns the new value of the auto-incrementing field of the table 
                });
            } else {
                response.send({
                    success: false, 
                    error //object structuring
                });
            }
        });
    });
}); //for adding data to the database

server.delete("/api/grades", (request, response)=>{
    if (request.query.student_id===undefined){
        response.send({
            success: false,
            error: "must provide a student id for delete"
        });
        return;
    }
    db.connect(()=>{
        const query = "DELETE FROM `grades` WHERE `id`= "+request.query.student_id;
        db.query(query, (error, result)=>{
            if (!error) {
                response.send({
                    success: true
                });
            } else {
                response.send({
                    success: false,
                    error
                });
            }
        });
    });
});

server.listen(3001, ()=>{
    
}); //tells the server to listen for a connection at port 3001, and to execute the callback function 


