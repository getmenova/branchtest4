angular.module('meannasdaq').controller('TrendingStocksController', TrendingStocksController);

function TrendingStocksController(stockDataFactory){
    var vm = this;
    vm.title = 'Trending Stocks By:';
    vm.saleSubmitted = false;
    vm.marketSubmitted=false;
    vm.querySubmitted = false

    vm.trending = function(selection){
    stockDataFactory.stockTrending(selection).then(function(response){
        vm.stocks = response.data;
        console.log(response.data)
    });
}

    vm.salePrice = function(){
        vm.marketSubmitted=false;
        vm.querySubmitted = false;
        vm.saleSubmitted = true;
        
    }
    
    vm.marketCap = function(){
        vm.saleSubmitted = false;
        vm.querySubmitted = false
        vm.marketSubmitted=true;

    }
    
    vm.query = function(){
        vm.saleSubmitted = false;
        vm.querySubmitted = true;
        vm.marketSubmitted=false;
    }

}
