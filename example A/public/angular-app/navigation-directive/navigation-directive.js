angular.module('meannasdaq').directive('mnNavigation', mnNavigation);

function mnNavigation(){
    return{
        restrict: 'E',
        templateUrl: 'angular-app/navigation-directive/navigation-directive.html'
    };
}