(function(){
    angular.module('app',['common'])
        .controller('auxiliaryController',auxiliaryController)

    auxiliaryController.$inject = ['dataService'];

    function auxiliaryController(dataService){
        var vm = this;
        vm.isShowContinue = false;
        vm.continueSubmit = continueSubmit;
        
        function continueSubmit(){
        	Torch.closewin(true);
        }
        
        function renderContinue(){
        	for(var i = 0, len = vm.auxiliaryData.length; i < len; i++){
        		var item = vm.auxiliaryData[i];
        		if(item.type == '1'){
        			vm.isShowContinue = false;
        			return;
        		}
        	}
        	vm.isShowContinue = true;
        }

        function init(){
            vm.auxiliaryData = Torch.getWinParam();
            //如果type为1为提交，如果为0 为辅助审查
            var type = Torch.getParam('type');
            if(type){
            	renderContinue();
            }
        }
        init();
    }
})();

