/* global angular*/

angular.module('meannasdaq', ['ngRoute', 'angular-jwt', 'angularUtils.directives.dirPagination'])
    .config(config)
    .run(run);

function config ($httpProvider, $routeProvider){
    $httpProvider.interceptors.push('AuthInterceptor');
    
    $routeProvider
    .when ('/', {
        templateUrl: 'angular-app/main/main.html',
        controller: SearchController,
        controllerAs: 'vm',
        access:{
            restricted: false
        }
    })
    .when('/stocks',{
        templateUrl: 'angular-app/stock-list/stocks.html',
        controller: StocksController,
        controllerAs: 'vm',
        access:{
            restricted: false
        }
    })
    
    .when('/trending',{
        templateUrl: 'angular-app/stocks-trending/trending.html',
        controller: TrendingStocksController,
        controllerAs: 'vm',
        access:{
            restricted: false
        }
    })
    
    .when('/stocks/:Symbol', { 
        templateUrl: 'angular-app/stock-display/stock.html',
        controller: StockController,
        controllerAs: 'vm',
        access:{
            restricted: false
        }
    })
    
    .when('/register',{
        templateUrl: 'angular-app/register/register.html',
        controller: RegisterController,
        controllerAs: 'vm',
        access:{
            restricted: false
        }
    })
    
    .when('/profile', {
        templateUrl: 'angular-app/profile/profile.html',
        controller: ProfileController,
        controllerAs: 'vm',
        access:{
            restricted: true
        }
    })

    .otherwise({
        redirectTo: '/'
    });
}


function run($rootScope, $location, $window, AuthFactory){
    $rootScope.$on('$routeChangeStart', function (event, nextRoute, currentRoute){
        if(nextRoute.access !== undefined && nextRoute.access.restricted && !$window.sessionStorage.token && !AuthFactory.isLoggedIn){
            event.preventDefault();
            $location.path('/');
        }
    })
}
