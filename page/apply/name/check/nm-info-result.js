(function(){
	angular.module('app', ['common'])
	.controller("resultController",resultController);
	//注入依赖
	 nmController.$inject = ['$scope','dataService','$timeout','$rootScope'];
	
	function nmController(dataService,$timeout,$rootScope){
		var vm=this;
		//禁用字
	}
})();
