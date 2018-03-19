/**
 * @desc 表单中的时间的输入框
 * @property name String 表单的name
 * @property date String 时间输入框的值 格式：yyyy-MM-dd
 * @property change Function 时间输入框值变化后的触发方法
 * @example <form-date name="begintime" date="vm.nmQueryForm.begintime" date-rule="must"></form-date>
 */
angular.module('common.form').directive('formDate', function($filter){
	return {
		restrict: 'E',
		scope: {
			name: '@',
			date: '=',
			change: '&',
			dateRule: '@',
			size: '@'
		},
		template: function(element, attrs){
			var sizeClass = '';
			if(attrs.size == 'lg'){
				sizeClass = ' input-group-lg';
			}
			if(attrs.size == 'sm'){
				sizeClass = ' input-group-sm';
			}
			var tpl ='\
							<div class="input-group'+sizeClass+'">\
							<input type="text" uib-datepicker-popup="yyyy-MM-dd" class="form-control" rule={{dateRule}}\
					        ng-model="picker" name={{name}} is-open="datepicker.isOpen" popup-placement="auto bottom-left" \
						    uib-datepicker-popup datepicker-options="datepicker.Options" show-button-bar="false" ng-change="change(date)" ng-click="openDate()" >\
							<div class="input-group-addon"> \
								<span class="glyphicon glyphicon-calendar" ng-click="openDate()"></span> \
							</div> \
						</div> \
					';
			return tpl;
		},
		controller: function($scope, $filter){
			$scope.datepicker = {
				Options : {
						formatMonth: 'MM',
			    		formatDayTitle: 'yyyy-MM',
			    		showWeeks: false
				},
				isOpen: false
			};
			$scope.openDate = function(){
				$scope.datepicker.isOpen = true;
			};
			$scope.picker = function(){
				if($scope.date && typeof($scope.date) == 'string'){
					var item = $scope.date.split(/-|\s/);
					if(item && item.length >= 3){
						return new Date(item[0],item[1] - 1,item[2]);
					}
				}else{
					return '';
				}
			}();
		},
		link: function(scope, ele, attrs){
			scope.$watch('picker', function(newVal, oldVal, scope){
				scope.date = $filter('date')(newVal, 'yyyy-MM-dd');
			});
			scope.$watch('date', function(newVal, oldVal, scope){
				if(typeof(newVal) == 'string'){
					if(newVal == ''){
						scope.picker = '';
					}else{
						var item = newVal.split(/-|\s/);
						if(item && item.length >= 3){
							scope.picker = new Date(item[0], item[1] - 1, item[2]);
						}
					}
				}
				if(typeof(newVal) == 'undefined'){
					scope.picker = '';
				}
			});
		}
				
	}
});

/**
 * @desc 表单中的树的输入框
 * @property name String 表单的name
 * @property data String 输入框的值 格式：以“,”隔开的字符串
 * @property tree Array 树的数据来源
 * [{"id":"110000","pid":"100000","name":"北京市","value":"110000"},
 * {"id":"110101","pid":"110000","name":"东城区","value":"110101"},
 * {"id":"110102","pid":"110000","name":"西城区","value":"110102"},
 * {"id":"110105","pid":"110000","name":"朝阳区","value":"110105"},
 * {"id":"110106","pid":"110000","name":"丰台区","value":"110106"},
 * {"id":"110107","pid":"110000","name":"石景山区","value":"110107"}]
 * @property type String 类型（默认多选 check，单选 select）
 * @property tree-cascade String 多选框级联类型，type必须为check （默认none：没有级联，child：子集级联，all：父子集均级联）
 * @property tree-rule String 规则校验
 * @property check function 点击单选触发方法 传参方式 {name：'',value:''}
 * @property expandAll  默认展开的属性 'all' 全部展开
 * @example <form-tree name="tree" expand-all='all' data="treeValue" tree="treeList" type="check" check='fun(name,value)'></form-tree>
 */
angular.module('common.form').directive('formTree', function(){
	return {
		restrict: 'E',
		scope: {
			name: '@',
			data: '=',
			tree: '=',
			type: '@',
			expandAll: '@',
			treeCascade: '@',
			treeRule: '@',
			check : '&'
		},
		template: '\
				<div>\
					<input type="text" class="form-control" readonly="true" rule="{{treeRule}}"\
			        ng-model="treeVal" name="{{name}}" ng-click="openTree()" >\
					<span class="glyphicon glyphicon-triangle-bottom form-tree-triangle"></span>\
					<ul id="{{name + \'tree\'}}" class="ztree form-tree" ng-class="{\'hide\':!isOpenTree}"></ul>\
				</div>\
			',
		controller: function($scope){
			//树的ID
			$scope.treeId = $scope.name + 'tree';
			//选中节点的方法
			$scope.selectNodes = selectNodes;
			//清空选中的节点
			$scope.cleanNodes = cleanNodes;
			//是否进行父子节点的勾选联动操作 
			$scope.checkTypeFlag = false;
			//显示树
			$scope.openTree = openTree;
			//是否显示树的标志
			$scope.isOpenTree = false;
			//树的配置
			$scope.setting = function(){
				if($scope.type == 'select'){
					var setting = {
						view: {
							dblClickExpand: false
						},
						data: {
							simpleData: {
								enable: true,
								idKey: "id",
								pIdKey: "pid",
								rootPId: 0
							}
						},
						callback: {
							onClick: nodeSelectOnClick
						}
					};
				}else{
					setting = {
							check: {
								enable: true,
								chkboxType: {"Y":"", "N":""}
							},
							view: {
								dblClickExpand: false
							},
							data: {
								simpleData: {
									enable: true,
									idKey: "id",
									pIdKey: "pid",
									rootPId: 0
								}
							},
							callback: {
								onCheck: nodeOnClick
							}
						};
					if($scope.treeCascade == 'child'){
						setting.check.chkboxType = {"Y":"s", "N":"s"};
					}
					if($scope.treeCascade == 'all'){
						setting.check.chkboxType = {"Y":"ps", "N":"ps"};
					}
				}
				return setting;
			}();
			//单选选中节点的方法
			function nodeSelectOnClick(event, treeId, treeNode) {
				var treeNodes = $.fn.zTree.getZTreeObj($scope.treeId);
				
				if(treeNodes){
					//getSelectedNodes获取节点值
					var selectNodes = treeNodes.getSelectedNodes(true);
					$scope.data = (selectNodes ? selectNodes.map(function(item, index){return item.value}) : []).join(',');
					$scope.$apply();
					
					//单选触发方法
					if($scope.check  && typeof($scope.check)=='function'){
						$scope.check({name:selectNodes[0].name,value:selectNodes[0].value});
					}
					//单选完 自动关闭树
					$scope.isOpenTree = false;
				}
			};
			//选中节点的方法
			function nodeOnClick(event, treeId, treeNode) {
				var treeNodes = $.fn.zTree.getZTreeObj($scope.treeId);
				if(treeNodes){
					var selectNodes = treeNodes.getCheckedNodes(true);
					$scope.data = (selectNodes ? selectNodes.map(function(item, index){return item.value}) : []).join(',');
					$scope.$apply();
				}
			};
			
			//显示树
			function openTree(){
				$scope.isOpenTree = true;
				$("body").on("mousedown", onBodyDown);
			}
			//隐藏树
			function hideTree() {
				$scope.isOpenTree = false;
				$scope.$apply();
				$("body").off("mousedown", onBodyDown);
			}
			function onBodyDown(event) {
				if ((($(event.target).parents("form-tree[name='"+$scope.name+"']")).length <= 0)) {
					hideTree();
				}
			}
			//选中节点的方法
			function selectNodes(nodeVals){
				var selectNodes = nodeVals ? nodeVals.split(',') : [];
				var tree = $.fn.zTree.getZTreeObj($scope.treeId);
				var selectName = [];
				if(tree){
					for(var i = 0, len = selectNodes.length; i < len; i++){
						var item = selectNodes[i];
						var treeNode = tree.getNodeByParam("value", item, null);
						if(treeNode){
							tree.checkNode(treeNode, true, $scope.checkTypeFlag);
							selectName.push(treeNode.name || '');
						}
					}
				}
				$scope.treeVal = selectName.join(',');
			}
			//清空选中的节点
			function cleanNodes(){
				var tree = $.fn.zTree.getZTreeObj($scope.treeId);
				if(tree){
					if($scope.type == 'select'){
						tree.cancelSelectedNode();
					}else{
						var checkedNodes = tree.getCheckedNodes(true);
						for(var i = 0, len =  checkedNodes.length; i <len; i++){
							var itemNode = checkedNodes[i];
							tree.checkNode(itemNode, false, $scope.checkTypeFlag);
						}
					}
				}
				
			}
		},
		link: function(scope, ele, attrs){
			
			scope.$watch('tree', function(newVal, oldVal, scope){
				if(newVal){
					var treeNodes = $.fn.zTree.getZTreeObj(scope.treeId);
					if(!treeNodes || newVal != oldVal){
						treeNodes = $.fn.zTree.init($("#"+ scope.treeId), scope.setting, newVal);
					}
					if(scope.expandAll == 'all'){
						treeNodes.expandAll(true);
					}
					scope.selectNodes(scope.data);
				}
			});
			scope.$watch('data', function(newVal, oldVal, scope){
				if(typeof(newVal) == 'string'){
					if(newVal == '' && newVal != oldVal){
						scope.cleanNodes();
						scope.treeVal = '';
					}else{
						scope.selectNodes(newVal);
					}
				}
			});
		}
				
	}
});

/**
 * @desc 表单中的代码集指令，
 * @desc 如果是select标签，根据torch-dict生成下拉框中的内容
 * @property torch-dict String 代码集的值
 * @property torch-dict-data [{"text":"","value":""}] 自定义代码集的值
 * @example <select name="country" class="form-control" torch-dict="CA02" ng-model="vm.memQueryList.country"></select>
 * @example <select name="country" class="form-control" torch-dict torch-dict-data="vm.dataList" ng-model="vm.memQueryList.country"></select>
 * 
 * @desc 如果是radio标签，根据torch-dict生成单选框的选项
 * @property torch-dict String 代码集的值
 * @property torch-dict-data [{"text":"","value":""}] 自定义代码集的值
 * @property data String 单选框的值
 * @property name String 单选框的名称 （必填）
 * @property filter-dict String 需要显示代码集的值
 * @property default-value String 默认值，不能是变量
 * @example <radio name="sex" torch-dict="CB17" data="vm.memQueryList.sex" default-value="1"></radio>
 *
 * @desc 如果是checkbox标签，根据torch-dict生成多选框的选项
 * @property torch-dict String 代码集的值
 * @property torch-dict-data [{"text":"","value":""}] 自定义代码集的值
 * @property data String 多选框的值
 * @property name String 多选框的名称 （必填）
 * @property default-value String 默认值，不能是变量
 * @property checkbox-rule String 校验
 * @example <checkbox name="sex" torch-dict="CB17" data="vm.memQueryList.sex" default-value="1"></checkbox>
 */
angular.module('common.form').directive('torchDict', function($timeout){
	return {
		restrict: 'A',
		scope: {
			data: '=',
			torchDictData: '=',
			name: '@',
			defaultValue: '@',
			checkboxRule: '@'
		},
		template: function(element, attrs){
			var tpl = '';
			if(element.is('select')){
				tpl += '<option value ="">--请选择--</option>';
				tpl += '<option ng-repeat="item in dictData" value="{{item.value}}">{{item.text}}</option>';
			}
			if(element.is('radio')){
					tpl += '<label class="radio-inline form-control-static" ng-repeat="item in dictData">\
								<input type="radio" name="{{name}}" ng-model="data" value="{{item.value}}" ng-click="setRadioData(item.value)">{{item.text || ""}}\
							</label>';
			}
			if(element.is('checkbox')){
				tpl += '<label class="checkbox-inline form-control-static" ng-repeat="item in dictData">\
						  <input type="checkbox" name="{{name}}" ng-model="checkdata[item.value]" ng-click="setData(checkdata)" value="{{item.value}}" rule="{{checkboxRule}}"> {{item.text}}\
						</label>';
			}
			
			return tpl;
		},
		controller: function($scope, $element, $attrs){
			$scope.dictData = [];
			
			$scope.getCheckData = getCheckData;
			
			$scope.getData = getData;
			
			$scope.setData = setData;
			
			$scope.getDictData = getDictData;
			
			$scope.setRadioData = setRadioData;
			
			function setRadioData(data){
				$scope.data = data;
			}
			
			function getDictData(){
				var dict = $attrs.torchDict;
				if(dict != ''){
					return Torch.dict.getList(dict) || [];
				}
				if(Array.isArray($scope.torchDictData)){
					return $scope.torchDictData;
				}
			}
			
			function setData(data){
				$scope.data = getData(data);
			}
			
			function getCheckData(data){
				if(!data){
					data = $scope.data;
				}
				var dataArray = data ? data.split(',') : [];
				var datacheck = {}
				if($scope.dictData){
					for(var i = 0, len = $scope.dictData.length; i < len; i++){
						var item = $scope.dictData[i];
						datacheck[item.value] = false;
					}
				}
				for(var i = 0, len = dataArray.length; i < len; i++){
					var item = dataArray[i];
					if(!!item){
						datacheck[item] = true;
					}
				}
				return datacheck;
			}
			
			function getData(data){
				var dataArray = [];
				for(var item in data){
					var itemVal = data[item];
					if(!!itemVal){
						dataArray.push(item);
					}
				}
				return dataArray.join(',');
			}
			
			if($element.is('select')){
				$timeout(function(){
					$scope.dictData = getDictData();
					$scope.data = $scope.data ? $scope.data : $scope.defaultValue;
					if($element.is('checkbox')){
						$scope.checkdata = $scope.getCheckData();
					}
				}, 10);
			}else{
				$scope.dictData = getDictData();
				$scope.data = $scope.data ? $scope.data : $scope.defaultValue;
				if($element.is('checkbox')){
					$scope.checkdata = $scope.getCheckData();
				}
			}
			
		},
		link: function($scope, $element, $attrs){
			
			if(typeof $attrs.data != 'undefined'){
				$scope.$watch('data', function(newVal, oldVal, scope){
					if(newVal && newVal != oldVal){
						scope.checkdata = scope.getCheckData(newVal);
					}
					if(typeof(newVal) == 'undefined'){
						scope.data = scope.defaultValue || '';
						scope.checkdata = scope.getCheckData(scope.defaultValue ||'');
					}
				});
				
			}
			if(typeof $attrs.torchDictData != 'undefined'){
				$scope.$watch('torchDictData', function(newVal, oldVal, scope){
					if(newVal && newVal != oldVal){
						scope.dictData = scope.getDictData();
						if($element.is('checkbox')){
							scope.checkdata = scope.getCheckData();
						}
					}
				});
			}
		}
	}
});

/**
 * @desc 表单校验 多个校验之间可以为 “且” 或 “或” 的关系
 * 用 “;” 隔开为 “且” 的关系，用“|” 隔开为 “或” 的关系，不可同时存在 “且” 和 “或” 的关系
 * @property must 必填项的校验
 * @property length 长度的校验 length:2 长度必须为二 length:1,3 长度为1-3，包括1和3
 * @property mobile 手机号的校验 
 * @property telephone 座机号的校验
 * @property email 电子邮箱的校验 
 * @property currency 货币的校验
 * @property url url的校验
 * @property postal 邮政编码的校验
 * @property qq qq号的校验
 * @property idcard 身份证号的校验
 * @property number 数字的校验
 * @property numberInt 整数的校验
 * @property numberFloat 浮点数
 * @property numberPlusFloat 非负浮点数
 * @property numberPlusInt 正整数
 * @property pass 密码（以字母开头，长度在6-18之间，只能包含字符、数字和下划线）
 * @property numorchar 数字或字符
 * @property numorenglish 数字或英文字符
 * @property character 字符校验（中文或者英文）
 * @property chinese 中文检验
 * @property english 英文校验
 * @property chineseandbd 中文+中文字符校验
 * @property contrast 值大小的校验 contrast:2 值大于等于2  contrast:2,12 值大于等于2小于等于12
 * 
 * @example <input class="form-control" ng-model="vm.personForm.cerno" rule="must">
 * @example <input class="form-control" ng-model="vm.personForm.cerno" rule="must;length:12">
 * @example <input class="form-control" ng-model="vm.personForm.cerno" rule="mobile|telephone">
 * 
 */
angular.module('common.form').directive('rule',['$parse', '$timeout', function($parse, $timeout){
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function($scope, $element, $attrs, ctrl){
			if($element.is('radio')){
				return;
			}
			/*if($element.is('checkbox')){
				return;
			}*/
			if($element.is('div')){
				return;
			}
			
			$scope.rule = Torch.rule();
			
			$element.on('blur', function(){
				var val = $(this).val();
				var ruleExpr = $(this).attr('rule');
				if($(this).is('input[type="checkbox"]')){
					var name = $(this).attr('name');
					var checkboxVal = [];
					$('input[name="'+name+'"]').each(function(){
						if($(this).is(':checked')){
							checkboxVal.push($(this).val());
						}
					})
					val = checkboxVal.join(',');
				}
				if(!ruleExpr || ruleExpr == ''){
					return;
				}
				//得到校验的结果
				var result = $scope.rule.render(val, ruleExpr);
				//判断父级元素是否为 input-group
				var parent = $element.parent();
				if(parent.hasClass('input-group')){
					parent = parent.parent();
				}
				if(parent.hasClass('checkbox-inline')){
					parent = parent.parent();
					if(parent.is('checkbox')){
						parent = parent.parent();
					}
				}
				//查找error存放的元素
				var errorDom = parent.find('.error');
				if(!errorDom || errorDom.length == 0){
					errorDom = null;
				}else{
					errorDom = $(errorDom[0]);
				}
				if(result.state){
					$timeout(function(){
						$scope.$apply(function() {
							ctrl.$setDirty();
							ctrl.$setValidity('rule', true);
						});
					}, 0 , false);
					
					
					if(errorDom){
						errorDom.addClass('hidden');
					}
				}else{
					$timeout(function(){
						$scope.$apply(function() {
							ctrl.$setDirty();
							ctrl.$setValidity('rule', false);
						});
					}, 0 , false);
					if(errorDom){
						errorDom.html('<span class="glyphicon glyphicon-remove-circle"></span><span>'+ result.msg +'</span>');
						errorDom.removeClass('hidden');
					}else{
						parent.append('<div class="error text-danger small-gap"><span class="glyphicon glyphicon-remove-circle"></span><span class="text-danger">'+ result.msg +'</span></div>');
					}
				}
			});
		}
	}
}]);







