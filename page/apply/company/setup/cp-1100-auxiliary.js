(function(){
    angular.module('app',['common'])
        .controller('auxiliaryController',auxiliaryController)

    auxiliaryController.$inject = ['dataService'];

    function auxiliaryController(dataService){
        var vm = this;
        var gid = Torch.getParam('gid');
        var opertype = Torch.getParam('opertype');
        var type = Torch.getParam('type');

        //初始化
        vm.init = init;
        //提交按钮
        vm.saveSetup = saveSetup;

        function saveSetup(){
            Torch.closewin();
        }

        function init(){
            vm.saveSetupButton = false;

            //列表数据
            vm.auxiliaryData = [];

            if( opertype == 20 ){
                vm.obj = {
                    url:'/ruletest/runAppCode.do?gid='+gid+"&appCode=companySetup",
                    param:{}
                };
            }else if( opertype == 30 ){
                vm.obj = {
                    url:'/ruletest/runAppCode.do?gid='+gid+"&appCode=companyChange",
                    param:{}
                };
            }

            Torch.dataSubmit(vm.obj).then(function(data){
                if(data.length > 0){
                    vm.auxiliaryData = data;
                }
                for( var i = 0 ; i < data.length ; i++ ){
                    if(data[i].type == 1){
                        vm.saveSetupButton = false;
                        return
                    }
                }

                //type == 1时  代表点的是辅助审查按钮
                if(type == 0){
                    vm.saveSetupButton = true;
                }
            })
        }
        init();
    }
})();

