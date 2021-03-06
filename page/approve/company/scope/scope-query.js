(function(){
    angular.module('app',['common'])
        .controller('queryController',queryController)
    queryController.$inject = ['$scope','dataService'];

    function queryController($scope,dataService){
        var gid = Torch.getParam('gid');
        var vm = this;
        //初始化
        vm.init = init;
        //获取数据
        vm.query = query;
        //确定
        vm.determine = determine;
        ////导航的收起和展示
        //vm.navbarToggle = navbarToggle;
        //分页调用方法
        vm.changeNum = changeNum;
        //点击导航调用方法
        vm.selectTree = selectTree;
        //搜索方法
        vm.search = search;

        //搜索方法
        function search(){

            //列表数据
            var params={
                url:"/torch/service.do?fid=scopeMoreResouceQuery",
                param:{
                    "scopeMoreResouceQueryList" : {
                        "_data" : [],
                        "_paging" : vm.pageNo,
                        "pid" : vm.pid,
                        "dmName":vm.keyword
                    }
                }
            }
            Torch.dataSubmit(params).then(function(data){
                vm.queryList = data.scopeMoreResouceQueryList._data;
                vm.pageNo = data.scopeMoreResouceQueryList._paging;
            });
        }

        //点击导航调用方法
        function selectTree(item){
            //当前导航的pid
            vm.pid = item.id;
            vm.keyword = '';
            //列表数据
            var params={
                url:"/torch/service.do?fid=scopeMoreResouceQuery",
                param:{
                    "scopeMoreResouceQueryList" : {
                        "_data" : [],
                        "_paging" : vm.pageNo,
                        "pid" : item.id,
                        "dmName":vm.keyword
                    }
                }
            }
            Torch.dataSubmit(params).then(function(data){
                vm.queryList = data.scopeMoreResouceQueryList._data;
                vm.pageNo = data.scopeMoreResouceQueryList._paging;
            });
        }

        //分页调用方法
        function changeNum(pageNo){
            query();
        }

        //确定
        function determine(){
            Torch.closewin(vm.checkList);
        }

        function init(){
            vm.pageNo = {
                //当前页数
                pageNo: 1,
                //每页的条数
                pageSize: 10,
                //列表数据总数
                total: ''
            };
            //列表数据
            vm.queryList = [];
            vm.checkList = [];
            
            //导航数据
            vm.treeNodes = [];
            //搜索关键字
            vm.keyword = '';
            //默认导航
            vm.pid = 'CA06A05'

            query();
        }
        init();

        function query(){

            //列表数据
            var params={
                url:"/torch/service.do?fid=scopeMoreResouceQuery",
                param:{
                    "scopeMoreResouceQueryList" : {
                        "_data" : [],
                        "_paging" : vm.pageNo,
                        "pid" : vm.pid,
                        "dmName":vm.keyword
                    }
                }
            }
            Torch.dataSubmit(params).then(function(data){
                vm.queryList = data.scopeMoreResouceQueryList._data;
                vm.pageNo = data.scopeMoreResouceQueryList._paging;
            });

            //导航数据
            var obj={
                url:"/torch/service.do?fid=scopeBusinessMoreQuery",
                param:{
                    scopeMoreQueryList : {}
                }
            }
            Torch.dataSubmit(obj).then(function(data){
                vm.treeNodes = data.scopeMoreQueryList._data
            });
        }
    }
})();

