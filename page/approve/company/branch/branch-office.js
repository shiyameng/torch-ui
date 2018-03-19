(function(){
    angular.module('app',['common'])
        .controller('branchOfficeController', branchOfficeController);
    branchOfficeController.$inject=['dataService','$filter'];
    function branchOfficeController(dataService,$filter){
        var gid = Torch.getParam('gid');
        //股东id
        var type = Torch.getParam('type');
        //分公司数据id
        var brid = Torch.getParam('brid');
        var vm = this;
        //    获取数据
        vm.query = query;
        //    初始化
        vm.init = init;
        //    保存
        vm.determine = determine;

        function determine(){
            Torch.closewin();
        }


        //    获取数据
        function query(){
            var params={
                url:"/torch/service.do?fid=basicEntUpdate",
                param:{
                    entBranchQueryForm:vm.entBranchInsertForm
                }
            }
            params.param.entBranchQueryForm.brid = brid;
            params.param.entBranchQueryForm.gid = gid;
            Torch.dataSubmit(params).then(
                function(data){
                    vm.entBranchInsertForm = data.entBranchQueryForm;
                });
        }

        //    初始化
        function init(){
            //页面数据
            vm.entBranchInsertForm = {
                //注册号
                "regno":"",
                //分支机构名称
                "brname":"",
                //统一社会信用代码
                "uniscid":"",
                //省
                "domprov":"",
                //市
                "domcity":"",
                //负责人姓名
                "name":"",
                //业务号
                "gid":"",
                //业务类型
                "operType":"30"
            }
            query();
        }

        init();
    }

})();

