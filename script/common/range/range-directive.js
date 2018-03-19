/**
 * @desc 申请信息页面的经营范围的选择用的指令
 * @property data 从父控制器中获取经验范围的数据
 * @property value 从外层控制器中获取textare中的值（如果有的话）
 */
angular.module('common.range').directive('rangeSelect', function($timeout){
	return {
		restrict: 'EA',
		scope: {
			data:"=",
			value:"="
		},
		templateUrl:'/app/script/common/range/rangeSelect-tpl.html',
		controller:function($scope){	
			//该flag在$scope.$on成功接收后被$emit穿给父控制器，进行相关判断后进行操作
			var flag=true;
			//增加常用行业
			var offenUse = [];
			//从外层控制器中获取动态数据
			$scope.rangeData = $scope.data;
			
			//点击常用行业的某个行业，添加对应行业的相关经营范围
			var rangeChild;
			var arr = [];
			$scope.rangeChild;
			//添加pid为0的数据的到数组offenUse中
			$scope.doAdd = doAdd;
			//点击一级菜单
			$scope.select = select;
			//选择二级菜单中的某个值到textare中
			$scope.choice = choice;
			//加载一级菜单的数据
			function doAdd(){
				//每次加载一级菜单都将之前加载的一级菜单的数据
				offenUse.length = 0;
					var id;//pid为0的元素的ID
					if($scope.rangeData && $scope.rangeData._data){
						$scope.rangeData._data[0].parentFlag = true;
						for(var i = 0,len = $scope.rangeData._data.length;i<len;i++){
							if(i!= 0){
								$scope.rangeData._data[i].parentFlag = false;
							}
							
							//将所有的行业常用语放入offenUse数组中
							if($scope.rangeData._data[i].pid == 0){
								offenUse.push($scope.rangeData._data[i]);
								id = $scope.rangeData._data[i].id;
							}
						}
					
				}
				return offenUse;			
			}
			//doAdd方法在每次加载指令的时候自动执行，将一级菜单的值放入数组offenUse中
			var subDatas = $scope.doAdd();
			//取到父控制器中的数据
			$scope.datas = subDatas;
			function select(index){
				arr = [];
			    var id = offenUse[index].id;//当前点击文字的id
			    offenUse[index].children = [];
			    for(var i = 0,len = $scope.rangeData._data.length;i<len;i++){
			    	if($scope.rangeData._data[i].pid == id){		
			    		$scope.rangeData._data[i].flag = false;
			    		offenUse[index].children.push($scope.rangeData._data[i]);
			    	}
			    }
			    rangeChild = offenUse[index];
			    $scope.rangeChild = rangeChild;
			    return $scope.rangeChild
			}
			//选择行业用语中的某个经营范围到textare中		
			function choice(index){
				//设置选中的方框的样式
				$(event.target).addClass("box-green");
				$($(event.target).find("i")).addClass("box-green-icon");
				var count = []; 
				//得到方框中的文字的值
				var value = $scope.rangeChild.children[index].text;	
				if($scope.value && arr.length == 0){//如果textare中有从数据库中带回来的值，并且arr数组的长度为0
					//从数据库中带回来的数据以分号分隔开，将新的数据加入该字符串中
					$scope.value = $scope.value;
					//获取逗号隔开的数据，将他们分别放入arr数组中
					arr = $scope.value.split("，")||$scope.value.split(",");
					//arr.push(value);
					for(var i = 0,len = arr.length;i<len;i++){
						if(arr[i].replace(/(^\s*)|(\s*$)/g, "") == value.replace(/(^\s*)|(\s*$)/g, "")){
							arr.splice(i,1);
							$(event.target).removeClass("box-green");
							console.log($(event.target)[0]);
							$($(event.target).find("i")).removeClass("box-green-icon");
							break;
						}
						if(i == len-1 && arr[i] != value){
							arr.push(value);
						}
					}
					
				}else{
					var flag = true;
					for(var i = 0,len = arr.length;i<len;i++){
						//如果方框中的文字已经被加入textare中，再次点击则从textare中删除，并改变方框的样式
						if(value == arr[i]){
							arr.splice(i,1);
							$(event.target).removeClass("box-green");
							$($(event.target).find("i")).removeClass("box-green-icon");
							flag = false;
						}
					}
					//如果点击的方框中的文字未被加入textare中
					if(flag){
						arr.push(value);
					}
					//如果重复点击方框，将相同字符的索引放入count数组中
					for(var i = 0,len = arr.length;i<len;i++){
						if(value == arr[i]){
							 count.push(i);
						}
					}
					//去掉重复的字符
					if(count.length >= 1){
						for(var i = 0,len = count.length-1;i<len;i++){
							arr.splice(count[i],1);
						}
					}
					
				}
				//从更多的弹框中选择的添加数据项
				$scope.$on('child',function(event,data){
					if(arr.indexOf(data) < 0){
						arr.push(data);
						$scope.value = arr.join("，");
					}
				})
				$scope.$emit("parent",flag);
				//每个字符用中文逗号分隔
				$scope.value = arr.join("，");	
				}
				//获取当前所有选择的经营范围
				$scope.$on("parent",function(event,data){
					$scope.nwtextare = data;
				});
				
			},
			link:function(scope,ele,attrs){	
				//监听textarea中的数据，当添加了新字符串的时候，将其添加到applyController控制器的value中以便进行保存
				scope.$watch('value',function(newValue,oldValue,scope){	
					if(oldValue != newValue){
						scope.$parent.$parent.$parent.$parent.value = newValue;//不可删除,向作用域传值，用$emit代替						
						scope.nwtextarea = newValue;
						scope.$broadcast('parent',newValue);
						textare = newValue;
						var value = textare.split("，");	
						addClass(value);
					}
					if(newValue){/*
						textare = newValue;
						var value = textare.split("，");	
						addClass(value);
					*/}

				})	
				//每次切换tab页重新获取data的值
				scope.$watch('data',function(newValue,oldValue,scope){
					$timeout(function(){						
					if(newValue && newValue != oldValue){
						scope.rangeData = newValue;
						var topData = scope.doAdd();//一级菜单的数据
						var doLen = topData.length;
						var content = topData;//获取一级菜单的数据
						var sort = [];
						var s = [];
						scope.select(0);
						for(var di = 0;di<doLen;di++){
							scope.select(di);
							var subChildren = scope.select(di).children;
							if(typeof textare =='undefined' || textare.length == 0){
								//当textare的值不存在
								content[0].parentFlag = true;
								return;
							}
							var value = textare.split("，");	//textare中元素组成的数组					
							for(var si = 0,slen = subChildren.length;si<slen;si++){//当textare中有值
								var selected = false;
								var sel = true;
								
								if(value.indexOf(subChildren[si].text)!=-1){
									content[0].parentFlag=false;
									subChildren[si].flag=true;
									content[di].parentFlag=true;
									doLen=di;//当textare包含当前一级菜单下的某些元素时，跳出循环，不在向下比较
									selected=true;
									s.push(subChildren[si]);//如果textare中有和二级菜单相同的值，将该值push进s数组
								}else{
									subChildren[si].flag=false;
								}
							}
							
						}
						//textare中有值，但均不是二级菜单中的值
						if(s.length == 0){
							scope.select(0);
						}
					}
				
					},2000);
				});
				//为选中元素添加样式，这个元素是指常用行业用语下的二级菜单数据
				function addClass(value){
					for(var j=0,valLen = value.length;j<valLen;j++){
						var _ele = angular.element(document).find("span[name = 'littleBox']");
						for(var i = 0,len = _ele.length;i<len;i++){	
							//去掉字符串前后的空格
							var text = _ele[i].innerText.replace(/(^\s*)|(\s*$)/g, "");
							//如果value中的值和span[name = 'littleBox']中的值相同，为该span添加选中的样式
							if(value[j].replace(/(^\s*)|(\s*$)/g, "") == text){								
								$(_ele[i]).addClass("box-green");
								var _ele2 = angular.element(document).find("i[name = 'icon']");
								$(_ele2[i]).removeClass("box-gray-icon");
								$(_ele2[i]).addClass("box-green-icon");
								break;
							}
						}
					}
				}
				ele.on("click",function(){
					//获取从applycontroller中带回来的textare中的值，并将其放入数组value中
					if(scope.nwtextare){
						var value = scope.nwtextare.split("，");
						addClass(value);
					}
				});
							
				//当点击常用行业中的某个词，改变其样式,给其添加蓝色背景，将字体改为白色
				ele.on("click",function(){
					var _ele = $(event.target)[0].parentElement.parentElement;
					//获取点击的按钮的文字，并去掉其中的空格
					var btn = $(_ele)[0].className.replace(/(^\s*)|(\s*$)/g, "");
					if(btn == "range-banner"){
						$(_ele).find("span").removeClass("btn-click")
						$(event.target).addClass("btn-click");
					}
				})
				//当点击常用行业的其中某个名词，给其包含的每个子元素添加样式
				ele.on("click",function(){
					angular.element(document).find("span[name = 'littleBox']").addClass("box-gray");
					angular.element(document).find("i[name = 'icon']").addClass("box-gray-icon");
				})
		}
	};
});

