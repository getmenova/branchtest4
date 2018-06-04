var mongoose = require ('mongoose');
var dburl = 'mongodb://' + process.env.IP + ':27017/meannasdaq';

mongoose.connect(dburl);

mongoose.connection.on('connected', function(){
    console.log('Mongoose connected to ' + dburl);
});

mongoose.connection.on('disconnected', function(){
    console.log('Mongoose disconnected');
});

mongoose.connection.on('error', function(err){
    console.log('Mongoose connection erro ' + err);
});

process.on('SIGINT', function(){
    mongoose.connection.close(function(){
        console.log("Mogoose disconnected through app termination (SIGINT)");
        process.exit(0);
    });
});

process.on('SIGTERM', function(){
    mongoose.connection.close(function(){
        console.log("Mogoose disconnected through app termination (SIGTERM)");
        process.exit(0);
    });
});

process.once('SIGUSR2', function(){
    mongoose.connection.close(function(){
        console.log("Mogoose disconnected through app termination (SIGUSR2)");
        process.kill(process.pid, 'SIGUSR2');
    });
});

//Bring in Schemas and Models

    require('./stocks.models.js');
    require('./users.model');