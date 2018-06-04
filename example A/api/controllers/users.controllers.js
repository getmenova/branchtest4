var mongoose = require('mongoose');
var User = mongoose.model('User');
var Stock = mongoose.model('Stock');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

module.exports.register = function(req,res){
    console.log('registering user');
    
    var username = req.body.username;
    var name = req.body.name || null;
    var password = req.body.password;
    
    User.create({
        username: username,
        name: name,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    }, function(err, user){
        if (err){
            console.log(err);
            res
                .status(400)
                .json(err)
        }else{
            console.log('user has been created', user)
            res
                .status(201)
                .json(user)
        }
    });
};

module.exports.login = function (req,res){
  console.log('logging in user');
  var username = req.body.username;
  var password = req.body.password;
  
  User.findOne({
      username: username
  }).exec(function(err, user){
      if (err){
        console.log(err);
        res
            .status(400)
            .json(err);
      }else{
        if (bcrypt.compareSync(password, user.password)){
            console.log('User found', user);
            var token = jwt.sign( { username: user.username }, 's3cr3t', { expiresIn: 3600});
            res
                .status(200)
                .json({success: true, token: token}); 
        }else{
            res
                .status(401)
                .json('Unauthorized');
        }

      }
  });
    
};

module.exports.authenticate = function (req,res,next){
    var headerExists = req.headers.authorization;
    if (headerExists){
        var token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, 's3cr3t', function (error, decoded){
            if(error){
                console.log(error);
                res
                    .status(401)
                    .json('Unauthorized');
            }else{
                req.user = decoded.username;
                next();
            }
        });
    } else{
        res
            .status(403)
            .json('No token provided');
    }
};

module.exports.retrieve = function(req,res){
    var username = req.params.user;
    User.find({
      username: username
    })
    .select("-password")
    .exec(function(err, user){
      if (err){
        console.log(err);
        res
            .status(400)
            .json(err);
      }else{
          res
                .status(200)
                .json(user); 
        }
  });
}

var _addUserQuery = function(req,res, user){
   
    user.searches.push({
        symbol: req.body.symbol
    });
    
    user.save(function(err, userUpdated){
        if (err){
            res
                .status(500)
                .json(err);
        }else{
            res
                .status(201)
                .json(userUpdated.searches[userUpdated.searches.length -1]);
        };
            
    });
};


module.exports.usersQueryAddOne = function (req,res){
    var username = req.params.user;

    User   
        .findOne({username:username})
        .select ('-password')
        .exec(function(err, doc){
            if (err){
                console.log("error finding user")
                res
                    .status(500)
                    .json(err);
            }else if(!doc){
                console.log("user " + username + " not found in database")
                res
                    .status(404)
                    .json({
                        "message": "user  " + username + " not found"
                    });
            }if (doc){
                console.log('found user for username ' + username + " it is " + doc) 
                _addUserQuery(req,res,doc)
            }
    });
};

var _addUserStock = function(req,res, user){
   
    user.savedStocks.push({
        symbol: req.body.symbol
    });
    
    user.save(function(err, userUpdated){
        if (err){
            res
                .status(500)
                .json(err);
        }else{
            res
                .status(201)
                .json(userUpdated.searches[userUpdated.savedStocks.length -1]);
        };
            
    });
};

//Trying to add validation to prevent saving stock if it is already saved

    // var _addUserStock = function(req,res, user){
    //  if   ({'user.savedStocks.symbol' : req.body.symbol}){
            
    //             console.log('already saved' + req.body.symbol)
    //             res
    //                 .json('Already Saved!',null);
    //         }else{
    //         console.log('saving '+ req.body.symbol)
    //         user.savedStocks.push({
    //         symbol: req.body.symbol
    //     });
        
    //     user.save(function(err, userUpdated){
    //         if (err){
    //             res
    //                 .status(500)
    //                 .json(err);
    //         }else{
    //             res
    //                 .status(201)
    //                 .json(userUpdated.searches[userUpdated.savedStocks.length -1]);
    //         };
                
    //     });
    // };
                  
    //     };
    

    // var _addUserStock = function(req,res, user){
    //     user
    //         .find({'savedStocks.symbol' : req.body.symbol}, function (err, docs) {
    //         if (docs){
    //             console.log('already saved' + req.body.symbol)
    //             res
    //                 .json('Already Saved!',null);
    //         }else{
    //             console.log('saving '+ req.body.symbol)
    //         user.savedStocks.push({
    //         symbol: req.body.symbol
    //     });
        
    //     user.save(function(err, userUpdated){
    //         if (err){
    //             res
    //                 .status(500)
    //                 .json(err);
    //         }else{
    //             res
    //                 .status(201)
    //                 .json(userUpdated.searches[userUpdated.savedStocks.length -1]);
    //         };
                
    //     });
    // };
                  
    //     });
    // }

module.exports.usersSaveStock = function (req,res){
    var username = req.params.user;

    User   
        .findOne({username:username})
        .select ('-password')
        .exec(function(err, doc){
            if (err){
                console.log("error finding user")
                res
                    .status(500)
                    .json(err);
            }else if(!doc){
                console.log("user " + username + " not found in database")
                res
                    .status(404)
                    .json({
                        "message": "user  " + username + " not found"
                    });
            }if (doc){
                console.log('found user for username ' + username + " it is " + doc) 
                _addUserStock(req,res,doc)
            }
    });
};



var _addUserArticle = function(req,res, user){
   
    user.savedArticles.push({
        title: req.body.title,
        url: req.body.url,
        articleSource: req.body.articleSource
        
    });
    
    user.save(function(err, userUpdated){
        if (err){
            res
                .status(500)
                .json(err);
        }else{
            res
                .status(201)
                .json(userUpdated.savedArticles[userUpdated.savedArticles.length -1]);
        };
            
    });
};

module.exports.usersSaveArticle = function (req,res){
    var username = req.params.user;

    User   
        .findOne({username:username})
        .select ('-password')
        .exec(function(err, doc){
            if (err){
                console.log("error finding user")
                res
                    .status(500)
                    .json(err);
            }else if(!doc){
                console.log("user " + username + " not found in database")
                res
                    .status(404)
                    .json({
                        "message": "user  " + username + " not found"
                    });
            }if (doc){
                console.log('found user for username ' + username + " it is " + doc) 
                _addUserArticle(req,res,doc)
            }
    });
};
