angular.module('common.advanced', ['ui.bootstrap']);
/**
 * @desc 高级查询的组件
 * @property before-data左侧容器数据  after-data右侧容器数据
 * @property 数据结构：[{"tableid":"nmzxk_cp_rs_ent","tablenamecn":"企业（机构）表"}]
 * @property beforeData：左面的值
 * @property afterData：右面的值
 * @property mainData：主题 或 主表的id
 * @property mainDataChinese：主题 或 主表的中文name
 * @property type ：选表类型tables 或 是字段类型cols
 * @example <advanced-data type='tables' class='advanced-data' name="advanced" main-data='vm.applyForm' before-data='vm.beforesheetData' after-data='vm.aftersheetData'></advanced-data>
 */
angular.module('common.advanced').directive('advancedData', function($filter){
	return {
		restrict: 'E',
		scope: {
			name: '@',
			beforeData: '=',
			afterData: '=',
			mainData:'=',
			mainDataChinese:'=',
			type:'@'
		},
		template: '\
				<div class="col-sm-3">\
					<div class="dropdown beforeSheetData">\
						<ul class="dropdown-menu">\
							<li ng-repeat="data in beforeData" ng-dblclick="toUp()" id="{{data.tableid}}" ng-bind="data.tablenamecn"></li>\
						</ul>\
					</div>\
				</div>\
				<div class="col-sm-1 text-center">\
					<p ng-click="toUp()" title="选中"><span class="glyphicon glyphicon-chevron-right"></span></p>\
					<p ng-click="toBack()" title="取消"><span class="glyphicon glyphicon-chevron-left"></span></p>\
					<p ng-click="toUpAll()" title="全部选中"><span class="glyphicon glyphicon-forward"></span></p>\
					<p ng-click="toBackAll()" title="全部取消"><span class="glyphicon glyphicon-backward"></span></p>\
				</div>\
				<div class="col-sm-3">\
					<div class="dropdown afterSheetData">\
						<ul id="outer_wrap" class="dropdown-menu"></ul>\
					</div>\
				</div>\
			',
		controller: function($scope, $filter,$timeout){
			//校验方法
			function verification(beforeData,afterData){
				for( var i = 0 ; i < $scope.afterData.length ; i++ ){
					if($scope.afterData[i].tableId == beforeData ){
						beforeDataZN = Torch.tableCols.getName(beforeData);
						Torch.info('已选该数据:'+beforeDataZN,'danger');
						return false
					}
				}
				return true
			}
			//获取右侧容器的内容
			$scope.backData = function(){
				//防止初始化回显 $watch的监听
				$scope.afterDataNum = $scope.afterDataNum + 1;
				$scope.afterData = [];
				for(var i = 0 ; i < $("#outer_wrap li").length ; i++ ){
					if($scope.type == 'cols'){
						$scope.afterData.push({colName:$("#outer_wrap li")[i].id,tableNameCn:$("#outer_wrap li")[i].innerHTML,tableId:$("#outer_wrap li")[i].getAttribute("name")});	
					}else{
						$scope.afterData.push({tableId:$("#outer_wrap li")[i].id,tableNameCn:$("#outer_wrap li")[i].innerHTML,mainData:$("#outer_wrap li")[i].getAttribute("name")});	
					}
				}
			}
			
			//左侧去右侧
			$scope.toUp = function(){
				
				for(var i = 0 ; i < $('.beforeSheetData .backgroundBlue').length ; i++ ){
					var mainData = Torch.tableCols.getName($scope.mainData);
					if(verification($('.beforeSheetData .backgroundBlue')[i].id)){
						$("#outer_wrap").append("<li class='outerWrap' name='"+$scope.mainData+"' id='"+$('.beforeSheetData .backgroundBlue')[i].id+"'>"+"<span style='color:blue;'>[ "+ mainData +" ] </span>"+$('.beforeSheetData .backgroundBlue')[i].innerHTML + "</li>");
					}
				}
				$(".dropdown li").removeClass("backgroundBlue")
				//获取右侧容器的内容
				$scope.backData();
				//给新的节点绑定 选中，拖动 方法
				$(".outerWrap").click(function (e){ 
	        	    if(e.shiftKey){  
	        	    	$(this).toggleClass("backgroundBlue");  
	        	    }else{  
	        	    	$(".outerWrap").attr("class","")
        	    		$(this).addClass("backgroundBlue"); 
	        	    }  
	    	    }); 
				$(".outerWrap").dblclick(function (e){ 
					$("#outer_wrap li").remove(".backgroundBlue");
					$(".dropdown li").attr("class","")
					//获取右侧容器的内容
					$scope.backData();
	    	    }); 
			};
			
			//左侧全部去右侧
			$scope.toUpAll = function(){
				
				for(var i = 0 ; i < $('.beforeSheetData li').length ; i++ ){
					var mainData = Torch.tableCols.getName($scope.mainData);
					if(verification($('.beforeSheetData li')[i].id)){
						$("#outer_wrap").append("<li class='outerWrap' name='"+$scope.mainData+"' id='"+$('.beforeSheetData li')[i].id+"'>"+"<span style='color:blue;'>[ "+ mainData +" ] </span>"+$('.beforeSheetData li')[i].innerHTML+ "</li>");
					}
				}
				$(".dropdown li").removeClass("backgroundBlue")
				//获取右侧容器的内容
				$scope.backData();
				//给新的节点绑定 选中，拖动 方法
				$(".outerWrap").click(function (e){ 
	        	    if(e.shiftKey){  
	        	    	$(this).toggleClass("backgroundBlue");  
	        	    }else{  
	        	    	$(".outerWrap").attr("class","")
        	    		$(this).addClass("backgroundBlue"); 
	        	    }  
	    	    }); 
				$(".outerWrap").dblclick(function (e){ 
					$("#outer_wrap li").remove(".backgroundBlue");
					$(".dropdown li").attr("class","")
					//获取右侧容器的内容
					$scope.backData();
	    	    }); 
			};
			
			//右侧回左侧
			$scope.toBack = function(){
				$("#outer_wrap li").remove(".backgroundBlue");
				$(".dropdown li").attr("class","")
				//获取右侧容器的内容
				$scope.backData();
			};
			//右侧全部回左侧
			$scope.toBackAll = function(){
				$("#outer_wrap li").remove();
				//获取右侧容器的内容
				$scope.backData();
			};
			
			//控制$watch监听开关
			$scope.afterDataNum = 0;
			//数据回显     考虑到新增和回显数据  方式重复回显
			$scope.$watch('afterData', function(newVal, oldVal, scope){
				/*
				 * 新值不等于旧值   并且旧值有数据的时候不进行回显
				 * 防止重新赋相同的值  造成重复数据
				 * oldVal.length > 0时  说明不是第一次回显数据 （考虑到单页面应用，afterData没有清除oldVal缓存问题 ）
				 * 
				 * */
				if(newVal.length != oldVal.length && oldVal.length > 0){
					return
				}
				
				/* $scope.afterDataNum 控制$watch监听开关等于0为没有进行刷新页面进行回显
				 * 并且  新值大于0  区分是新增 还是 编辑
				 * 
				 * */
				if( $scope.afterDataNum == 0 && newVal.length > 0 ){
					$scope.afterDataNum = $scope.afterDataNum + 1;
					//右侧数据回显
					for(var i = 0 ; i < $scope.afterData.length ; i++ ){
						if( $scope.type == 'cols' ){
							var mainDatas = Torch.tableCols.getName($scope.afterData[i].tableId);
							if(!$scope.afterData[i].colNameCn){
								$scope.afterDataNum = $scope.afterDataNum - 1;
								return
							}
							$("#outer_wrap").append("<li name='"+$scope.afterData[i].tableId+"' id='"+$scope.afterData[i].colName+"'>"+"<span style='color:blue;'>[ "+ mainDatas +" ] </span>"+$scope.afterData[i].colNameCn + "</li>");
						}else{
							var themeName = $scope.afterData[i].themeName || themeId;
							$("#outer_wrap").append("<li id='"+$scope.afterData[i].tableId+"'>"+"<span style='color:blue;'>[ "+ themeName +" ] </span>"+$scope.afterData[i].tableNameCn+"</li>");
						}
						
					}
					$("#outer_wrap li").click(function (e){ 
		        	    if(e.shiftKey){  
		        	    	$(this).toggleClass("backgroundBlue");  
		        	    }else{  
		        	    	$(".outerWrap").attr("class","")
	        	    		$(this).addClass("backgroundBlue"); 
		        	    }  
		    	    });
					$("#outer_wrap li").dblclick(function (e){ 
						$("#outer_wrap li").remove(".backgroundBlue");
						$(".dropdown li").attr("class","")
						//获取右侧容器的内容
						$scope.backData();
		    	    }); 
					if($scope.type == 'cols'){
						$scope.backData()
					}
					
					//绑定右侧点击事件
			        $timeout(function(){
			        	
			        	function $(id){
			                return document.getElementById(id);
			            }
			            //获取鼠标位置
			            function getMousePos(e){
			                return {
			                    x : e.pageX || e.clientX + document.body.scrollLeft,
			                    y : e.pageY || e.clientY + document.body.scrollTop
			                }
			            }
			            //获取元素位置
			            function getElementPos(el){
			                return {
			                    x : el.offsetParent ? el.offsetLeft + arguments.callee(el.offsetParent)['x'] : el.offsetLeft,
			                    y : el.offsetParent ? el.offsetTop + arguments.callee(el.offsetParent)['y'] : el.offsetTop
			                }
			            }
			            //获取元素尺寸
			            function getElementSize(el){
			                return {
			                    width : el.offsetWidth,
			                    height : el.offsetHeight
			                }
			            }
			            //禁止选择
			            document.onselectstart = function(){
			                return false;
			            }
			            //判断是否有挪动
			            var MOVE = {};
			            MOVE.isMove = false;

			            //就是创建的标杆
			            var div = document.createElement('div');
			            div.style.width = '400px';
			            div.style.height = '1px';
			            div.style.fontSize = '0';
			            div.style.background = 'red';

			            var outer_wrap = $('outer_wrap');
			            outer_wrap.onmousedown = function(event){
			        //获取列表顺序
			                var lis = outer_wrap.getElementsByTagName('li');
			                for(var i = 0; i < lis.length; i++){
			                    lis[i]['pos'] = getElementPos(lis[i]);
			                    lis[i]['size'] = getElementSize(lis[i]);
			                }
			                event = event || window.event;
			                var t = event.target || event.srcElement;
			                if(t.tagName.toLowerCase() == 'li'){
			                    var p = getMousePos(event);
			                    var el = t.cloneNode(true);
			                    el.style.position = 'absolute';
			                    el.style.left = t.pos.x + 'px';
			                    el.style.top = t.pos.y + 'px';
			                    el.style.width = t.size.width + 'px';
			                    el.style.height = t.size.height + 'px';
			                    el.style.border = '1px solid #d4d4d4';
			                    el.style.background = '#d4d4d4';
			                    el.style.opacity = '0.7';
			                    document.body.appendChild(el);

			                    document.onmousemove = function(event){
			                        event = event || window.event;
			                        var current = getMousePos(event);
			                        el.style.left =t.pos.x + current.x - p.x + 'px';
			                        el.style.top =t.pos.y + current.y - p.y+ 'px';

			                        //判断插入点
			                        for(var i = 0; i < lis.length; i++){
			                            if(current.x > lis[i]['pos']['x'] && current.x < lis[i]['pos']['x'] + lis[i]['size']['width'] && current.y > lis[i]['pos']['y'] && current.y < lis[i]['pos']['y'] + lis[i]['size']['height']/2){
			                                if(t != lis[i]){
			                                    MOVE.isMove = true;
			                                    outer_wrap.insertBefore(div,lis[i]);
			                                }

			                            }else if(current.x > lis[i]['pos']['x'] && current.x < lis[i]['pos']['x'] + lis[i]['size']['width'] && current.y > lis[i]['pos']['y'] + lis[i]['size']['height']/2 && current.y < lis[i]['pos']['y'] + lis[i]['size']['height']){
			                                if(t != lis[i]){
			                                    MOVE.isMove = true;
			                                    outer_wrap.insertBefore(div,lis[i].nextSibling);
			                                }
			                            }
			                        }
			                    }
			                    //移除事件
			                    document.onmouseup = function(event){
			                        event = event || window.event;
			                        document.onmousemove = null;
			                        if(MOVE.isMove){
			                            outer_wrap.replaceChild(t,div);
			                            MOVE.isMove = false;
			                        }
			                        document.body.removeChild(el);
			                        el = null;
			                        document.body.style.cursor = 'normal';
			                        document.onmouseup = null;
			                        $scope.backData();
			                    }
			                }
			            }
			        	
			        },500);
				}
			});
		},
		link: function(scope, ele, attrs){
			scope.$watch('beforeData', function(newVal, oldVal, scope){
				if(newVal){
					$(".dropdown li").click(function (e){ 
		        	    if(e.shiftKey){  
		        	    	$(this).toggleClass("backgroundBlue");  
		        	    }else{  
		        	    	$(".dropdown li").attr("class","")
	        	    		$(this).addClass("backgroundBlue"); 
		        	    }  
		    	    }); 
				}
			});
		}
				
	}
});
angular.module('common.cascade', []);
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
angular.module('common.data', []);
/**
 * @desc 代码集转换的过滤器
 * @param key String 代码
 * @param val String 代码值不存在时返回的值
 * @return String 代码对应的代码值
 */
angular.module('common.data').filter('dict', function(){
	return function(val, key){
		if(!key){
			return '';
		}
		if(typeof key == 'object'){
			var ret = key[val] || '';
		}else if(typeof key == 'string'){
			ret = Torch.dict.getText(key, val);
		}else{
			ret = '';
		}
		return ret;
	}
});

/**
 * @desc 代码集转换的过滤器
 * @param key String 代码
 * @param val String 代码值不存在时返回的值
 * @return String 代码对应的代码值
 */
angular.module('common.data').filter('value', function(){
	return function(val, key){
		console.log(key);
		if(!key){
			for(var i in val){
				if(val[i]=='('){
					var ret=val.substring(0,i);
					console.log(val.substring(0,i));
				}
			}
			return ret;
		}
		
		
	}
});
/**
 * @desc 时间截取
 * @param 去除时分秒，只留下日期
 * @example vm.appdatte | timeDate
 */
angular.module('common.data').filter('timeDate', function(){
	return function(val){
		if(val){
			var timeDate = val.substring(0,10);
		}
		return timeDate;
	}
});

/**
 * @显示中文
 */
angular.module('common.data').filter('codePreview', function(){
	return function(val){
		if(isNaN(val)){
			return Torch.tableCols.getName(val);
		}
		//如果是序号  不进行编译
		return val
	}
});

/**
 * @显示代码和中文
 */
angular.module('common.data').filter('codePreviews', function(){
	return function(val){
		//如果是序号  不进行编译
		if(isNaN(val)){
			var ret = Torch.tableCols.getName(val);
			if(ret == val){
				return val
			}
			return ret + '--' + val;
		}
		
		return val
	}
});

/**
 * @毫秒数转正常格式
 */
angular.module('common.data').filter('milliseconds', function(){
	return function(val){
		if(!val){
			return ''
		}
		var unixTimestamp = new Date( val ) ;
		var commonTime = unixTimestamp.toLocaleString();
		return commonTime;
	}
});


/**
 * @毫秒数转正常格式
 */
angular.module('common.data').filter('oprFilter', function(){
	return function(val){
		//等于： 1，  大于 2， 小于3， 大于等于 4，  小于等于5，包含 6， 前like7, 后like8.
		if(val == 1){
			return '等于'
		}else if(val == 2){
			return '大于'
		}else if(val == 3){
			return '小于'
		}else if(val == 4){
			return '大于等于'
		}else if(val == 5){
			return '小于等于'
		}else if(val == 6){
			return '包含'
		}else if(val == 7){
			return '匹配开头'
		}else if(val == 8){
			return '匹配结尾'
		}else if(val == 9){
			return '模糊匹配'
		}else{
			return val
		}
	}
});

/**
 * @日期转换
 */
angular.module('common.data').filter('weekFile', function(){
	return function(val){
		//等于： 1，  大于 2， 小于3， 大于等于 4，  小于等于5，包含 6， 前like7, 后like8.
		if(val == 1){
			return '星期一'
		}else if(val == 2){
			return '星期二'
		}else if(val == 3){
			return '星期三'
		}else if(val == 4){
			return '星期四'
		}else if(val == 5){
			return '星期五'
		}else if(val == 6){
			return '星期六'
		}else if(val == 7){
			return '星期七'
		}else{
			return val
		}
	}
});