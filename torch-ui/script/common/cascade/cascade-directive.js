/**
 * @desc 级联的指令
 * @property data Array 级联加载的数据
 * @property city String 如果是省市县的级联可以使用city属性，不用设置data
 * @property cascade-rule 校验规则
 * @property one String 一级级联的值
 * @property two String 二级级联的值
 * @property three Sting 三级级联的值，如果没有三级级联可不写
 * @example <cascade city cascade-rule="must" one="vm.memQueryList.domprov" two="vm.memQueryList.domcity"></cascade>
 * @example <cascade city one="vm.memQueryList.domprov" two="vm.memQueryList.domcity" three="vm.memQueryList.domcounty"></cascade>
 * @example <cascade data="vm.data" one="vm.memQueryList.domprov" two="vm.memQueryList.domcity" three="vm.memQueryList.domcounty"></cascade>
 *[
 *  {
 *   text:'',
 *   value:'',
 *   child:[
 *   	text:'',
 *   	value: ''
 *   ]
 *  }
 *]
 */
angular.module('common.cascade').directive('cascade', function(){
	return{
		restrict: 'EA',
		scope: {
			data: '=',
			one: '=',
			two: '=',
			three: '=',
			city: '@',
			cascadeRule: '@'
		},
		template: function(element, attrs){
			if(!!attrs.three){
				var col = "col-sm-4";
			}else{
				var col = "col-sm-6";
			}
			var tpl = '';
			if(!!attrs.one){
				tpl += '<div class="' + col + ' no-horizontal-padding"><select class="form-control" ng-model="one" ng-change="setTwoData(one)" rule="{{cascadeRule}}"><option ng-repeat="item in onedata" ng-bind="item.text" value="{{item.value}}"></option></select></div>';
			}
			if(!!attrs.two){
				tpl += '<div class="' + col + '"><select class="form-control" ng-model="two" ng-change="setThreeData(two)" rule="{{cascadeRule}}"><option ng-repeat="item in twodata" ng-bind="item.text" value="{{item.value}}"></option></select></div>';
			}
			if(!!attrs.three){
				tpl += '<div class="' + col + ' no-horizontal-padding"><select class="form-control" ng-model="three" rule="{{cascadeRule}}"><option ng-repeat="item in threedata" ng-bind="item.text" value="{{item.value}}"></option></select></div>';
			}
			return tpl;
		},
		controller: function($scope, $element, $attrs){
		},
		link: function(scope, element, attrs){
			
			//得到级联第一级的数据
			scope.getOneData = getOneData;
			
			//得到级联第二级的数据
			scope.getTwoData = getTwoData;
			
			//得到级联第三级的数据
			scope.getThreeData = getThreeData;
			
			scope.setTwoData = setTwoData;
			
			scope.setThreeData = setThreeData;
			
			scope.$watch('one', function(newVal, oldVal, scope){
				scope.twodata = scope.getTwoData(newVal);
			});
			if(attrs.three){
				scope.$watch('two', function(newVal, oldVal, scope){
					scope.threedata = scope.getThreeData(newVal);
				});
			}
			
			
			if(typeof attrs.city != 'undefined'){
				scope.onedata = Torch.city.getAll();
				scope.twodata = scope.getTwoData(scope.one);
				if(attrs.three){
					scope.threedata = scope.getThreeData(scope.two);
				}
			}
			
			if(typeof attrs.data != 'undefined'){
				scope.$watch('data', function(newVal, oldVal, scope){
					scope.onedata = scope.getOneData(newVal);
					scope.twodata = scope.getTwoData(scope.one);
					if(attrs.three){
						scope.threedata = scope.getThreeData(scope.two);
					}
				});
			}
			
			function getOneData(data){
				return data || [];
			}
			
			function getTwoData(data){
				var onedata = scope.onedata;
				if(!data){
					return [];
				}
				if(data == ''){
					return [];
				}
				if(onedata){
					for(var i = 0, len = onedata.length; i < len; i++){
						var item = onedata[i];
						if(item.value && item.value == data){
							return item.child || [];
						}
					}
				}
				return [];
			}
			
			function getThreeData(data){
				var twodata = scope.twodata;
				if(!data){
					return [];
				}
				if(data == ''){
					return [];
				}
				if(twodata){
					for(var i = 0, len = twodata.length; i < len; i++){
						var item = twodata[i];
						if(item.value && item.value == data){
							return item.child || [];
						}
					}
				}
				return [];
			}
			
			function setTwoData(data){
				scope.two = '';
				if(attrs.three){
					scope.three = '';
				}
			}

			function setThreeData(data){
				if(attrs.three){
					scope.three = '';
				}
			}
		}
	}
});