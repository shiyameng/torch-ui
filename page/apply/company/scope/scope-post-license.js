/**
 * Created by lenovo on 2017/4/24.
 */
(function(){
    angular.module('app',['common'])
        .controller('postLicenseController',postLicenseController)

    postLicenseController.$inject = ['dataService','$scope'];

    function postLicenseController(dataService,$scope){
        var gid = Torch.getParam('gid');
        var pripid = Torch.getParam('pripid');
        var vm = this;
        //初始化
        vm.init = init;
        //获取数据
        vm.query = query;
        //保存确定
        vm.save = save;
        //分页
        vm.changeNum = changeNum;
        //搜索
        vm.search = search;

        //搜索
        function search(){
            vm.pageNo = {
                pageNo :'1',
                pageSize:'10',
                total :''
            }
            query()
        }

        //分页
        function changeNum(pageNo){
            query()

        }

        //保存
        function save(){
            var scopeAfterInfo = [];
            for(var i = 0 ; i < vm.checkList.length ; i++){
                scopeAfterInfo.push({
                    gid:gid,
                    pripid:pripid,
                    licmettermemo: vm.checkList[i].licMetterMemo,
                    licanth:vm.checkList[i].licAnth,
                    lictype:'2'
                });
            }
            var params={
                url:"/approve/cp/setup/saveAfterLicence.do",
                param:{
                    scopeAfterInfo:scopeAfterInfo
                }
            }


            Torch.dataSubmit(params).then(
                function(data){
                    Torch.closewin();
                });
        }

        //页面加载全部数据
        function query(){

            var params={
                url:"/torch/service.do?fid=scopeAfterQuery",
                param:{
                    scopeAfterQueryList : {
                        _paging :vm.pageNo,
                        _condition: {
                            licMetterMemo:vm.keyword
                        }
                    }

                }
            }

            Torch.dataSubmit(params).then(
                function(data){
                    vm.queryList = data.scopeAfterQueryList._data;
                    vm.pageNo = data.scopeAfterQueryList._paging;
                });
        }

        function init(){
            vm.checkList =[];
            vm.queryList = [];
            //关键字
            vm.keyword = '';
            //分页
            vm.pageNo = {
                pageNo :'1',
                pageSize:'10',
                total :''
            }
            query();
        }
        init();
    }
})();

