/**
 * @desc 列表分页指令
 * @property page Object 分页对象{pageNo: '当前页数', pageSize: '每页条数', total: '列表数据总数'}
 * @property change Function 页数变化后触发该事件
 * @property theme String 主题样式
 * @example <grid-paging page='vm.basicBranchQueryListPage' change='vm.basicBranchQueryListNum()'></grid-paging>
 */
angular.module('common.grid').directive('gridPaging', function(){
	return {
		restrict: 'EA',
		scope: {
			page: '=',
			change: '&',
			theme: '@'
		},
		template:function(tEle,tAttrs){
			if(tAttrs.theme=="1"||tAttrs.theme==null){
				return '\
				<div class="clearfix">\
					<div style="float:right;margin-top:7px;margin-left:10px;">共{{numPages}}页{{page.total}}条数据</div>\
					<div uib-pagination  previous-text="上一页" next-text="下一页" first-text="首页" last-text="末页"\
			             max-size=5 rotate="true" force-ellipses="true" boundary-links="true" num-pages="numPages" \
			             items-per-page="page.pageSize" total-items="page.total" theme="{{theme}}"\
			             ng-model="page.pageNo" ng-change="change()" class="pull-right">\
					</div>\
				</div>';
			}
			if(tAttrs.theme=="2"){
				alert("该主题尚未实现");
			}		
		},
		controller: function($scope){
			if($scope.page){
				$scope.page.pageSize = $scope.page.pageSize + '';
				$scope.page.pageNo = $scope.page.pageNo + '';
				$scope.page.total = ($scope.page.total || 0) + '';
			}else{
				$scope.page = {
						pageNo: '1',
						pageSize: '10'
				}
			}
		}
	};
});

/**
 * @desc 列表的多选指令
 * @desc 为table 添加指令 grid-checkbox
 * @property grid-list Array 查询的列表数据
 * @property check-list Array 选中的列表数据
 * 
 * @desc 为th添加全选按钮 指令checkbox-all 
 * @poperty data Array 查询的列表数据
 * 
 * @desc 为td添加多选按钮 指令checkbox-item 
 * @property data Object 查询列表中的数据
 * 
 * @desc 为td添加多选按钮 指令radio-item 
 * @property data Object 查询列表中的数据
 * 
 * @example
 *<table grid-checkbox grid-list="vm.queryList" check-list="vm.checkList" class="table table-common table-bordered table-hover">
                   <thead>
                       <tr>
                           <th style="width: 10%">
                               <div checkbox-all data="vm.queryList"></div>
                           </th>
                           <th style="width: 10%">序号</th>
                           <th style="width: 40%">项目</th>
                           <th >经营范围</th>
                       </tr>
                   </thead>
                   <tbody>
                       <tr class="text-center" ng-repeat="query in vm.queryList" ng-class="{'selected': query.checked}">
                           <td class="text-center">
                               <div checkbox-item data="query"></div>
                           </td>
                           <td  class="text-center" ng-bind="$index | pageIndex:vm.pageNo.pageNo:vm.pageNo.pageSize"></td>
                           <td ng-bind="query.dmName"></td>
                           <td ng-bind="query.scopename"></td>
                       </tr>
                   </tbody>
               </table>
 */

angular.module('common.grid').controller('CheckAllController',['$scope', function($scope){
	var ctrl = this;
	ctrl.checkLen = 0;
	
	//添加一个多选项
	ctrl.addCheck = function(item){
		if(!item){
			return;
		}
		ctrl.checkList.push(item);
	}
	
	//删除一个多选项
	ctrl.removeCheck = function(item){
		if(!item){
			return;
		}
		for(var i = 0, len = ctrl.checkList.length; i < len; i++){
			var checkItem = ctrl.checkList[i];
			if(checkItem){
				if(Torch.isObjMajorityEqual(checkItem, item, ['$$hashKey', 'checked'])){
					ctrl.checkList.splice(i, 1);
					break;
				}
			}
		}
	}
	
	//清空选中的项
	ctrl.cleanCheck = function(){
		ctrl.checkList = [];
	}
	
	//判断是否当前页的所有数据都被选中
	ctrl.isAllChecked = function(){
		for(var i = 0, len = ctrl.gridList.length; i < len; i++){
			var item = ctrl.gridList[i];
			if(!item.checked){
				return false;
			}
		}
		return true;
	}
}])
.directive('gridCheckbox', function(){
	return{
		restrict: 'A',
		replace: true,
		template: '',
		scope:{
			gridList: '=',
			checkList: '='
		},
		controller: 'CheckAllController',
		controllerAs: 'all',
		bindToController: true
		
	}
})
.directive('checkboxAll', function(){
	return{
		restrict: 'A',
		replace: true,
		require: '^gridCheckbox',
		template: '<input type="checkbox" ng-click="checkAll()" ng-checked="!!checkedAll">',
		scope:{
			data: '='
		},
		controller: function($scope){
			
		},
		link: function(scope, element, attrs, checkAllCtrl){
				scope.isAllchecked = isAllchecked;
				//全选的触发方法
				scope.checkAll = function(){
					if(checkAllCtrl.checkList){
						scope.checkedAll = !scope.checkedAll;
						for(var i = 0, len = checkAllCtrl.gridList.length; i < len; i++){
							var item = checkAllCtrl.gridList[i];
							if(scope.checkedAll){
								if(!item.checked){
									item.checked = !item.checked;
									checkAllCtrl.addCheck(item);
								}
							}else{
								if(item.checked){
									item.checked = !item.checked;
									checkAllCtrl.removeCheck(item);
								}
							}
						}
						
						
					}
				}
				
				scope.$watch('data', function(newVal, oldVal, scope){
					scope.checkedAll = scope.isAllchecked();
				})
				
				function isAllchecked(){
					if(scope.data && scope.data.length > 0){
						for(var i = 0, len = scope.data.length; i <len; i++){
							var item = scope.data[i];
							if(!item.checked){
								return false;
							}
						}
						return true;
					}
					return false;
				}
			}
		
	}
})
.directive('checkboxItem', function(){
	return {
		restrict: 'A',
		require: '^gridCheckbox',
		replace: true,
		template: '<input type="checkbox" ng-click="checkItem(data)" ng-checked="!!data.checked">',
		scope: {
			data: '='
		},
		controller: function($scope){
			
		},
		link: function(scope, element, attrs, checkAllCtrl){
			checkAllCtrl.checkedAll = false;
			//初始化选中的多选框
			if(checkAllCtrl.checkList){
				for(var i = 0, len = checkAllCtrl.checkList.length; i < len; i++){
					var checkItem = checkAllCtrl.checkList[i];
					if(checkItem){
						if(Torch.isObjMajorityEqual( checkItem, scope.data, ['$$hashKey', 'checked'])){
							scope.data.checked = true;
						}
					}
				}
			}
			
			//选中触发的事件
			scope.checkItem = function(){
				scope.data.checked = !scope.data.checked;
				if(!!scope.data.checked){
					checkAllCtrl.addCheck(scope.data);
				}else{
					checkAllCtrl.removeCheck(scope.data);
				}
			}
		}
	}
})
.directive('radioItem', function(){
	return {
		restrict: 'A',
		require: '^gridCheckbox',
		replace: true,
		template: '<input name="gridRadio" type="radio" ng-click="checkItem(data)" ng-checked="!!data.checked">',
		scope: {
			data: '='
		},
		controller: function($scope){
			
		},
		link: function(scope, element, attrs, checkAllCtrl){
			//初始化选中的多选框
			if(checkAllCtrl.checkList){
				for(var i = 0, len = checkAllCtrl.checkList.length; i < len; i++){
					var checkItem = checkAllCtrl.checkList[i];
					if(checkItem){
						if(Torch.isObjMajorityEqual( checkItem, scope.data, ['$$hashKey', 'checked'])){
							scope.data.checked = true;
						}
					}
				}
			}
			
			//选中触发的事件
			scope.checkItem = function(){
				scope.data.checked = !scope.data.checked;
				if(!!scope.data.checked){
					checkAllCtrl.cleanCheck();
					checkAllCtrl.addCheck(scope.data);
				}
			}
		}
	}
});


