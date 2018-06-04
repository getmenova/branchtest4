var mongoose = require ('mongoose');
var stockSchema = mongoose.model('Stock');

var articlesSchema = new mongoose.Schema({
   createdOn: {
       type: Date,
       "default": Date.now
   },
   title: String,
   url: String,
   articleSource: String
});

var searchesSchema = new mongoose.Schema({
    createdOn: {
        type: Date,
        "default": Date.now
    },
    symbol: String
});


var savedStocksSchema = new mongoose.Schema({
    createdOn: {
        type: Date,
        "default": Date.now
    },
    symbol: { type: String, unique: true }
})

var userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    
    searches: [searchesSchema],
    
    savedStocks: [savedStocksSchema],
    
    savedArticles: [articlesSchema]
    
});

mongoose.model('User', userSchema, 'users');