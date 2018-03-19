
angular.module('app', ['common','ngRoute'])
    .config(config)
function config($routeProvider) {
    $routeProvider.when('/manageChange', {
        templateUrl : 'cp-1100-manage.html'
    }).when('/manageChange/:nameid/:gid', {
        templateUrl : 'cp-1100-manage.html'
    }).when('/applyChange/:nameid/:gid', {
    //}).when('/applyChange', {
        templateUrl : 'cp-1100-apply.html'
    }).when('/supplyChange/:nameid/:gid', {
    //}).when('/supplyChange', {
        templateUrl : 'cp-1100-supply.html'
    }).otherwise({
        redirectTo : '/manageChange'
    });
}

//总conteroller
(function(){
    angular.module('app').controller('changeController',changeController);

    changeController.$inject = ['$scope','dataService','$location','$routeParams'];

    function changeController($scope,dataService,$location,$routeParams){
        var vm = this;
        var gid = Torch.getParam('gid');
        var nameid = Torch.getParam('nameid');
        var pripid = Torch.getParam('pripid');

        //判断是否完成经办人的填写
        if(gid && window.location.href.indexOf('#/manageChange/') < 0 && window.location.href.indexOf('#/applyChange/') < 0 && window.location.href.indexOf('#/supplyChange/') < 0){
            $location.path('/manageChange/'+nameid +'/'+gid)
        }

        //页面的跳转 没有gid时不让跳转
        $scope.url = function(data){
            if($routeParams.gid !== undefined){
                $location.path('/'+data+'/'+$routeParams.nameid+'/'+$routeParams.gid)
            }else{
                Torch.info('请完成经办人的填写，并保存','danger');
            }
        }

        //判断tab样式
        $scope.navCss = function(){
            if( window.location.href.indexOf('/supplyChange') > 0 ){
                $scope.manage = '';
                $scope.apply = '';
                $scope.supply = true;
            }else if( window.location.href.indexOf('/applyChange') > 0 ){
                $scope.manage = '';
                $scope.apply = true;
                $scope.supply = '';
            }else{
                $scope.manage = true;
                $scope.apply = '';
                $scope.supply = '';
            }
        }
        $scope.navCss();

        //加载完view后的回调
        vm.loadView = loadView;

        function loadView(){
            $scope.navCss();
        }
    }
})();


// 业务办理
(function(){
    angular.module('app')
        .controller('manageController',manageController)
    manageController.$inject = ['dataService','modalService','$scope','$location','$routeParams'];
    function manageController(dataService,modalService,$scope,$location,$routeParams){
        var vm = this;
        var nameid = Torch.getParam('nameid');
        var pripid = Torch.getParam('pripid');
        var gid = Torch.getParam('gid');
        //给表格添加一行
        vm.addInfo = addInfo;
        //删除指定行
        vm.delInfo = delInfo;
        //保存
        vm.saveInfo = saveInfo;
        //业务办理页面获取数据
        vm.query = query;
        //查询企业类型
        vm.enterprise = enterprise;
        //下一步
        vm.nextStep = nextStep;
        //证件类型改变校验
        vm.certype = certype;

        function certype(){
            if( vm.applyForm.certype == 10){
                $('#cerno').attr('rule', 'must;idcard');
            }else{
                $('#cerno').attr('rule', 'must');
            }
        }

        //下一步
        function nextStep(){
            if($routeParams.gid !== undefined){
                //修改
                vm.obj = {
                    url:'/torch/service.do?fid=applysUpdate',
                    param:{
                        "applyUpdateForm":vm.applyForm
                    },
                    validate: 'manageChange'
                };
                vm.obj.param.applyUpdateForm.docList = vm.applydocList.applydocs;
                vm.obj.param.applyUpdateForm.gid = $routeParams.gid;
                //用来区分公司设立还是公司变更  30 ：为公司变更 20 :公司设立
                vm.obj.param.applyUpdateForm.operType = 30;

                Torch.dataSubmit(vm.obj)
                    .then(function(data){
                        //Torch.info('保存成功，跳转到申请信息页');
                        $location.path('/applyChange/'+$routeParams.nameid+'/'+$routeParams.gid)
                    });
            }else{
                Torch.info('请完成经办人的填写，并保存','danger');
            }
        }

        //查询企业类型
        function enterprise(){
            var obj = {
                url:'/torch/service.do?fid=entTypeQuery',
                param:{
                    "entTypeDetail":{
                        "nameid": nameid
                    }
                }
            };
            Torch.dataSubmit(obj).then(function(data){
                vm.entTypeDetail = data.entTypeDetail;
            })
        }

        //添加材料名称
        function addInfo(){
            var newObj = {};
            vm.applydocList.applydocs.push(newObj);
        }
        //删除
        function delInfo(index){
            vm.applydocList.applydocs.splice(index,1);
        }

        //保存按钮
        function saveInfo(){

            //没有gid时 保存按钮进新增入口
            if($routeParams.gid == undefined ){
                //新增
                vm.obj = {
                    url:'/torch/service.do?fid=applysInsert',
                    param:{
                        "applysInsertForm":vm.applyForm
                    },
                    validate: 'manageChange'
                };
                vm.obj.param.applysInsertForm.docList = vm.applydocList.applydocs;
                vm.obj.param.applysInsertForm.nameid = nameid;
                vm.obj.param.applysInsertForm.rspripid = pripid;
            }else{
                //修改
                vm.obj = {
                    url:'/torch/service.do?fid=applysUpdate',
                    param:{
                        "applyUpdateForm":vm.applyForm
                    },
                    validate: 'manageChange'
                };
                vm.obj.param.applyUpdateForm.docList = vm.applydocList.applydocs;
                vm.obj.param.applyUpdateForm.gid = $routeParams.gid;
                //用来区分公司设立还是公司变更  30为公司变更 20为公司设立
                vm.obj.param.applyUpdateForm.operType = 30;
            }
            Torch.dataSubmit(vm.obj).then(
                function(data){
                    Torch.info('保存成功');
                    //复制后台的gid进行跳转
                    if( $routeParams.gid == undefined ){
                        $location.path('/manageChange/'+Torch.getParam('nameid')+'/'+data.applysInsertForm.gid)
                    }else{
                        //刷新页面
                        query()
                        //获取企业类型
                        enterprise();
                    }
                })
        }



        //业务办理页面获取数据
        function query(){
            //如果没有gid不进行查询
            if($routeParams.gid == undefined){
                return
            }
            var obj = {
                url:'/torch/service.do?fid=applysQuery',
                param:{
                    "applyForm": {
                        "gid": $routeParams.gid
                    },
                    "applyDocList":{
                        "gid": $routeParams.gid
                    },
                    "entTypeComForm":{
                        "gid": $routeParams.gid
                    }
                }
            };

            Torch.dataSubmit(obj).then(function(data){
                vm.applyForm = data.applyForm;
                vm.applydocList.applydocs = data.applyDocList._data;
                certype();
            })
        }

        //页面初始化
        function init(){
            if($routeParams.gid == undefined ){
                //做判断是否办理过
                vm.obj = {
                    url:'/approve/cp/change/checkState.do?rspripid='+pripid,
                    param:{}
                };
                Torch.dataSubmit(vm.obj).then(function(data){

                },function(){
                    if(gid){
                        Torch.redirect('../../task/task.html');
                    }else{
                        Torch.redirect('./cp-1100-entry.html');
                    }
                });
            }

            //基本信息
            vm.applyForm = {
                "appform":"1",
                "cerno":"",
                "certype":"10",
                "linkman":"",
                "mobtel":"",
                "tel":""
            }
            //表格信息
            vm.applydocList = {
                applydocs:[
                    {"docname":"","doctype":'',"doccnt":''}
                ]
            }
            //企业类型
            vm.entTypeDetail = {
                "enttype":""
            }
            ////企业类型下拉框
            //vm.entTypeForm = {
            //    "enttype":""
            //}

            //页面获取数据
            query();
            //获取企业类型
            enterprise();
        }
        //页面数据初始化
        init();
    }
})();

//申请页面
(function(){
    angular.module('app').controller('InvSetupController', InvSetupController);

    InvSetupController.$inject = ['dataService','modalService','$scope','$routeParams','$location','$timeout'];

    function InvSetupController(dataService,modalService,$scope,$routeParams,$location,$timeout){

        var vm = this;
        var gid = Torch.getParam('gid');
        var nameid = Torch.getParam('nameid');
        //初始化
        vm.init = init;
        //获取数据
        vm.query = query;
        //企业名称变更按钮
        vm.nameChanges = nameChanges;
        //企业名称还原按钮
        vm.nameReduction = nameReduction;
        //住所保存按钮
        vm.residenceSave = residenceSave;
        //营业期限
        vm.termSave = termSave;
        //经营范围 - 修改
        vm.modify = modify;
        //经营范围 - 许可信息
        vm.licenseInformation = licenseInformation;
        //经营范围 - 许可信息编辑
        vm.licenseInformationEdit = licenseInformationEdit;
        //经营范围 - 许可信息删除
        vm.licenseInformationDel = licenseInformationDel;
        //自然人的股东编辑
        vm.invEdit = invEdit;
        //自然人的股东添加
        vm.invAdd = invAdd;
        //自然人的股东删除
        vm.invEditDel = invEditDel;
        //非自然人的编辑
        vm.entInvEdit = entInvEdit;
        //非自然人的添加
        vm.entInvAdd = entInvAdd;
        //非自然人的股东删除
        vm.entInvEditDel = entInvEditDel;
        //自然人,非自然人的撤销
        vm.shareholderRevoked = shareholderRevoked;
        //页面 住所 经营范围 保存编辑的公共方法
        vm.publicMethod = publicMethod;
        //法人的变更按钮
        vm.legalChanges = legalChanges;
        //法人变更职位的选择
        vm.setLegals = setLegals;
        //分公司添加按钮
        vm.brancOfficeAdd = brancOfficeAdd;
        //分公司编辑按钮
        vm.brancOfficeEdit = brancOfficeEdit;
        //分公司删除按钮
        vm.brancOfficeDel = brancOfficeDel;
        //分公司撤销按钮
        vm.brancOfficeRevoked = brancOfficeRevoked;
        //下一步
        vm.nextStep = nextStep;
        //上一步
        vm.previous = previous;
        //审批意见弹出框
        vm.opinion = opinion;

        function previous(){
            $location.path('/manageChange/'+$routeParams.nameid+'/'+$routeParams.gid)
        }
        function nextStep(){
            $location.path('/supplyChange/'+$routeParams.nameid+'/'+$routeParams.gid)
        }

        //审批意见弹出框
        function opinion(){
            var config = {
                url:'../setup/cp-1100-opinion.html?gid='+$routeParams.gid+'&opertype=30',
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


        //分公司编辑按钮
        function brancOfficeEdit(brid){
            var config = {
                url:'./branch-office.html?gid='+gid+'&type=1&brid='+brid,
                title:'编辑分公司'
            }
            Torch.openwin(config).then(function(){
                Torch.info('保存成功');
                query();
            });
        }

        //分公司删除按钮
        function brancOfficeDel(brid){
            Torch.confirm('是否确认删除？',
                function(){
                    var params={
                        url:"/approve/cp/modifysign/delBranch.do?brid="+brid+'&gid='+$routeParams.gid+'&operType=30',
                        param:{}
                    }
                    Torch.dataSubmit(params).then(function(data){
                        Torch.info('删除成功');
                        query();
                    });
                })
        }

        //分公司撤销按钮
        function brancOfficeRevoked(brid){
            Torch.confirm('是否确认撤销？',
                function(){
                    var params={
                        url:"/approve/cp/modifysign/recoverBranch.do?brid="+brid+'&gid='+$routeParams.gid+'&operType=30',
                        param:{}
                    }
                    Torch.dataSubmit(params).then(function(data){
                        Torch.info('撤销成功');
                        query();
                    });
                });
        }

        //分公司添加按钮
        function brancOfficeAdd(){
            var config = {
                url:'./branch-office.html?gid='+gid+'&type=0&pripid='+vm.pripid,
                title:'添加分公司'
            }
            Torch.openwin(config).then(function(){
                Torch.info('添加成功');
                query();
            });
        }


        //经营范围 - 许可信息删除
        function licenseInformationDel(licid){
            Torch.confirm('删除后数据不可恢复，是否确认删除？',
                function(){
                    var params={
                        url:"/torch/service.do?fid=basicScopePreDel",
                        param:{
                            "scopePreDel":{
                                "licid":[licid]
                            }
                        }
                    }
                    Torch.dataSubmit(params).then(function(data){
                        Torch.info('删除成功');
                        query();
                    });
                })
        }

        //经营范围 - 许可信息添加
        function licenseInformation(){
            var config = {
                url:'./license-information.html?gid='+$routeParams.gid+'&pripid='+vm.pripid,
                title:'添加许可证书'
            }
            Torch.openwin(config).then(function(){
                Torch.info('保存成功');
                query();
            });
        }
        //经营范围 - 许可信息编辑
        function licenseInformationEdit(){
            var config = {
                url:'./license-information.html?gid='+$routeParams.gid+'&pripid='+vm.pripid,
                title:'编辑许可证书'
            }
            Torch.openwin(config).then(function(){
                Torch.info('保存成功');
                query();
            });
        }

        //自然人的股东编辑
        function invEdit(data){
            var config = {
                url:'./inv-1100-edit.html?gid='+$routeParams.gid+'&invid='+data+'&operType=30',
                title:'修改自然人股东信息',
                size:'lg'
            }
            Torch.openwin(config).then(function(){
                Torch.info('保存成功');
                query();
            });
        }
        //自然人的股东添加
        function invAdd(){
            var config = {
                url:'./inv-1100-edit.html?gid='+$routeParams.gid+'&pripid='+vm.pripid,
                title:'添加自然人股东信息',
                size:'lg'
            }
            Torch.openwin(config).then(function(){
                Torch.info('保存成功');
                query();
            });
        }

        //自然人的删除
        function invEditDel(data){
            Torch.confirm('是否确认删除？',
                function(){
                    var params={
                        url:"/approve/cp/modifysign/delInv.do?invid="+data+'&gid='+$routeParams.gid+'&operType=30',
                        param:{}
                    }
                    Torch.dataSubmit(params).then(function(data){
                        Torch.info('删除成功');
                        query();
                    });
                });
        }

        //非自然人的股东编辑
        function entInvEdit(data){
            var config = {
                url:'./entinv-1100-edit.html?gid='+$routeParams.gid+'&invid='+data,
                title:'修改非自然人股东信息',
                size:'lg'
            }
            Torch.openwin(config).then(function(){
                Torch.info('保存成功');
                query();
            });
        }
        //非自然人的股东添加
        function entInvAdd(){
            var config = {
                url:'./entinv-1100-edit.html?gid='+$routeParams.gid+'&pripid='+vm.pripid,
                title:'添加非自然人股东信息',
                size:'lg'
            }
            Torch.openwin(config).then(function(){
                Torch.info('保存成功');
                query();
            });
        }

        //非自然人的删除
        function entInvEditDel(data){
            Torch.confirm('删除后数据不可更改，是否确认删除？',
                function(){
                    var params={
                        url:"/approve/cp/modifysign/delInv.do?invid="+data+'&gid='+$routeParams.gid+'&operType=30',
                        param:{}
                    }
                    Torch.dataSubmit(params).then(function(data){
                        Torch.info('删除成功');
                        query();
                    });
                });
        }

        //自然人,非自然人的撤销
        function shareholderRevoked(data){
            Torch.confirm('是否确认撤销？',
                function(){
                    var params={
                        url:"/approve/cp/modifysign/recoverInv.do?invid="+data+'&gid='+$routeParams.gid+'&operType=30',
                        param:{}
                    }
                    Torch.dataSubmit(params).then(function(data){
                        Torch.info('撤销成功');
                        query();
                    });
                });
        }



        //主要人员的添加
        vm.memberAdd = memberAdd;
        //主要人员的编辑
        vm.memberEdit = memberEdit;
        //主要人员 - 删除按钮
        vm.mainDel = mainDel;
        //主要人员 - 撤销按钮
        vm.mainRevoked = mainRevoked;

        //主要人员 - 撤销按钮
        function mainRevoked(data){
            Torch.confirm('是否确认撤销？',
                function(){
                    var params={
                        url:"/approve/cp/modifysign/recoverMem.do?personid="+data+'&gid='+$routeParams.gid+'&operType=30',
                        param:{}
                    }
                    Torch.dataSubmit(params).then(function(data){
                        Torch.info('撤销成功');
                        query();
                    });
                });
        }

        //主要人员 - 删除按钮
        function mainDel(data){
            Torch.confirm('是否确认删除？',
                function(){
                    var params={
                        url:"/approve/cp/modifysign/delMem.do?personid="+data+'&gid='+$routeParams.gid+'&operType=30',
                        param:{}
                    }
                    Torch.dataSubmit(params).then(function(data){
                        Torch.info('删除成功');
                        query();
                    });
                });
        }

        //添加主要人员弹出框
        function memberAdd(){
            // 0 - 添加  1 - 编辑
            var config = {
                url:'../member/member-1100-edit.html?gid='+$routeParams.gid+'&editAdd=0&pripid='+vm.pripid+'&opertype=30',
                title:'添加主要人员',
                size:'lg'
            }
            Torch.openwin(config).then(function(){
                Torch.info('保存成功');
                query();
            });
        }

        //编辑主要人员弹出框
        function memberEdit(personid){
            // 0 - 添加  1 - 编辑
            var config = {
                url:'../member/member-1100-edit.html?gid='+$routeParams.gid+'&editAdd=1&personid='+personid+'&opertype=30',
                title:'编辑主要人员',
                size:'lg'
            }
            Torch.openwin(config).then(function(){
                Torch.info('保存成功');
                query();
            });
        }

        //经营范围的修改
        function modify(){

            if(vm.modifyName == '保存'){
                var data = {
                    "entOpscopeUpdateForm" : {
                        "opscope" : vm.basicEntQueryForm.opscope,
                        "pripid" : vm.pripid
                    }
                }
                publicMethod(data,'modifyChange').then(function(data){
                    query();
                    vm.modifyShow = vm.modifyShow == false?true:false;
                    vm.modifyName = vm.modifyName ==  '修改'?'保存':'修改';
                });
            }else{
                vm.modifyShow = vm.modifyShow == false?true:false;
                vm.modifyName = vm.modifyName ==  '修改'?'保存':'修改';
            }
        }

        //营业期限
        function termSave(type){
            //type = 1 为保存 type = 0 为编辑
            if(type == 1){
                var data = {
                    "entTradatermUpdateForm" : {
                        "tradeterm" : vm.basicEntQueryForm.tradeterm,
                        "pripid" : vm.pripid
                    }
                }
                publicMethod(data,'termChange').then(function(data){
                    query();
                    vm.termShow = false;
                });
            }else if(type == 0){
                vm.termShow = true;
            }
        }

        //住所保存按钮
        function residenceSave(type){
            //type = 1 为保存 type = 0 为编辑
            if(type == 1){
                var data = {
                    "entDomUpdateForm" : {
                        "domprov" : vm.basicEntQueryForm.domprov,
                        "dom" : Torch.dict.getText('CA01', vm.basicEntQueryForm.domprov) + Torch.dict.getText('CA01',vm.basicEntQueryForm.domcity) + Torch.dict.getText('CA01',vm.basicEntQueryForm.domcounty) +vm.basicEntQueryForm.domother,
                        "domcounty" :  vm.basicEntQueryForm.domcounty,
                        "domcity" :  vm.basicEntQueryForm.domcity,
                        "domother" :  vm.basicEntQueryForm.domother,
                        "pripid" : vm.pripid
                    }
                }
                publicMethod(data,'residenceChange').then(function(data){
                    query();
                    vm.residenceShow = false;
                });
            }else if(type == 0){
                vm.residenceShow = true;
            }
        }

        //页面 住所 经营范围 保存编辑的公共方法
        function publicMethod(data,validate){
            vm.obj = {
                url:'/torch/service.do?fid=basicEntUpdate&gid='+$routeParams.gid,
                param:data,
                validate:validate
            };
            return Torch.dataSubmit(vm.obj);
        }

        //企业名称变更按钮
        function nameChanges(){
            var data = {
                "entNameUpdateForm": {
                    "entname": vm.basicEntQueryForm.entname,
                    "pripid": vm.pripid,
                    "oper" : 'change'
                }
            }
            publicMethod(data);
        }
        //企业名称还原按钮
        function nameReduction(){
            var data = {
                "entNameUpdateForm": {
                    "entname": vm.basicEntQueryForm.entname,
                    "pripid": vm.pripid
                }
            }
            publicMethod(data);
        }

        //法人变更职位的选择
        function setLegals(position){
            Torch.confirm('是否设为法人代表？',function(){
                var params={
                    url:"/torch/service.do?fid=memSignUpdate",
                    param:{
                        memSignUpdateForm : {
                            lerepsign: '1',
                            personid : vm.legalName.value,
                            gid : $routeParams.gid,
                            operType:'30',
                            position:position
                        }
                    }
                }
                Torch.dataSubmit(params).then(function(data){
                    Torch.info('设为法人代表');
                    //query(1);
                });
            })
        }

        //法人的变更按钮
        function legalChanges(data){
            if(vm.legalName.value == ''){
                Torch.info('请选择法人代表','danger');
                return
            }
            console.log(data);
            console.log(vm.basicMemQueryList);
            for(var i = 0 ; i < vm.basicMemQueryList.length ; i++){
                if(vm.basicMemQueryList[i].personid == data){
                    vm.legalDuties = vm.basicMemQueryList[i].position
                    break;
                }
            }
        }

        //获取数据
        function query(){

            //法人变更中的法人选择项
            var param = {
                url:'/dmj/queryMemNameList.do?gid='+$routeParams.gid
            };
            Torch.dataSubmit(param).then(function(data){
                vm.legalName.data = data;
            });

            vm.obj = {
                url:'/torch/service.do?fid=basicChangeQuery&gid='+$routeParams.gid,
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

        //自然人分页
        vm.basicInvQueryListNum = basicInvQueryListNum;
        //非自然人分页
        vm.basicCpInvQueryListNum = basicCpInvQueryListNum;
        //主要人员分页
        vm.basicMemQueryListNum = basicMemQueryListNum;
        //分公司分页
        vm.basicBranchQueryListNum = basicBranchQueryListNum;

        //分公司分页
        function basicBranchQueryListNum(){
            vm.obj = {
                url:'/torch/service.do?fid=basicChangeQuery&gid='+$routeParams.gid,
                param:{
                    //查询分支机构信息组件
                    basicBranchQueryList: {
                        _paging: vm.basicBranchQueryListPage,
                        _condition:{}
                    }
                }
            };
            Torch.dataSubmit(vm.obj).then(function(data){
                //分公司信息
                vm.basicBranchQueryList = data.basicBranchQueryList._data;
                //分公司信息分页
                vm.basicBranchQueryListPage = data.basicBranchQueryList._paging;
            });
        }

        //主要人员分页
        function basicMemQueryListNum(){
            vm.obj = {
                url:'/torch/service.do?fid=basicChangeQuery&gid='+$routeParams.gid,
                param:{
                    //查询主要人员信息组件
                    basicMemQueryList: {
                        _paging: vm.basicMemQueryListPage,
                        _condition:{}
                    }
                }
            };
            Torch.dataSubmit(vm.obj).then(function(data){
                //主要人员数据
                vm.basicMemQueryList = data.basicMemQueryList._data;
                //主要人员数据分页
                vm.basicMemQueryListPage = data.basicMemQueryList._paging;
            });
        }

        //非自然人分页
        function basicCpInvQueryListNum(){
            vm.obj = {
                url:'/torch/service.do?fid=basicChangeQuery&gid='+$routeParams.gid,
                param:{
                    //查询非自然人股东信息组件
                    basicCpInvQueryList: {
                        _paging: vm.basicCpInvQueryListPage,
                        _condition:{}
                    }
                }
            };
            Torch.dataSubmit(vm.obj).then(function(data){
                //非自然人
                vm.basicCpInvQueryList = data.basicCpInvQueryList._data;
                //非自然人分页
                vm.basicCpInvQueryListPage = data.basicCpInvQueryList._paging;
            });
        }

        //自然人分页
        function basicInvQueryListNum(){
            vm.obj = {
                url:'/torch/service.do?fid=basicChangeQuery&gid='+$routeParams.gid,
                param:{
                    //查询自然人股东信息组件
                    basicInvQueryList: {
                        _paging: vm.basicInvQueryListPage,
                        _condition:{}
                    }
                }
            };
            Torch.dataSubmit(vm.obj).then(function(data){
                //自然人
                vm.basicInvQueryList = data.basicInvQueryList._data;
                //自然人分页
                vm.basicInvQueryListPage = data.basicInvQueryList._paging;
            });
        }

        //初始化
        function init(){
            //可选可输入的经营期限
            vm.orgForm=["5","10","20","30","长期"];
            //选择设为法人的职位
            vm.legalDuties = [];
            //设为法定代表人填出框
            vm.selectManTpl = 'selectManTpl.html';
            //住所的编辑保存
            vm.residenceShow = false;
            //营业期限
            vm.termEdit = '';
            //营业期限的编辑保存
            vm.termShow = false;
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
            query();
        }
        init();
    }
})();

//补充信息
(function(){
    angular.module('app')
        .controller('supplyController',supplyController)

    supplyController.$inject = ['dataService','modalService','$scope','$routeParams','$timeout','$location'];

    //补充信息
    function supplyController(dataService,modalService,$scope,$routeParams,$timeout,$location){

        var vm = this;
        //补充信息页面获取数据
        vm.query = query;
        //保存
        vm.saveSetup = saveSetup;
        //审批意见
        vm.opinion = opinion;
        //上一步
        vm.previous = previous;

        //上一步
        function previous(){
            var params={
                url:"/torch/service.do?fid=supUpdate_90050037277",
                param:{
                    supUpdateForm  : vm.supQueryForm
                },
                validate: 'supplyChange'
            }
            params.param.supUpdateForm.gid = $routeParams.gid;
            params.param.supUpdateForm.proloc = vm.supQueryForm.domother;
            params.param.supUpdateForm.dom = Torch.dict.getText('CA01', vm.supQueryForm.domprov) + Torch.dict.getText('CA01',vm.supQueryForm.domcity) + Torch.dict.getText('CA01',vm.supQueryForm.domcounty) +vm.supQueryForm.domother;
            Torch.dataSubmit(params).then(function(data){
                if($routeParams.gid !== undefined){
                    $location.path('/applyChange/'+$routeParams.nameid+'/'+$routeParams.gid)
                }else{
                    Torch.info('请完成经办人的填写，并保存','danger');
                }
            });

        }

        //审批意见弹出框
        function opinion(){
            var config = {
                url:'../setup/cp-1100-opinion.html?gid='+$routeParams.gid+'&opertype=30',
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

        //保存
        function saveSetup(){
            var params={
                url:"/torch/service.do?fid=supUpdate_90050037277",
                param:{
                    supUpdateForm  : vm.supQueryForm
                },
                validate: 'supplyChange'
            }
            params.param.supUpdateForm.gid = $routeParams.gid;
            params.param.supUpdateForm.proloc = vm.supQueryForm.domother;
            params.param.supUpdateForm.dom = Torch.dict.getText('CA01', vm.supQueryForm.domprov) + Torch.dict.getText('CA01',vm.supQueryForm.domcity) + Torch.dict.getText('CA01',vm.supQueryForm.domcounty) +vm.supQueryForm.domother;
            Torch.dataSubmit(params).then(function(data){
                Torch.info('保存成功');
                query();
            });
        }

        //补充信息页面获取数据
        function query(){
            var params={
                url:"/torch/service.do?fid=supQuery_00050081268",
                param:{
                    supQueryDetail : {
                        gid : $routeParams.gid
                    }
                }
            }

            Torch.dataSubmit(params).then(function(data){
                vm.supQueryForm	= data.supQueryDetail;
            });
        }

        function init(){
            //页面数据
            vm.supQueryForm = {
                //电话
                tel: "",
                //邮政编码
                postalcode: "",
                //邮箱
                email:"",
                //生产经营地
                proloc:'',
                //住所产权
                domproright:'',
                //省
                domprov:"",
                //市
                domcity:"",
                //地区
                domcounty:"",
                //详细地址
                domother:"",
                //执行副本数
                copyNo:"",
                gid:''
            }
            query();
        }

        init();
    }
})();