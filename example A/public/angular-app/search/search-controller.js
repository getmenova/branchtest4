    angular.module('meannasdaq').controller('SearchController', SearchController);
    
    function SearchController($http, stockDataFactory, $route,$routeParams, $window, AuthFactory, jwtHelper, $timeout ) { 
        var vm = this;
        
        $.ajax({
		method: "GET",
		url: "https://newsapi.org/v2/top-headlines",
		data: {
			category: "business",
			//sources: "bloomberg,business-insider,financial-times,fortune,financial-post,the-wall-street-journal,australian-financial-review",
			country: "us",
			//sortBy: 'relevance',
			pageSize: 10,
			apiKey: APIKEY //APIKEY from newsapi.org - in /angular-app/stock-display/key.js
		},
		success: function(data) {
		    console.log(data)
		      $timeout (function(){
		          if (data.status === "ok") {
			    vm.articles = data.articles;

			if(data.articles.length>0){
			    vm.foundArticles = true;
			}  else{
			    vm.noArticles = true;
			}
		      }
		      })     
		}
	});
        
        vm.isLoggedIn = function(){
        if (AuthFactory.isLoggedIn){
        return true;
        }else{
        return false;
        }
    };
        
        vm.search = function(){
            vm.isSubmitted = false;
            var symbol = vm.symbol.toUpperCase();
            
            var postUserQuery ={
              symbol: vm.symbol.toUpperCase() 
            }
            
            stockDataFactory.stockDisplay(symbol).then(function(response) {
            console.log(response);
            if(!response){
                vm.error = "Cannot find stock";
            }else{
            vm.stock = response.data;
            var postData = "";
            stockDataFactory.postQuery(symbol, postData).then(function(response){
            }).catch(function(error){
                console.log(error);
            });
            if (vm.showQueriesSubmitted){
                vm.showQueries()
            }
            if(vm.isLoggedIn()){
                var token = $window.sessionStorage.token;
                var decodedToken = jwtHelper.decodeToken(token);
                var User = decodedToken.username;
                stockDataFactory.postUserQuery(User, postUserQuery).then(function(response){
                }).catch(function(error){
                console.log(error)
            }
            )}
            vm.isSubmitted = true;
            }
            });
        }
        
        vm.showQueries = function(){
            vm.showQueriesSubmitted = false;
            stockDataFactory.displayQueries().then(function(response){
                if (!response){
                    vm.error = "Cannot find queries";
                    vm.showQueriesSubmitted = true;
                   } else{
                        vm.stocks = response.data
                        console.log(vm.stocks);
                    }
            }).catch(function(error){
                console.log(error);
            });
            vm.showQueriesSubmitted = true;
        }
   
    vm.tweetIt = function(articlePreview, articleUrl){
		window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(articlePreview + " " + articleUrl));
							
    }
  
   vm.saveArticle = function( articleTitle, articleUrl, articleSource){
        var token = $window.sessionStorage.token;
        var decodedToken = jwtHelper.decodeToken(token);
        var User = decodedToken.username;
        var postUserArticle = {
          title: articleTitle,
          url: articleUrl,
          articleSource: articleSource
        }
        
      stockDataFactory.saveUserArticle(User, postUserArticle).then(function(response){
                }).catch(function(error){
                console.log(error)
            })
    }
    
    };
    
