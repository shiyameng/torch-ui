(function(){
	angular.module('app', ['common'])
	.controller("PinyinController",PinyinController);
	//注入依赖
	PinyinController.$inject = ['$scope','dataService'];
	
	function PinyinController($scope, dataService){
		var vm = this;
		//多音字的数据结构[{text:"张",value:"zhang",pinyin:[{text:"zhang",value:"zhang"},{text:"chang",value:"chang"}]}]
		vm.word = [];
		//确定多音字的方法
		vm.selectPinyin = selectPinyin;
		
		function selectPinyin(){
			var pinyin = [];
			for(var i = 0, len = vm.word.length; i < len; i++){
				var item = vm.word[i];
				var value = item.value;
				if(!value){
					Torch.info('请选择多音字的拼音', 'error');
					return;
				}
				pinyin.push(item.value);
			}
			Torch.closewin(pinyin.join('_'));
		}
		
		/*function checkPinyin(){
			var enttra = Torch.getWinParam();
			var pinParams = {
				url: '/enttra/queryTraPinyin.do',
				validate: 'nmInfo',
				param: {
					enttra: enttra
				}
			}
			//校验是否有多音字
			Torch.dataSubmit(pinParams).then(function(data){
				renderPinyin(data);	
			});
		}
		
		function renderPinyin(data){
			
			if(!data){
				return;
			}
			for(var i = 0, len = data.length; i < len; i++){
				var item = data[i];
				vm.word[i] = {};
				vm.word[i].text = item.text;
				vm.word[i].value = '';
				vm.word[i].pinyin = [];
				var pinyin = item.value;
				if(pinyin){
					for(var j = 0, jlen = pinyin.length; j < jlen; j++){
						var jitem = pinyin[j];
						if(jitem){
							var pinyinItem = {
								text:jitem,
								value:jitem
							}
							vm.word[i].pinyin.push(pinyinItem);
						}
					}
					if(pinyin.length == 1){
						vm.word[i].value = pinyin[0];
					}
				}
			}
		}*/
		
		function init(){
			vm.word = Torch.getWinParam();
		}
		
		init();
	}
})();
