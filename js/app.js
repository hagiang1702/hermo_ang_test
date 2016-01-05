//
/*
	install ext :  Allow-Control-Allow-Origin: *
	
	https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi/related
	
	OR
	Server 
	.htaccess
		Header always set Access-Control-Allow-Origin "*"
		Header always set Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Access-Control-Allow-Origin"
		Header always set Access-Control-Allow-Methods "PUT, GET, POST, DELETE, OPTIONS"
*/

angular.module('filters', []).
    filter('truncate', function () {
        return function (text, length, end) {
            if (isNaN(length))
                length = 10;

            if (end === undefined)
                end = "...";

            if (text.length <= length || text.length - end.length <= length) {
                return text;
            }
            else {
                return String(text).substring(0, length-end.length) + end;
            }

        };
    });

//angular.module('hermoApp', ['angular-carousel']);
var nameApp = angular.module('hermoApp',['ngResource','filters']);//'ngRoute'

nameApp.run(function($http){
		
	$http.get(url_banner).success(function(data) {
			//$scope.test = true;
			console.log(0);			
			
		});	
});

/*
nameApp.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('httpResponseInterceptor');
    $httpProvider.interceptors.push('httpTimeStampMarker');
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    delete $httpProvider.defaults.headers.common['Content-Type, X-Requested-With'];
	
}]);
*/


var url_banner  = 'http://www.hermo.my/test/api.html?list=banner';
var url_products  = 'http://www.hermo.my/test/api.html';

//index.html
nameApp.controller('productsCtrl',["$scope","$http","$resource",function( scope, http,resource ){
	scope.orderBy = 'selling_price';
	$params = { list:"best-selling" };
	
	/* use resource */
	
	/*
	resource( url_products,$params,{},{}).get().$promise.then(function(data){
		scope.products = data.items;
	});
	*/
	
	
	
	/* use http */
	http.get(url_products,{params:$params}).success(function(data) {
		scope.products = data.items;
	});
	
	$data = {sortSelected:'selling_price'};
	scope.data = $data;
	scope.changeSort = function( value ){
		//console.log(scope.products);
		scope.orderBy = value;
	}

	
}]);

nameApp.controller('bannerCtrl',function( $scope, $http ){	
	$scope.getText = function(obj){
		alert(obj);
		return $scope.addText.replace("{0}", obj).replace('"', '');
	};
	
	//$scope.data = 'selling_price_ASC';
	
	$http.get(url_banner).then(function(data) {
		var images = data.data.items;
		$scope.images = data.data.items;		
		angular.forEach(images,function(v,k){
			v.image =  v.image.replace("\"","");
		});
		
	});	
	
	
		 
});

nameApp.directive('slideit',function($http,$timeout) {
	
    return {
       restrict: 'A',
       replace: true,
       scope: {
         slideit: '=' 
       },
       template: '<ul class="bxslider">' +
                   '<li ng-repeat="slide in slides">' +
                     '<img ng-src="{{slide.image}}" alt="" />' +
                   '</li>' +
                  '</ul>',			  
       link: function(scope, elm, attrs) {
		   scope.flag=false;
		   $http.get(url_banner).then(function(data) {
				//scope.images = data.data.items;
				scope.slides = scope.slideit;					
				 $timeout(function() {
					elm.bxSlider({
						infiniteLoop: false,
						touchEnabled:false,
						preventDefaultSwipeY:true,
						hideControlOnEnd: true
					}); 
				}, 1);
			});	
       }
    }; 
});


