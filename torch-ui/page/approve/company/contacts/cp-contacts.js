(function(){
    angular.module('app',['common'])
        .controller('contactsController', contactsController);

    contactsController.$inject=['dataService'];

    function contactsController(dataService){
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

        function query(){
            var params={
                url:"/torch/service.do?fid=otherEnterpriseQuery",
                param:{
                    otherEnterpriseQueryDetail : {
                        lmid :lmid
                    }
                }
            }
            Torch.dataSubmit(params).then(function(data){
                vm.cpContacts = data.otherEnterpriseQueryDetail;
                if(vm.cpContacts.certype == ''){
                    vm.cpContacts.certype ='10';
                }

            });
        }

        function determine(){
            var params={
                url:"/torch/service.do?fid=otherEnterpriseUpdate",
                param:{
                    otherEnterpriseUpdateForm : vm.cpContacts
                },
                validate:'cpEdit'
            }
            Torch.dataSubmit(params).then(function(data){
                Torch.closewin();
            });
        }
        function init(){
            vm.cpContacts = {
                certype:'10'
            };
            query()
        }
        init();
    }
})();

