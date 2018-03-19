(function(){
angular.module('app',['common'])
.controller('MemberAddController',MemberAddController)

MemberAddController.$inject = ['dataService'];

function MemberAddController(dataService){
    //gid
    var gid = Torch.getParam('gid');
    //用户标志
    var pripid = Torch.getParam('pripid');
    //对应每条数据的标识
    var personid = Torch.getParam('personid');
    var vm = this;
    //初始化
    vm.init = init;
    //获取数据
    vm.query = query;
    //确定
    vm.determine = determine;

    //确定
    function determine(){
        Torch.closewin();
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

        query();
    }
    init();
}
})();

