(function(){
    angular.module('app',['common'])
        .controller('invInfoController', invInfoController);

    invInfoController.$inject=['dataService'];

    function invInfoController(dataService){
        var gid = Torch.getParam('gid');
        var nameid = Torch.getParam('nameid');
        //判断编辑（0）还是添加（1）
        var editAdd = Torch.getParam('editAdd');
        //该条数据的标识 投资人id
        var invid = Torch.getParam('invid');
        var vm = this;
        //初始化
        vm.init = init;
        //数据加载
        vm.query = query;
        //保存
        vm.save = save;
        //重置
        vm.reset = reset
        //选中证件类型的回调
        vm.selectCerType = selectCerType;
        //判断是否为非自然人
        vm.isEntInv = false;
        vm.selectInvType = selectInvType;
        
        function selectInvType(invtype){
        	if(
                invtype == 20 ||
                invtype == 22 ||
                invtype == 30 ||
                invtype == 35 ||
                invtype == 36 ||
                invtype == 90 ||
                invtype == 21
              ){
                vm.isEntInv = false;
              }else{
            	  vm.isEntInv = true;
              }
        }
        
        function selectCerType(certype){
        	if(certype == '10'){
        		$('#cerno').attr('rule', 'must;idcard');
        	}else{
        		$('#cerno').attr('rule', 'must');
        	}
		}
        //保存
        function save(){
            if(editAdd == 1){
                //新增
                vm.obj = {
                    url:'/torch/service.do?fid=investorInsert',
                    param:{
                        investorInsertForm:vm.investorInsertForm
                    },
                    validate: 'invInfo'
                };
                vm.obj.param.investorInsertForm.gid = gid;
                vm.obj.param.investorInsertForm.nameid = nameid;

            }else if(editAdd == 0){
                //编辑
                vm.obj = {
                    url:'/torch/service.do?fid=investorUpdate',
                    param:{
                        investorUpdateForm:vm.investorInsertForm
                    },
                    validate: 'invInfo'
                };
                vm.obj.param.investorUpdateForm.gid = gid;
                vm.obj.param.investorUpdateForm.nameid = nameid;
            }

            Torch.dataSubmit(vm.obj).then(function(data){
                Torch.closewin();
            });
        }
        //重置
        function reset(){
            vm.investorInsertForm = {
                "invtype":"",
                "cerno":"",
                "country":"",
                "certype":"",
                "subconam":"",
                "inv":""
            }
        }

        //数据加载
        function query(){
            var params={
                url:"/torch/service.do?fid=investorQuery",
                param:{
                    investorQueryForm : {
                        _condition: {
                            invid:invid
                        }
                    }
                }
            }
            Torch.dataSubmit(params).then(function(data){
                vm.investorInsertForm = data.investorQueryForm;
                vm.selectInvType(vm.investorInsertForm.invtype);
            });
        }

        //初始化
        function init(){
            vm.investorInsertForm = {
                "invtype":"",
                "cerno":"",
                "country":"156",
                "certype":"",
                "subconam":"",
                "inv":""
            }
            if(editAdd == 0){
                query();
            }
        }
        init()
    }
})();