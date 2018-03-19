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
        //
        var pripid = Torch.getParam('pripid');
        var vm = this;
        //    获取数据
        vm.query = query;
        //    初始化
        vm.init = init;
        //    保存
        vm.saveInfo = saveInfo;

        function saveInfo(){
            //type = 0 我新增 type = 1 为编辑
            if(type == 0){
                //新增
                var params={
                    url:"/torch/service.do?fid=basicEntUpdate",
                    param:{
                        entBranchInsertForm:vm.entBranchInsertForm
                    },
                    validate:'branchOffice'
                }
                params.param.entBranchInsertForm.gid = gid;
                params.param.entBranchInsertForm.pripid = pripid;
            }else if(type == 1){
                //编辑
                params={
                    url:"/torch/service.do?fid=basicEntUpdate",
                    param:{
                        entBranchUpdateForm:vm.entBranchInsertForm
                    },
                    validate:'branchOffice'
                }
                params.param.entBranchUpdateForm.brid = brid;
                params.param.entBranchUpdateForm.gid = gid;
                params.param.entBranchUpdateForm.operType = 30;
            }

            Torch.dataSubmit(params).then(
                function(data){
                    Torch.closewin();
                });
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
            //type = 1 为编辑 type = 0 我新增
            if(type == 1){
                query();
            }
        }

        init();
    }

})();

