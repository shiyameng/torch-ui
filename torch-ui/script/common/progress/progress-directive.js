/**
 * @desc 菜单的指令
 * @property data Number 进度条的进度值
 * @property theme String 进度条的主题样式 （默认 初始状态的样式：primary 成功状态的样式：success）
 * @example <div progress data="vm.progress"></div>
 */

angular.module('common.progress').directive('progress', function(){
	return {
		restrict: 'A',
		scope: {
			data: '=',
			theme: '@'
		},
		template:function(tEle,tAttrs){
			return getProgress();
			
			function getProgress(){
				if(tAttrs.theme == 'success'){
					return getSuccessProgress();
				}else{
					return getPrimaryProgress();
				}
			}
			
			function getSuccessProgress(){
				var tpl = '<div ng-cloak class="progress progress-sm">\
							  <div class="progress-bar progress-bar-success progress-bar-striped" role="progressbar" aria-valuenow="{{(data*100) | number}}" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em;width:{{(data*100) | number}}%">\
							    <span class="sr-only">{{(data*100) | number}}%</span>\
							  </div>\
						   </div>\
						';
				return tpl;
			}
			
			function getPrimaryProgress(){
				var tpl = '<div ng-cloak class="progress">\
							  <div class="progress-bar" role="progressbar" aria-valuenow="{{(data*100) | number}}" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em;width:{{(data*100) | number}}%">\
							    <span>{{(data*100) | number}}%</span>\
							  </div>\
						   </div>\
						';
				return tpl;
			}
		}
	};
});

