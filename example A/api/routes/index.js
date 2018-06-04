var express = require('express');
var router = express.Router();


var ctrlStocks = require('../controllers/stocks.controllers.js');
var ctrlUsers = require('../controllers/users.controllers.js');
var ctrlQueries = require('..//controllers/queries.controllers.js');


router
    .route('/stocks')
    .get(ctrlStocks.stocksGetAll)
    
router
    .route('/stocks/:symbol')
    .get(ctrlStocks.stocksFind)
    
router
    .route('/trending/:selection')
    .get(ctrlStocks.stocksGetTrending)
    
router
    .route('/users/register')
    .post(ctrlUsers.register);

router
    .route('/users/login')
    .post(ctrlUsers.login)

router
    .route('/users/:user')
    .get(ctrlUsers.retrieve);
    
router
    .route('/stocks/:symbol/queries')
    .post(ctrlQueries.queriesAddOne);
    
router
    .route('/users/:user/searches')
    .post(ctrlUsers.usersQueryAddOne);
    
router
    .route('/queries')
    .get(ctrlQueries.queriesGetAll);
    
router
    .route('/users/:user/save')
    .post(ctrlUsers.usersSaveStock);

router
    .route('/users/:user/articles')
    .post(ctrlUsers.usersSaveArticle);

module.exports = router;