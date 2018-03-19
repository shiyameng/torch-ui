/**
 * @desc 树组件
 * @property data String 输入框的值 格式：以“,”隔开的字符串
 * @property tree Array 树的数据来源
 * @property name String 树的名称 作为树的唯一标识
 * [{"id":"110000","pid":"100000","name":"北京市","value":"110000"},
 * {"id":"110101","pid":"110000","name":"东城区","value":"110101"},
 * {"id":"110102","pid":"110000","name":"西城区","value":"110102"},
 * {"id":"110105","pid":"110000","name":"朝阳区","value":"110105"},
 * {"id":"110106","pid":"110000","name":"丰台区","value":"110106"},
 * {"id":"110107","pid":"110000","name":"石景山区","value":"110107"}]
 * @property type String 类型（默认多选 check，单选 select）
 * @property tree-cascade String 多选框级联类型，type必须为check （默认none：没有级联，child：子集级联，all：父子集均级联）
 * @example <tree name="name" data="vm.treeValue" tree="vm.treeList" type="check" tree-cascade="child"></tree>
 */
angular.module('common.tree').directive('tree', function(){
	return {
		restrict: 'E',
		scope: {
			name: '@',
			data: '=',
			tree: '=',
			type: '@',
			treeCascade: '@'
		},
		template: '<ul id="{{name + \'tree\'}}" class="ztree"></ul>',
		controller: function($scope){
			//树的ID
			$scope.treeId = $scope.name + 'tree';
			//选中节点的方法
			$scope.selectNodes = selectNodes;
			//清空选中的节点
			$scope.cleanNodes = cleanNodes;
			//是否进行父子节点的勾选联动操作 
			$scope.checkTypeFlag = false;
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
			//选中节点的方法
			function selectNodes(nodeVals){
				var selectNodes = nodeVals ? nodeVals.split(',') : [];
				var tree = $.fn.zTree.getZTreeObj($scope.treeId);
				if(tree){
					for(var i = 0, len = selectNodes.length; i < len; i++){
						var item = selectNodes[i];
						var treeNode = tree.getNodeByParam("value", item, null);
						if(treeNode){
							tree.checkNode(treeNode, true, $scope.checkTypeFlag);
						}
					}
				}
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
					scope.selectNodes(scope.data);
				}
			});
			scope.$watch('data', function(newVal, oldVal, scope){
				if(typeof(newVal) == 'string'){
					if(newVal == '' && newVal != oldVal){
						scope.cleanNodes();
					}else{
						scope.selectNodes(newVal);
					}
				}
			});
		}
				
	}
});

