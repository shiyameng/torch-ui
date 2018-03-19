(function(){
    angular.module('app',['common'])
        .controller('licenseController',licenseController)

    licenseController.$inject = ['dataService'];

    function licenseController(dataService){
        var vm = this;
        var gid = Torch.getParam('gid');
        var pripid = Torch.getParam('pripid');
        //初始化
        vm.init = init;
        //保存确定
        vm.determine = determine;

        //保存确定
        function determine(){
            var params={
                url:"/torch/service.do?fid=scopePreInsert",
                param:{
                    scopePreInsertForm:vm.scopePreInsertForm
                },
                validate:'prelicense'
            }
            params.param.scopePreInsertForm.gid = gid;
            params.param.scopePreInsertForm.pripid = pripid;
            params.param.scopePreInsertForm.lictype = '1';
            params.param.scopePreInsertForm.operType = '30';
            Torch.dataSubmit(params).then(
                function(data){
                    Torch.closewin(vm.scopePreInsertForm);
                });
        }

        function init(){
            vm.scopePreInsertForm = {
                licno:"",                                  //许可文件文号
                licname:"",                                //许可机关
                licanth:"" ,                               //许可文件名称
                valfrom:"",                                //有效期自
                valto:"",                                  //有效期至
                licstate:"1"                                //许可文件状态
            }
        }
        init()
    }


})();

