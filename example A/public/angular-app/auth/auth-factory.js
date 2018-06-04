angular.module('meannasdaq').factory('AuthFactory', AuthFactory);

function AuthFactory() {
    
    return {
        auth: auth
    };
    
    var auth = {
        isLoggedIn: false
    };
}