(function(){
    angular.module('app',['common'])
        .controller('changeController',changeController)

    changeController.$inject = ['dataService'];

    function changeController(dataService){
        var vm = this;
        var gid = Torch.getParam('gid');
        //初始化
        vm.init = init;
        //获取数据
        vm.query = query;
        //经营范围的修改
        vm.modify = modify;
        //主要人员的详情
        vm.memberDetails = memberDetails;
        //分公司详情
        vm.brancOfficeDetails = brancOfficeDetails;
        //自然人详情
        vm.invDetails = invDetails;
        //非自然人详情
        vm.entInvDetails = entInvDetails;
        //审批意见弹出框
        vm.opinion = opinion;

        //审批意见弹出框
        function opinion(){
            var config = {
                url:'../approval/cp-1100-opinion.html?gid='+gid+'&opertype=30',
                title:'审批意见',
                size:'lg'
            }
            Torch.openwin(config).then(function(){
                Torch.info('保存成功,自动跳转我的任务页面');
                $timeout(function() {
                    Torch.redirect('../../task/task.html');
                }, 1000);

            });
        }

        //自然人详情
        function invDetails(invid){
            var config = {
                url:'../inv/inv-1100-details.html?gid='+gid+'&invid='+invid,
                title:'股东 - 自然人详情',
                size:'lg'
            }
            Torch.openwin(config);
        }

        //非自然人详情
        function entInvDetails(invid){
            var config = {
                url:'../inv/entinv-1100-details.html?gid='+gid+'&invid='+invid,
                title:'股东 - 非自然人详情',
                size:'lg'
            }
            Torch.openwin(config);
        }

        //分公司详情
        function brancOfficeDetails(brid){
            var config = {
                url:'../branch/branch-office.html?gid='+gid+'&type=1&brid='+brid,
                title:'分公司详情'
            }
            Torch.openwin(config);
        }

        //主要人员的详情
        function memberDetails(personid){
            var config = {
                url:'../member/member-1100-details.html?gid='+gid+'&pripid='+vm.pripid+'&personid='+personid,
                title:'主要人员详情'
            }
            Torch.openwin(config);
        }

        //经营范围的修改
        function modify(){

            if(vm.modifyName == '保存'){

                vm.obj = {
                    url:'/torch/service.do?fid=basicEntUpdate&gid='+gid,
                    param:{
                        "entOpscopeUpdateForm" : {
                            "opscope" : vm.basicEntQueryForm.opscope,
                            "pripid" : vm.pripid
                        }
                    },
                    validate:'modifyChange'
                };
                Torch.dataSubmit(vm.obj).then(function(data){
                    query();
                    vm.modifyShow = vm.modifyShow == false?true:false;
                    vm.modifyName = vm.modifyName ==  '修改'?'保存':'修改';
                });
            }else{
                vm.modifyShow = vm.modifyShow == false?true:false;
                vm.modifyName = vm.modifyName ==  '修改'?'保存':'修改';
            }
        }


        //获取数据
        function query(){

            vm.obj = {
                url:'/torch/service.do?fid=basicChangeQuery&gid='+gid,
                param:{
                    //查询公司企业名称、住所、营业期限、经营范围组件
                    basicEntQueryForm: {},
                    //查询公司注册资金组件
                    basicRegcapForm: {},
                    //查询法定代表人组件
                    basicLerepQueryForm: {},
                    //查询自然人股东信息组件
                    basicInvQueryList: {
                        _paging: {pageNo: 1, pageSize: 10, total: ''},
                        _condition:{}
                    },
                    //查询非自然人股东信息组件
                    basicCpInvQueryList: {
                        _paging: {pageNo: 1, pageSize: 10, total: ''},
                        _condition:{}
                    },
                    //查询主要人员信息组件
                    basicMemQueryList: {
                        _paging: {pageNo: 1, pageSize: 10, total: ''},
                        _condition:{}
                    },
                    //查询分支机构信息组件
                    basicBranchQueryList: {
                        _paging: {pageNo: 1, pageSize: 10, total: ''},
                        _condition:{}
                    },
                    //许可信息变更前
                    basicRsLicenseQueryList: {
                        _paging: {pageNo: 1, pageSize: 10, total: ''},
                        _data:{}
                    },
                    //许可信息变更前
                    basicWkLicenseQueryList: {
                        _paging: {pageNo: 1, pageSize: 10, total: ''},
                        _data:{}
                    }
                }
            };
            Torch.dataSubmit(vm.obj).then(function(data){
                //主要人员数据
                vm.basicMemQueryList = data.basicMemQueryList._data;
                //主要人员数据分页
                vm.basicMemQueryListPage = data.basicMemQueryList._paging;
                //自然人
                vm.basicInvQueryList = data.basicInvQueryList._data;
                //自然人分页
                vm.basicInvQueryListPage = data.basicInvQueryList._paging;
                //非自然人
                vm.basicCpInvQueryList = data.basicCpInvQueryList._data;
                //非自然人分页
                vm.basicCpInvQueryListPage = data.basicCpInvQueryList._paging;
                //企业名称 住所 营业范围 经营范围
                vm.basicEntQueryForm = data.basicEntQueryForm;
                //注册资本
                vm.basicRegcapForm = data.basicRegcapForm;
                //法人代表
                vm.basicLerepQueryForm = data.basicLerepQueryForm;
                //变更后法人代表回填
                if(data.basicLerepQueryForm){
                    vm.legalName.value = data.basicLerepQueryForm.personid;
                }
                //
                vm.pripid = data.basicEntQueryForm.pripid;
                //分公司信息
                vm.basicBranchQueryList = data.basicBranchQueryList._data;
                //分公司信息分页
                vm.basicBranchQueryListPage = data.basicBranchQueryList._paging;
                //许可信息变更后
                vm.basicRsLicenseQueryList = data.basicRsLicenseQueryList._data;
                //许可信息变更前
                vm.basicWkLicenseQueryList = data.basicWkLicenseQueryList._data;
            });
        }

        //初始化
        function init(){

            //经办人信息
            var obj = {
                url:'/torch/service.do?fid=applysQuery',
                param:{
                    "applyForm": {
                        "gid": gid
                    }
                }
            };

            //变更中的选择项
            var param = {
                url:'/approve/cp/checkIsHaveChangeItem/isHaveChangeItem.do?gid='+gid
            };
            Torch.dataSubmit(param).then(function(data){

                query();

                for(var i in data) {
                    if( i == 'nameChange'){
                        //控制显示 - 企业名称
                        vm.nameChange = true;
                    }else if(i == 'addressChange'){
                        //控制显示 - 住所变更
                        vm.addressChange = true;
                    }else if(i == 'termChange'){
                        //控制显示 - 营业期限
                        vm.termChange = true;
                    }else if(i == 'scopeChange'){
                        //控制显示 - 经营范围
                        vm.scopeChange = true;
                    }else if(i == 'invChange'){
                        //控制显示 - 股东
                        vm.invChange = true;
                    }else if(i == 'regcapChange'){
                        //控制显示 - 注册资本
                        vm.regcapChange = true;
                    }else if(i == 'memChange'){
                        //控制显示 - 主要人员
                        vm.memChange = true;
                    }else if(i == 'lerepChange'){
                        //控制显示 - 法定代表人
                        vm.lerepChange = true;
                    }else if(i == 'branchChange'){
                        //控制显示 - 分公司
                        vm.branchChange = true;
                    }
                }
            });


            Torch.dataSubmit(obj).then(function(data){
                vm.applyForm = data.applyForm;
            })

            //控制显示 - 企业名称
            vm.nameChange = false;
            //控制显示 - 住所变更
            vm.addressChange = false;
            //控制显示 - 营业期限
            vm.termChange = false;
            //控制显示 - 经营范围
            vm.scopeChange = false;
            //控制显示 - 股东
            vm.invChange = false;
            //控制显示 - 注册资本
            vm.regcapChange = false;
            //控制显示 - 主要人员
            vm.memChange = false;
            //控制显示 - 法定代表人
            vm.lerepChange = false;
            //控制显示 - 分公司
            vm.branchChange = false;

            //选择设为法人的职位
            vm.legalDuties = [];
            //设为法定代表人填出框
            vm.selectManTpl = 'selectManTpl.html';
            //营业期限
            vm.termEdit = '';
            //修改的内容
            vm.modifyEdit = '';
            //修改的编辑
            vm.modifyShow = false;
            //修改的按钮
            vm.modifyName = '修改';
            //主要人员数据
            vm.mainChange = [];
            //自然人
            vm.basicInvQueryList = [];
            //非自然人
            vm.basicCpInvQueryList = [];
            //企业名称 住所 营业范围 经营范围
            vm.basicEntQueryForm = {};
            //注册资本
            vm.basicRegcapForm = {};
            //法人代表
            vm.basicLerepQueryForm = {};
            //法人选项
            vm.legalName = {
                value:'',
                data:[]
            };
        }
        init();

    }
})();

