angular.module('meannasdaq').controller('ProfileController', ProfileController);

function ProfileController($route,$routeParams, $window, stockDataFactory, AuthFactory, jwtHelper){
    var vm = this;
    var token = $window.sessionStorage.token;
    var decodedToken = jwtHelper.decodeToken(token);
    var User = decodedToken.username;
    stockDataFactory.getUser(User).then(function(response) {
        if(!response){
            vm.error = "Cannot find user";
        }else{
            vm.loggedUser = response.data;
            console.log(vm.loggedUser);
            console.log(vm.loggedUser[0].username);
            }
            }).catch(function(error){
                console.log(error);
            });;}