var mongoose = require('mongoose');

var querySchema = new mongoose.Schema({
    createdOn: {
        type: Date,
        "default": Date.now
    }
});

var stockSchema = new mongoose.Schema({
    Symbol: String,
    Name: String,
    LastSale: Number,
    MarketCap: Number,
    ADRTSO: String,
    IPOYear: Number,
    Sector: String,
    Industry: String,
    SummaryQuote: String,
    Queries: [querySchema]
});

mongoose.model('Stock', stockSchema, 'stocks');
// (Modelname, schemaName, collection);