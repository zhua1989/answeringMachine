var net = require('net');
var fs = require('fs');
var port = 2000;




var server = net.createServer(function(connection) {
    console.log("I'm connected now!")
    var counter = 0;
    connection.on('data', function(dataFromClient) {
        console.log("i love data!");
        var msgString = dataFromClient.toString().trim();
        var splitMsg = msgString.split(" ");
        console.log(typeof splitMsg[0]);
        counter++;
        fs.readFile('./messages.json', 'utf8', function(err, data) {
            var object = JSON.parse(data);
            console.log(data)
            if (splitMsg[0] === 'add') {
                var message = splitMsg.slice(2, splitMsg.length + 1).join().replace(/,/g, " ");
                var msgObject = {
                    ID: counter,
                    User: splitMsg[1],
                    message: message
                }
                object.push(msgObject)
                console.log(object)
                var stringMessage = JSON.stringify(object)
                fs.writeFile('./messages.json', stringMessage, function	(err) {
                    console.log("No error?")
                })
            } else if (splitMsg[0] === 'list') {
                for (var i = 0; i < object.length; i++) {
                    console.log(object[i])
                    connection.write(object[i].message)
                }
            } else if (splitMsg[0] === 'removeall') {
            	object = [];
            	var stringObject = JSON.stringify(object)
            	fs.writeFile('./messages.json', stringObject,function(err){
            		console.log("yay");
            		connection.write("All your messages have been removed!")
            	})
            } else if (splitMsg[0] === 'delete') {
            	var deleteID = splitMsg[1]
            	object.forEach(function(element, index) {
            		console.log(index);
            	    if (element.ID == deleteID) {
            	        var remove = object.splice(index, 1);
            	        console.log(object);
            	    }
            	})
            	var stringNewArray = JSON.stringify(object);
            	fs.writeFile('./messages.json', stringNewArray, function(err){
            		console.log("Should be deleted")
            	})
            }
        })


    })
})





server.listen(2000, function() {
    console.log("Running and Listening " + port)
})
