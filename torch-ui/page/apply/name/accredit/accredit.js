angular.module('app', ['common','ngRoute'])
.config(config)
	function config($routeProvider) {
		$routeProvider.when('/brand', {
			templateUrl : 'accredit-brand-tpl.html',
			controller:'brandController'
		}).when('/invest', {
			templateUrl : 'accredit-invest-tpl.html',
			controller:'investController'
		}).otherwise({
			redirectTo : '/brand'
		});
	}

//accredit.html页面的控制器
(function(){
	angular.module('app').controller('SetupController',SetupController);
	
	SetupController.$inject = ['$scope','dataService','$location','$routeParams'];
	
	function SetupController($scope,dataService,$location,$routeParams){
		var vm = this;

		//页面的跳转 没有gid时不让跳转
		$scope.url = function(data){
			$location.path('/'+data);
		}

		//判断tab样式
		$scope.navCss = function(){
			if( window.location.href.indexOf('/brand') > 0 ){
				$scope.brand = true;
				$scope.invest = '';
				$scope.supply = '';
			}else if( window.location.href.indexOf('/invest') > 0 ){
				$scope.brand = '';
				$scope.invest = true;
				$scope.supply = '';
			}
		}
		$scope.navCss();

		//加载完view后的回调
		vm.loadView = loadView;

		function loadView(){
			$scope.navCss();
		}
	}
	
})();

//字號/投資授權
(function(){
angular.module('app').controller("investController",investController);
//注入依赖
investController.$inject = ['$scope','dataService'];

function investController(dataService){
	var vm=this;
	//保存
	vm.investSave=investSave;
	//保存页面
	function investSave(){
		Torch.validateForm('brand')
		.then(function(){
			Torch.closewin(vm.invest);
		});
	}
}
})();

//商標授權控制器
(function(){
	angular.module('app').controller("brandController",brandController);
	//注入依赖
	brandController.$inject = ['$scope','dataService','$rootScope'];
	
	function brandController(dataService,$rootScope){
		var vm=this;
		//保存
		vm.brandSave = brandSave;
		vm.selectCerType = selectCerType
		
		function selectCerType(certype){
        	if(certype == '10'){
        		$('#cerno').attr('rule', 'must;idcard');
        	}else{
        		$('#cerno').attr('rule', 'must');
        	}
		}
		
		//保存页面
		function brandSave(){
			Torch.validateForm('brand')
			.then(function(){
				//添加商标的授权类型
				vm.brand.accreditetype = '2';
				Torch.closewin(vm.brand);
			});
			
		}
	}
})();
