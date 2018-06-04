var mongoose = require ('mongoose');
var Stock = mongoose.model('Stock');

module.exports.stocksGetAll = function (req, res){
    var offset = 6;
    var count = 10;
    var maxCount = 50;
  
    if (req.query && req.query.offset){
      offset = parseInt(req.query.offset, 10);
    };
  
    if (req.query && req.query.count){
      count = parseInt(req.query.count, 10);
    };

    if (isNaN(offset) || isNaN(count)){
        res
            .status(400)
            .json({
                "message" : "If supplied in querystring count and offset should be numbers"
            });
        return;
    };
    
    if (count > maxCount){
        res
            .status(400)
            .json({
                "message": "Count limit of " + maxCount + " exceeded" 
            });
        return;
    };

    Stock
        .find()
        .exists("LastSale", true)
        .sort("Name")
        .exec(function(err, stocks){
            if (err){
                console.log("Error finding stocks");
                res
                    .status(500)
                    .json(err);
            }else{
            console.log("Found stocks", stocks.length);
            res
                .json(stocks);
            }
    });

};

module.exports.stocksFind = function (req,res){
    var stockSymbol = req.params.symbol;
   console.log("Stock symbol is: " + stockSymbol);
    Stock
    .findOne({ Symbol: stockSymbol })
    .exec(function(err, stock) {
    console.log('found stock: ' + stock);
    var response = {
            status: 200,
            message: stock,
        };
        if (err){
                console.log("Error finding stock");
                response.status=500;
                response.message = err;
            }else if(!stock){
                response.status=404;
                response.message={
                        "message": "Stock Symbol not found"
                    };
            }
            res
                .status(response.status)
                .json(response.message);
  });
}

module.exports.stocksUpdateOne = function (req, res){
    var stockSymbol = req.params.symbol;
    console.log("GET stockSymbol", stockSymbol);
    
    Stock
        .findOne({ Symbol: stockSymbol })
        .exec(function(err, doc){
            var response = {
                status: 200,
                message: doc
            };
            if (err){
                    console.log("Error finding stock");
                    response.status=500;
                    response.message = err;
                }else if(!doc){
                    response.status=404;
                    response.message={
                            "message": "Stock not found"
                        };
                }
                if(response.status != 200){
                    res
                        .status(response.status)
                        .json(response.message);
                }
                    
                doc.save(function(err, stockUpdated){
                    if(err){
                        res
                            .status(500)
                            .json(err);
                    }else{
                        res
                            .status(204)
                            .json();
                    }
                });
                    
                
            });
};

module.exports.stocksGetTrending = function (req, res){
    var sorter = req.params.selection
    var count =10;
    Stock
        .find()
        .limit(count)
        .sort("-"+sorter)
        .exec(function(err, stocks){
            if (err){
                console.log("Error finding stocks");
                res
                    .status(500)
                    .json(err);
            }else{
            console.log("Found stocks", stocks.length);
            res
                .json(stocks);
            }
    });
}