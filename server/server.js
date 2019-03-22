const express = require("express"); //loads the express library into the file

const server = express(); //instantiates a server into the const server 

server.use(express.static(__dirname + "/html"));

var insults = [
    "your father smelt of elder berries",
    "I bet you still use var", 
    "ya mum"
];

//two arguments: the first is the path to listen for
//the second is a callback function to run once that path has been received
server.get("/", function(request, response){
    //an object representing all the data going from client to server
    //an object representing all the data going from server to client 

    response.send("Hello, world");

});

server.get("/time", (request, response)=>{
    var now = new Date();
    response.send(now.toLocaleDateString());
});

server.get("/insults", (request, response)=>{
    var insult = insults[Math.floor(Math.random()*insults.length)];

    response.send(insult);
});

server.listen(3001, ()=>{
    console.log("carrier has arrived");
}); //tells the server to listen for a connection at port 3001, and to execute the callback function 