(function(){
    angular.module('app',['common'])
        .controller('nameDetailController', nameDetailController);

    nameDetailController.$inject=['dataService'];

    function nameDetailController(dataService){
        var nameid = Torch.getParam('nameid');
        var gid = Torch.getParam('gid');
        var vm = this;
        //初始化
        vm.init = init;
        //数据加载
        vm.query = query;
        //确定
        vm.determine = determine;

        function determine(){
            Torch.closewin();
        }

        //数据加载
        function query(){

        }

        //初始化
        function init(){
            var params={
                url:"/torch/service.do?fid=basicDetailQuery",
                param:{
                    basicDetailQueryForm:{
                        "nameid":nameid,
                        "gid":gid
                    }
                }
            }
            Torch.dataSubmit(params).then(function(data){
                vm.basicDetailQueryForm = data.basicDetailQueryForm;
            });
        }
        init()
    }
})();