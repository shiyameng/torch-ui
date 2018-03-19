(function(){
angular.module('app',['common'])
.controller('MemberAddController',MemberAddController)

MemberAddController.$inject = ['dataService'];

function MemberAddController(dataService){
    //gid
    var gid = Torch.getParam('gid');
    //判断编辑还是添加 0 - 添加  1 - 编辑
    var editAdd = Torch.getParam('editAdd');
    //用户标志
    var pripid = Torch.getParam('pripid');
    //对应每条数据的标识
    var personid = Torch.getParam('personid');
    //用来区分公司设立还是公司变更  30 ：为公司变更 20 :公司设立
    var opertype = Torch.getParam('opertype');
    var vm = this;
    //初始化
    vm.init = init;
    //获取数据
    vm.query = query;
    //保存
    vm.memberSave = memberSave;
    //添加职务
    vm.addDuties = addDuties;
    //删除
    vm.delDuties = delDuties;
    //证件类型改变校验
    vm.certype = certype;

    function certype(){
        if( vm.memQueryForm.certype == 10){
            $('#cerno').attr('rule', 'must;idcard');
        }else{
            $('#cerno').attr('rule', 'must');
        }
    }

    function memberSave(){
        if(vm.jobQueryList.length == 2 && vm.jobQueryList[0].position == vm.jobQueryList[1].position){
            Torch.info('不可以有相同职位','danger');
            return
        }

        //添加
        if( editAdd == 0){
            vm.obj = {
                url:'/torch/service.do?fid=memInsert_00050043285',
                param: {
                    "memInsertForm":vm.memQueryForm
                },
                validate:'memberEdit'
            };
            vm.obj.param.memInsertForm.jobInfo = vm.jobQueryList;
            vm.obj.param.memInsertForm.gid = gid;
            vm.obj.param.memInsertForm.pripid = pripid;
            vm.obj.param.memInsertForm.operType = opertype;
            vm.obj.param.memInsertForm.dom = Torch.dict.getText('CA01', vm.memQueryForm.domprov) + Torch.dict.getText('CA01',vm.memQueryForm.domcity) + Torch.dict.getText('CA01',vm.memQueryForm.domcounty) +vm.memQueryForm.domother;
        }else{
            //编辑
            vm.obj = {
                url:'/torch/service.do?fid=memUpdate_30000057282',
                param: {
                    "memUpdateForm":vm.memQueryForm
                },
                validate:'memberEdit'
            };
            vm.obj.param.memUpdateForm.jobInfo = vm.jobQueryList;
            vm.obj.param.memUpdateForm.personid = personid;
            vm.obj.param.memUpdateForm.operType = opertype;
            vm.obj.param.memUpdateForm.dom = Torch.dict.getText('CA01', vm.memQueryForm.domprov) + Torch.dict.getText('CA01',vm.memQueryForm.domcity) + Torch.dict.getText('CA01',vm.memQueryForm.domcounty) +vm.memQueryForm.domother;
        }

        Torch.dataSubmit(vm.obj).then(function(data){
            Torch.closewin();
        })
    }

    //添加职务
    function addDuties(){
        if(vm.jobQueryList.length < 2){
            vm.jobQueryList.push({
                "position":"", //职务
                "posbrform":"02", //生产方式
                "offyear":3
            });
        }else{
            Torch.info('最多添加两个职位','danger');
        }
    }

    //删除
    function delDuties(index){
        vm.jobQueryList.splice(index,1);
    }

    //获取数据
    function query(){
        var obj = {
            url: '/torch/service.do?fid=memQuery',
            param: {
                memQueryForm:{
                    _condition: {
                        personid :personid
                    }
                },
                jobQueryList:{
                    _condition: {
                        personid :personid
                    }
                }
            }
        }
        Torch.dataSubmit(obj).then(function(data){
            vm.memQueryForm = data.memQueryForm;
            vm.jobQueryList = data.jobQueryList._data;
            //判断证件类型对应的校验
            certype();
        })
    }

    function init(){
        vm.memQueryForm = {
            //姓名
            name: "",
            //证件类型
            certype: "10",
            //证件号码
            cerno: "",
            //性别
            sex: "1",
            //国别
            country: "156",
            //联系电话
            tel: "",
            //出生日期
            natdate: "",
            //省
            domprov:"",
            //市
            domcity: "",
            //区
            domcounty: "",
            //其他地方
            domother: ""
        };

        vm.jobQueryList = [
            {
                "position":"", //职务
                "posbrform":"02", //生产方式
                "offyear":3
            }
        ];
        if(editAdd == 0){

        }else{
            query();
        }
    }
    init();
}
})();

