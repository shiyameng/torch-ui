(function(){
    angular.module('app',['common'])
        .controller('financeController', financeController);

    financeController.$inject=['dataService'];

    function financeController(dataService){
        var vm = this;
        //获取页面的gid
        var gid = Torch.getParam('gid');
        //获取页面的获取页面的lmid
        var lmid = Torch.getParam('lmid');

        //页面初始化
        vm.init = init;
        //确定
        vm.determine = determine;
        //获取数据
        vm.query = query;
        //证件类型改变校验
        vm.certype = certype;

        function certype(){
            if( vm.financeContacts.certype == 10){
                $('#cerno').attr('rule', 'must;idcard');
            }else{
                $('#cerno').attr('rule', 'must');
            }
        }

        function query(){
            var params={
                url:"/torch/service.do?fid=otherFinanceQuery",
                param:{
                    otherFinanceQueryDetail : {
                        lmid :lmid
                    }
                }
            }
            Torch.dataSubmit(params).then(function(data){
                vm.financeContacts = data.otherFinanceQueryDetail;
                if(vm.financeContacts.certype == ''){
                    vm.financeContacts.certype = '10';
                }
                certype();
            });
        }

        function determine(){
            var params={
                url:"/torch/service.do?fid=otherFinanceUpdate",
                param:{
                    otherFinanceUpdateForm : vm.financeContacts
                },
                validate:'financeEdit'
            }
            Torch.dataSubmit(params).then(function(data){
                Torch.closewin();
            });
        }
        function init(){
            vm.financeContacts = {
                certype:'10'
            };
            query()
        }
        init();
    }
})();