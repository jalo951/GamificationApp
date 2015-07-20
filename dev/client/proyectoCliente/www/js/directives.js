/**
 * Created by Sandeep on 29/08/14.
 */
angular.module('login.directives',[]).directive('browseFile',['$rootScope',function($rootScope){
    return {
        scope:{

        },
        replace:true,
        restrict:'AE',
        link:function(scope,elem,attrs){

            scope.browseFile=function(){
                document.getElementById('browseBtn').click();
            }

            angular.element(document.getElementById('browseBtn')).on('change',function(e){

               var file=e.target.files[0];

               angular.element(document.getElementById('browseBtn')).val('');

               var fileReader=new FileReader();

               fileReader.onload=function(event){
                   $rootScope.$broadcast('event:file:selected',{image:event.target.result});
               }

               fileReader.readAsDataURL(file);
            });

        },
        templateUrl:'templates/browse-file.html'
    }
}]);