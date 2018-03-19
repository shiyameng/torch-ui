(function(){
    angular.module('app',['common'])
        .controller('changeInfoController', changeInfoController);

    changeInfoController.$inject=['$scope','dataService'];

    function changeInfoController($scope,dataService){
    	var vm=this;
    	//精确查询
    	vm.accurate=accurate;
    	//模糊查询
    	vm.vague=vague;
    	//精确查询或者模糊查询，如何什么都不输入则为全查询
    	vm.search=search;
    	//清空查询条件
    	vm.reset=reset;
    	//选中的是模糊查询还是精确查询
    	vm.select=select;
    	//名称变更
    	vm.check=check;
        //分页
		vm.changeNum = changeNum;
    	//默认为精确查询
    	vm.checkbox1='accurate';
    	//flag根据不同的值来进行不同的查询，默认为精确查询
    	var flag=vm.checkbox1;
    	//清空查询条件
    	function reset(){
            vm._condition = {
                //注册号/社会信用统一代码
            		code :'',
                //企业名称
            		entname :''
            };
    	}
    	//模糊查询或者精确查询的标识赋值
    	function select(x){
    		if(x=='accurate'){
    			flag='accurate';
    		}
    		if(x=='vague'){
    			flag='vague';
    		}
    	}
    	//查询
    	function search(){
    		if(flag=='accurate'){
    			accurate();
    		}else if(flag=='vague'){
    			vague();
    		}
    		
    	}
    	//精确查询
    	function accurate(){
    		var params={
    				url:"/torch/service.do?fid=entQuery",
    				param:{
    					entAccurateQueryList:{
    						 _condition:{
    							 entname : vm._condition.entname || '',
    							 regno : vm._condition.code || '',
    							 uniscid : vm._condition.code || ''
    						 }
    					}
    				}
    		};
    		Torch.dataSubmit(params).then(function(data){
                if(!data._error){
                    vm.entryList = data.entAccurateQueryList._data;
                    vm._paging = data.entAccurateQueryList._paging;
                }else{
                    vm.entryList = [];
                    vm._paging = {
                        pageNo: '',
                        pageSize: '',
                        total: ''
                    };
                }
    		});    	
    	
    	}
    	//模糊查询
    	function vague(){
    		var params={
    				url:"/torch/service.do?fid=entQuery",
    				param:{
    					entVagueQueryList:{
    						 _condition:{
    							 entname : vm._condition.entname || '',
    							 regno : vm._condition.code || '',
    							 uniscid : vm._condition.code || ''
    						 }
    					}
    				}
    		};
    		Torch.dataSubmit(params).then(function(data){
                if(!data._error){
                    vm.entryList = data.entVagueQueryList._data;
                    vm._paging = data.entVagueQueryList._paging;
                }else{
                    vm.entryList = [];
                    vm._paging = {
                        pageNo: '',
                        pageSize: '',
                        total: ''
                    };
                }
    		
    		});    	
    	}
        //分页
        function changeNum(page){
           if (flag == 'accurate') {
        	     vm.obj = {
        	                url:'/torch/service.do?fid=entQuery',
        	                param:{
        	                	entAccurateQueryList: {
        	                        _paging: page,
        	                        _condition:{
           							 entname : vm._condition.entname || '',
           							 regno : vm._condition.code || '',
           							 uniscid : vm._condition.code || ''
           						 }
        	                    }
        	                }
        	            };
        	            Torch.dataSubmit(vm.obj).then(function(data){
        	                if(!data._error){
        	                    vm.entryList = data.entAccurateQueryList._data;
        	                    vm._paging = data.entAccurateQueryList._paging;
        	                }else{
        	                    vm.entryList = [];
        	                    vm._paging = {
        	                        pageNo: '',
        	                        pageSize: '',
        	                        total: ''
        	                    };
        	                }

        	            })
				}else{
				     vm.obj = {
				                url:'/torch/service.do?fid=entQuery',
				                param:{
				                	entVagueQueryList: {
				                        _paging: page,
				                        _condition:{
			    							 entname : vm._condition.entname || '',
			    							 regno : vm._condition.code || '',
			    							 uniscid : vm._condition.code || ''
			    						 }
				                    }
				                }
				            };
				            Torch.dataSubmit(vm.obj).then(function(data){
				                if(!data._error){
				                    vm.entryList = data.entVagueQueryList._data;
				                    vm._paging = data.entVagueQueryList._paging;
				                }else{
				                    vm.entryList = [];
				                    vm._paging = {
				                        pageNo: '',
				                        pageSize: '',
				                        total: ''
				                    };
				                }

				            })
				}

       
        }
    	//名称变更
    	function check(nameid, gid, pripid){
    		var params={
    				url:"/approve/nm/change/checkState.do?nameid="+nameid + "&gid=" + gid
    		};
    		Torch.dataSubmit(params).then(function(data){
    			if (data != null) {
					var _gid = data.gid;
					var _nameid = data.nameid;
					Torch.redirect("./nm-change.html?gid=" + _gid + "&nameid=" + _nameid + '&pripid=' + pripid);
				}
    		});    	
    	
    	}
    	//执行页面初始化
    	function init(){
    	     vm.entryList = [];
             vm._condition = {
 		    		entname :'',
 		    		code : ''
 	            };

             vm._paging = {
                 pageNo: '',
                 pageSize: '',
                 total: ''
             };
    		accurate();
    	};
    	init();
    }
})();