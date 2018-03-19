/**
 * @desc 申请信息页面的经营范围的选择用的指令
 * @property data 从父控制器中获取经验范围的数据
 * @property value 从外层控制器中获取textare中的值（如果有的话）
 */
angular.module('common.radio').directive('radioSelect', function(){
	return {
		link:function(scope,ele,attr){
			
			ele.on("click",function(){
				//得到行业代码
				scope.code=$($($(event.target)[0].parentElement)[0].parentElement)[0].children[2].innerHTML;
				//得到主营业务
				scope.business=$($($(event.target)[0].parentElement)[0].parentElement)[0].children[3].innerHTML
				scope.$parent.vm.radio.code=scope.code;
				scope.$parent.vm.radio.business=scope.business;
				/*console.log(scope.$parent.vm.radio.code);*/
			})
		}
	};
});

