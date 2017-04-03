var express = require('express');  
var app = express();  
var server = require('http').Server(app);
var io = require('socket.io')(server);

var nickname; //used to hold the users nicknames
var numberOfUsers = 0; //used to hold the amount of connected users

app.use(express.static(__dirname + '/public')); 
app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(client){ //when a client connects
    
    numberOfUsers++; //increase number of users by 1
    io.emit('numUsers', numberOfUsers); //send the number of online users to the client
    //console.log(numberOfUsers);
    
    
     client.on('changeName', function (data) { //when changeName function is run

            var clientInfo = new Object(); //creating a new client object
            clientInfo.customId         = data.customId;
            clientInfo.clientId     = client.id;
            nickname = clientInfo.customId; //sets the nickname to be the text sent back from the client
            var oldName = client.id; //saves the clients old id
            client.id = nickname; //replaces the id with the new nickname
            io.emit('chat message', oldName + " changed their name to: " + client.id); //sends a chat message to all the clients that the user has changed their name
            
        });
    
    console.log("Somebody's here...");
    //io.emit('chat message', "A user connected");
    
    client.on('disconnect', function() //when a client disconnects
    {
        console.log("One down");
        io.emit("chat message", client.id + " disconnected"); //sends a message to all the clients telling them that the user has disconnected
        numberOfUsers--; //decreases numberOfUsers by 1
        io.emit('numUsers', numberOfUsers); //send the number of online users to the clients
    });

    
    client.on('chat message', function(msg) //when chat message function is run
    {
        io.emit('chat message', client.id + ": " + msg); //return the clients id and the message to the client
    });
    
    client.on('changeName2', function(newName) //when chat message function is run
    {
        io.emit('chat message', newName); //return the clients id and the message to the client
    });
    
    io.clients(function(error, clients)
    {
	   if (error) throw error;
        //send the list of clients out to all the clients
		io.emit('clientList', clients);
        io.emit("chat message", client.id + " connected");
	});
    
    
    
   
    
});

server.listen(3000, function(){
  console.log('listening on *:3000');
});