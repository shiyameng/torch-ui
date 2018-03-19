/**
 * @desc 树组件
 * @property data Object 查询条件的值 格式：{'code':'字符串或者以“,”隔开的字符串'}
 * @property source Object 查询条件的数据来源
 * [{
		'code': 'aaaaa',//查询类别的编码
		'text': '查询类别',
		'child': [
		          	{
		          		'value': '查询条件的值',
		          		'text': '查询条件'
		          	}
		          ]
	}]
 * @property type String 一种查询条件间多选或单选（多选 check，默认单选 select）
 * @property theme String 主题样式
 * @property template String 模板样式
 * @example <terms source='vm.termSource' data="vm.termData"></terms>
 * @example <terms source='vm.termSource' data="vm.termData" template="vm.template"></terms> 请不要轻易尝试template属性
 */
angular.module('common.terms').directive('terms', function($compile){
	var TERM_TPL = '';
	var getTermsTPL = function(){
		return '\
				<div class="list-group terms">\
					<div ng-repeat="terms in source" class="list-group-item">\
						<div class="terms-type-text">\
							<span class="terms-type-text-content" ng-bind="terms.text"></span>\
						</div>\
						<div class="terms-type-content">\
							<ul class="clearfix">\
								<li ng-repeat="term in terms.child">\
									'+TERM_TPL+'\
								</li>\
							</ul>\
						</div>\
					</div>\
				<div>\
			  ';
	}
	
	return {
		restrict: 'E',
		scope: {
			data: '=',
			source: '=',
			type: '@',
			theme: '@',
			template: '='
		},
		template: function(element, attrs){
			
			return renderTerms();
			
			//渲染单选的查询条件
			function renderSelectTerms(){
				var tpl = '\
							<span class="term-content" ng-class="{\'active\':term.active}" ng-click="selectTerm(term, terms)">\
								<span ng-bind="term.text"></span>\
							</span>\
							';
				return tpl;
			}
			//渲染多选的查询条件
			function renderCheckTerms(){
				var tpl = '';
				return tpl;
			}
			//渲染查询条件
			function renderTerms(){
				TERM_TPL = renderSelectTerms();
				if(attrs.type && attrs.type == 'check'){
					TERM_TPL = renderCheckTerms();
				}
				if(attrs.template){
					TERM_TPL = '';
				}
				return getTermsTPL();
			}
			
		},
		controller: function($scope, $element){
			//单选选中查询条件
			$scope.selectTerm = selectTerm;
			
			function selectTerm(term, terms){
				if(term && terms && terms.child){
					if($scope.type && $scope.type == 'check'){
						term.active = !term.active;
						//得到多选的查询条件
						$scope.data = $scope.data || {};
						$scope.data[terms.code] = getCheckData(terms);
						
					}else{
						for(var i = 0,len = terms.child.length; i < len; i++){
							terms.child[i].active = false;
						}
						term.active = !term.active;
						//得到单选的查询条件
						$scope.data = $scope.data || {};
						$scope.data[terms.code] = getSelectData(terms);
					}
				}
			}
			
			//得到单选的查询条件
			function getSelectData(terms){
				if(terms && terms.child && Array.isArray(terms.child)){
					var termVal = ''
					for(var i = 0, len = terms.child.length; i < len; i++){
						var term = terms.child[i];
						if(!!term.active){
							termVal = term.value;
							break;
						}
					}
					return termVal;
				}else{
					return '';
				}
			}
			
			//得到多选的查询条件
			function getCheckData(terms){
				if(terms && terms.child && Array.isArray(terms.child)){
					var termValList = []
					for(var i = 0, len = terms.child.length; i < len; i++){
						var term = terms.child[i];
						if(!!term.active){
							termValList.push(term.value);
						}
					}
					return termValList.join(',');
				}else{
					return '';
				}
			}
		},
		link: function(scope, ele, attrs){
			//如果有templete属性 重新构建DOM元素
			if(scope.template && typeof(scope.template) == 'string'){
				TERM_TPL = scope.template;
				var term = $compile(getTermsTPL())(scope);
				ele.html(term);
			}
		}	
	}
});

