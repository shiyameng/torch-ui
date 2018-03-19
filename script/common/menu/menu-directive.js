/**
 * @desc 菜单的指令
 * @property data List 树用于加载的数据
 * @property select Function(item) 点击树的叶子结点的触发方法，item存储的是选中叶子结点的数据
 * @property theme String 样式主题 （默认向右滑出:slideright 展开:unfold 向下滑出:slidedown）
 * @property is-open String 是否打开第一个一级菜单项 （默认false:不打开  true:打开）
 * <menu data="vm.dataList" select="vm.select(item)" ></menu>
 * vm.dataList = [
	               		{'id': '1', 'pid': '0', 'text': '企业设立'},
	               		{'id': '2', 'pid': '0', 'text': '企业变更'},
	               		{'id': '3', 'pid': '0', 'text': '企业备案'},
	               		{'id': '4', 'pid': '1', 'text': '公司设立'},
	               		{'id': '5', 'pid': '2', 'text': '公司变更', 'url': './company/setup/cp-1100-setup.html'},
	               		{'id': '6', 'pid': '3', 'text': '公司备案', 'url': './company/inv/inv-1100-edit.html'},
	               		{'id': '7', 'pid': '1', 'text': '分公司设立', 'url': './company/setup/cp-1100-setup.html'},
	               		{'id': '8', 'pid': '2', 'text': '分公司变更', 'url': './company/setup/cp-1100-setup.html'},
	               		{'id': '9', 'pid': '4', 'text': '股份有限公司设立', 'url': './company/inv/entinv-1100-edit.html'}
	              ];
 */

angular.module('common.menu').directive('menu', function(){
	return {
		restrict: 'E',
		scope: {
			data: '=',
			select: '&select',
			theme: '@',
			isOpen: '@'
		},
		template:function(tEle,tAttrs){
			if(tAttrs.theme == 'unfold'){
				return renderUnfoldMenu();
			}else if(tAttrs.theme == 'slidedown'){
				return renderSlideDownMenu();
			}else{
				return renderSlideRightMenu();
			}
			
			//渲染向下滑出式的菜单
			function renderSlideDownMenu(){
				var tpl = '<ul class="list-group slide-down-menu clearfix">\
							<li ng-repeat="menuFirstItem in menuList" ng-click="selectFirstSlideMenu($event);selectSlideMenu(menuFirstItem);">\
								<div class="list-group-item menu-first text-center">\
									<span class="text-center menu-first-text" ng-bind="menuFirstItem.text"></span>\
								</div>\
								'+renderSlideDownSecondMenu()+'\
							 </li>\
							</ul>\
						';
				return tpl;
			}
			//渲染向右滑出式菜单的二级
			function renderSlideDownSecondMenu(){
				var tpl = '<div class="list-group menu-seconds" ng-if="menuFirstItem.child && menuFirstItem.child.length > 0">\
								<div class="menu-seconds-content">\
									<div class="list-group-item menu-second" ng-repeat="menuSecondItem in menuFirstItem.child">\
										<span class="menu-second-text" ng-bind="menuSecondItem.text" ng-click="selectSlideMenu(menuSecondItem)"></span>\
									</div>\
								</div>\
						   </div>';
				return tpl;
			}
			
			
			//渲染向右滑出式的菜单
			function renderSlideRightMenu(){
				var tpl = '<ul class="list-group slide-menu">\
							<li ng-repeat="menuFirstItem in menuList" ng-click="selectFirstSlideMenu($event);selectSlideMenu(menuFirstItem);">\
								<div class="list-group-item menu-first text-center">\
									<span class="glyphicon glyphicon-th-list"></span>\
									<p class="text-center menu-first-text" ng-bind="menuFirstItem.text"></p>\
								</div>\
								'+renderSlideRightSecondMenu()+'\
							 </li>\
							</ul>\
						';
				return tpl;
			}
			//渲染向右滑出式菜单的二级
			function renderSlideRightSecondMenu(){
				var tpl = '<div class="list-group menu-seconds" ng-if="menuFirstItem.child && menuFirstItem.child.length > 0">\
								<div ng-repeat="menuSecondItem in menuFirstItem.child">\
									<div class="list-group-item menu-second">\
										<small class="glyphicon glyphicon-triangle-right"></small>\
										<span class="menu-second-text" ng-bind="menuSecondItem.text" ng-click="selectSlideMenu(menuSecondItem)"></span>\
									</div>\
								</div>\
						   </div>';
				return tpl;
			}
			
			
			//渲染折叠式的菜单
			function renderUnfoldMenu(){
				var tpl = '<ul class="list-group unfold-menu">\
							<li ng-repeat="treeItem in menuList">\
								<div class="list-group-item" ng-class="{active:(active === $index)}" ng-click="unfoldMenu(treeItem, $index)">\
									<img ng-if="treeItem.picurl && active !== $index" ng-src="{{treeItem.picurl}}">\
									<img ng-if="treeItem.picurl && active === $index" ng-src="{{treeItem.picurl.replace(\'.png\', \'-active.png\')}}">\
									<span ng-bind="treeItem.text" ng-click="selectUnfoldMenu(treeItem)"></span>\
									<span class="glyphicon pull-right" ng-class="{\'glyphicon-chevron-down\': !(active === $index), \'glyphicon-chevron-up\': (active === $index)}"></span>\
								</div>\
								<ul ng-if="treeItem.child && treeItem.child.length > 0" class="list-group tree-second" ng-class="{show:(active === $index), hidden:!(active === $index)}">\
									<li ng-repeat="second in treeItem.child">\
										<div ng-if="!second.child || second.child.length == 0" class="list-group-item tree-second" ng-click="selectUnfoldMenu(second)" ng-class="{active: second.id === active}">\
											<span class="glyphicon glyphicon-tasks"></span>\
											<span ng-bind="second.text"></span>\
										</div>\
										<div ng-if="second.child && second.child.length > 0" class="list-group-item tree-second" ng-click="unfoldMenu(second)">\
											<span class="glyphicon" ng-class="{\'glyphicon-chevron-right\': !second.select, \'glyphicon-chevron-down\': second.select}"></span>\
											<span ng-bind="second.text" ng-click="selectUnfoldMenu(second)"></span>\
										</div>\
										<ul ng-if="second.child && second.child.length > 0" class="list-group tree-three" ng-class="{show:second.select, hidden:!second.select}">\
											<li ng-repeat="three in second.child">\
												<div ng-if="!three.child || three.child.length == 0" class="list-group-item tree-three" ng-click="selectUnfoldMenu(three)" ng-class="{active: three.id === active}">\
													<span class="glyphicon glyphicon-tasks"></span>\
													<span ng-bind="three.text"></span>\
												</div>\
												<div ng-if="three.child && three.child.length > 0" class="list-group-item tree-three" ng-click="unfoldMenu(three)">\
													<span class="glyphicon" ng-class="{\'glyphicon-chevron-right\': !three.select, \'glyphicon-chevron-down\': three.select}"></span>\
													<span ng-bind="three.text" ng-click="selectUnfoldMenu(three)"></span>\
												</div>\
												<ul ng-if="three.child && three.child.length > 0" class="list-group tree-four" ng-class="{show:three.select, hidden:!three.select}">\
													<li ng-repeat="four in three.child">\
														<div class="list-group-item tree-four" ng-click="selectUnfoldMenu(four)" ng-class="{active: four.id === active}">\
															<span class="glyphicon glyphicon-tasks"></span>\
															<span ng-bind="four.text"></span>\
														</div>\
													</li>\
												</ul>\
											</li>\
										</ul>\
									</li>\
								</ul>\
							</li>\
						</ul>';	
				return tpl;
			}
		},
		controller: function($scope, $element, $attrs){
			
			//得到菜单的加载格式
			/*[
			 {
				 'text': '',
				 'id': '',
				 'pid': '',
				 'child': [
				           {
				        	   'text': '',
				        	   'id': '',
				        	   'pid': ''
				           }
				           ]
			 }
			 ]*/
			$scope.getMenuList = getMenuList;
			//向右滑出式菜单的点击一级菜单二级菜单滑出的方法
			$scope.selectFirstSlideMenu = selectFirstSlideMenu;
			//向右滑出式菜单点击节点的方法
			$scope.selectSlideMenu = selectSlideMenu;
			//点击折叠菜单节点的方法
			$scope.selectUnfoldMenu = selectUnfoldMenu;
			//展开折叠菜单的方法
			$scope.unfoldMenu = unfoldMenu;
			//得到树的格式数据
			$scope.menuList = $scope.getMenuList($scope.data);
			//折叠菜单选中的当前一级菜单的index，默认为空，如果打开第一个一级菜单项为0
			$scope.active = ($scope.isOpen == 'true' ? 0 : '');
			
			
			function unfoldMenu(treeItem, index){
				//判断该节点是否点击过
				if(typeof treeItem.select == 'undefined'){
					//加载子节点的child用以判断子节点是否为最后的节点
					var child = treeItem.child;
					if(child && child.length > 0){
						for(var i = 0, len = child.length; i < len; i++){
							var item = child[i];
							if(!item.child){
								item.child = $scope.getChild($scope.data, item.id);
							}
						}
					}
				}
				//根据选中情况来显示隐藏节点
				if(!treeItem.select){
					treeItem.select = true;
				}
				else{
					treeItem.select = false;
				}
				//为选中的菜单添加样式
				if(index != null){
					if(index === $scope.active){
						$scope.active = '';
					}else{
						$scope.active = index;
					}
				}
			}
			function selectUnfoldMenu(treeItem){
				if($scope.select && (typeof $scope.select == 'function')){
					$scope.select({item:treeItem});
				}
			}
			function selectSlideMenu(node){
				if($scope.select && (typeof $scope.select == 'function')){
					$scope.select({item:node});
				}
			}
			//根据属性中传来的data初始化树结构
			function getMenuList(dataList){
				if(!dataList){
					return [];
				}
				return getChild(dataList, '0');
			}
			
			function getChild(dataList, pid){
				var child = []
				if(!!pid){
					for(var i = 0, len = dataList.length; i <len; i++){
						var item = dataList[i];
						if(item.pid == pid){
							item.child = getChild(dataList, item.id);
							child.push(item);
						}
					}
				}
				return child;
			}
			
			function selectFirstSlideMenu(event){
				var $element = angular.element(event.target);
				if($element[0].tagName != 'LI'){
					$element = $element.parents('li');
				}
				//如果是向下滑出
				if($scope.theme == 'slidedown'){
					if($element.hasClass('active')){
						hideActiveSecondMenu();
					}else{
						hideActiveSecondMenu();
						showSecondSlideDownMenu($element);
					}
					
				}else{
					if($element.hasClass('active')){
							hideActiveSecondMenu();
					}else{
						hideActiveSecondMenu();
						showSecondSlideRightMenu($element);
					}
				}
			}
			//显示向右滑出的二级菜单
			function showSecondSlideRightMenu($element){
				var $secondMenu = $element.find('.menu-seconds');
				if($secondMenu.length > 0){
					angular.element("body").off("mouseup", hideActiveSecondMenu).on("mouseup", hideActiveSecondMenu);
					$element.addClass('active');
					$secondMenu.animate({width:'120px'},'fast');
				}
			}
			//显示向下滑出的二级菜单
			function showSecondSlideDownMenu($element){
				var $secondMenu = $element.find('.menu-seconds');
				if($secondMenu.length > 0){
					angular.element("body").off("mouseup", hideActiveSecondMenu).on("mouseup", hideActiveSecondMenu);
					$element.addClass('active');
					$secondMenu.animate({height:'42px'},'fast');
				}
			}
			//隐藏当前选中的菜单项及其二级菜单
			function hideActiveSecondMenu(event){
				if(event && event.target){
					if($(event.target).parents('menu').length > 0){
						return;
					}else{
						angular.element("body").off("mouseup", hideActiveSecondMenu);
					}
				}
				var menu = angular.element('menu');
				if(menu && menu.length > 0){
					for(var i = 0, len = menu.length; i < len; i++){
						var theme = menu.eq(i).attr('theme');
						var $element = menu.find('li.active');
						if(!$element || $element.length == 0){
							return;
						}
						if(theme == 'slidedown'){
							hideSecondSlideDownMenu($element, event);
						}else{
							hideSecondSlideRightMenu($element);
						}
					}
				}
				
			}
			//隐藏向右滑出的二级菜单
			function hideSecondSlideRightMenu($element){
				var $secondMenu = $element.find('.menu-seconds');
				if($secondMenu.length > 0){
					$secondMenu.stop(true);
					$secondMenu.animate({width:'0'},'fast',function(){
						$element.removeClass('active');
					});
				}
			}
			//隐藏向下滑出的二级菜单
			function hideSecondSlideDownMenu($element){
				var $secondMenu = $element.find('.menu-seconds');
				if($secondMenu.length > 0){
					$secondMenu.stop(true);
					$secondMenu.animate({height:'0'},'fast',function(){
						$element.removeClass('active');
					});
				}
			}
		},
		link: function(scope, ele, attrs){
			scope.$watch('data', function(newVal, oldVal, scope){
				scope.menuList = scope.getMenuList(newVal);
			});
		}
	};
});

